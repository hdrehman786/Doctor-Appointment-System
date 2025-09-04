
import Appointment from "../Modals/AppointmentModel.js";
import Doctor from "../Modals/DoctorModel.js";
import User from "../Modals/UserModel.js";


export const addDoctor = async (req, res) => {
  try {
    const { email, specialisation, experience, fees, education, summary } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User with this email not found",
        success: false,
        error: true,
      });
    }

    user.role = "Doctor";
    await user.save();

    const existingDoctor = await Doctor.findOne({ doctor: user._id });
    if (existingDoctor) {
      return res.status(400).json({
        message: "Doctor profile already exists for this user",
        success: false,
        error: true,
      });
    }

    // 4. Create a new doctor profile
    const newDoctor = await Doctor.create({
      doctor: user._id,
      specialisation,
      experience,
      fees,
      education,
      summary,
    });

    res.status(201).json({
      message: "Doctor created successfully",
      success: true,
      data: newDoctor
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Something went wrong",
      success: false,
      error: true,
    });
  }
};



export const getDoctorProfile = async (req, res) => {
  try {
    const { specialisation } = req.query;

    let filter = {};

    if (specialisation) {
      filter = { specialisation };
    }

    const alldoctors = await Doctor.find(filter).populate("doctor");
    res.status(200).json({
      message: "Doctors found successfully",
      success: true,
      data: alldoctors
    })



  } catch (error) {
    res.json({
      message: error.message || error,
      success: false,
      error: true
    })
  }
}

export const getDoctorProfileById = async (req, res) => {
  try {
    const { id } = req.params;

    const doctor = await Doctor.findById(id).populate("doctor");

    if (!doctor) {
      return res.status(404).json({
        message: "Doctor not found",
        success: false,
        error: true,
      });
    }

    res.status(200).json({
      message: "Doctor found successfully",
      success: true,
      data: doctor,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Something went wrong",
      success: false,
      error: true,
    });
  }
}



export const addManyDoctors = async (req, res) => {
  try {
    const doctors = req.body;

    const result = await User.insertMany(doctors);
    res.status(201).json({
      message: "Doctors added successfully",
      success: true,
      data: result
    });


  } catch (error) {

    res.status(500).json({
      message: error.message || "Something went wrong",
      success: false,
      error: true,
    });
  }
}


export const getDoctorAppointments = async (req, res) => {
  const id = req.userId;


  if (!id) {
    return res.status(400).json({ message: "Doctor ID is required" });
  }

  try {
    const doctor = await Doctor.find({ doctor: id });
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const appointments = await Appointment.find({ doctor: doctor[0]._id })
      .populate('patient');

    if (!appointments || appointments.length === 0) {
      return res.status(200).json({
        message: "No appointments found for this doctor",
        data: [],
        hasAppointments: false,
        success: true,
        error: false
      });
    }

    res.status(200).json({

      message: "Appointments fetched successfully",
      data: appointments,
      hasAppointments: true,
      success: true,
      error: false

    });

  } catch (error) {
    res.status(500).json({
      message: "Error fetching appointments",
      error: error.message,
      success: false
    });
  }
};



export const deleteDoctor = async (req, res) => {
  const { id } = req.params;
  try {
    {
      const doctor = await Doctor.findById(id);
      if (!doctor) {
        return res.status(404).json({ message: "Doctor not found" });
      }
      const appointments = await Appointment.find({ doctor: id });
      if (appointments.length > 0) {
        return res.status(400).json({
          message: "Cannot delete doctor with existing appointments",
          success: false,
          error: true
        });
      }

      const user = await User.findByIdAndUpdate(doctor.doctor, {
        role: "Patient"
      }, { new: true });

      console.log(user);
      const deletedDoctor = await Doctor.findByIdAndDelete(id);
      res.status(200).json({
        message: "Doctor deleted successfully",
        success: true,
        data: deletedDoctor
      });
    }

  } catch (error) {
    res.status(500).json({
      message: error.message || error || "Something went wrong",
      success: false,
      error: true,
    });
  }

}


export const editDoctorProfile = async (req, res) => {
  const { id } = req.params;
  const {
    specialisation, experience, fees, education, summary } = req.body;

  try {
    const doctor = await Doctor.findById(id);

    if (!doctor) {
      return res.status(404).json({
        message: "Doctor not found",
        success: false,
        error: true,
      });
    }


    doctor.specialisation = specialisation;
    doctor.experience = experience;
    doctor.fees = fees;
    doctor.education = education;
    doctor.summary = summary;

    const updatedDoctor = await doctor.save();

    res.json({
      message: "Doctor profile updated successfully",
      success: true,
      data: updatedDoctor,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message || "Something went wrong",
      success: false,
      error: true,
    });
  }
};



export const addAppointmentDate = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, day, slots } = req.body;

    if (!id || !date || !day || !slots) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const doctor = await Doctor.findOne({ doctor: id });
    if (!doctor) {
      return res.status(404).json({
        message: "Doctor not found against this ID",
      });
    }

    const existingDay = doctor.appointment_date.find((item) => item.day === day);

    if (existingDay) {
      return res.json({
        message: "This day is already in your list"
      })
    } else {
      doctor.appointment_date.push({ date, day, slots });
    }

    const savedDoctor = await doctor.save();

    return res.status(200).json({
      message: "Appointment date/slots updated successfully",
      data: savedDoctor,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message || error,
    });
  }
};



export const getTimeSlots = async (req, res) => {
  try {
    const id = req.userId;

    if (!id) {
      return res.status(404).json({
        message: "Id not found"
      })
    };

    const doctor = await Doctor.findOne({
      doctor: id
    });

    if (!doctor) {
      return res.json({
        message: "The doctor not found"
      })
    };

    res.json({
      message: "Doctor data get successfully",
      data: doctor
    })

  } catch (error) {
    res.status(500).json({
      message: "The interval Server Error",
      error: error
    })
  }
}



const deleteTimeSlots = async (req, res) => {
  try {
    const id = req.userId;
    const { date, day, slotIndex } = req.body;

    if (!id) {
      return res.json({
        message: "id is required to edit the slots"
      })

      const doctor = await Doctor.findOne({
        doctor: id
      });

      if (!doctor) {
        return res.json({
          message: "The doctor has not found againts this id"
        })
      }


    }
  } catch (error) {
    res.json({
      message: "Interval server error",
      error: error.message
    })
  }
}


export const editAppointmentDate = async (req, res) => {
  try {
    const { id } = req.params;

    const { appointmentId, date, day, slots } = req.body;

    if (!id) {
      return res.status(400).json({
        message: "Doctor ID is required",
      });
    }

    const doctor = await Doctor.findOne({ doctor: id });
    if (!doctor) {
      return res.status(404).json({
        message: "Doctor not found against this ID",
      });
    }


    const appointmentIndex = doctor.appointment_date.findIndex(
      (item) => item._id.equals(appointmentId)
    );

    if (appointmentIndex === -1) {
      return res.status(404).json({
        message: "No appointment found for this day",
      });
    }

    if (appointmentIndex !== -1) {
      if (slots) {
        doctor.appointment_date[appointmentIndex].slots = slots; // pura slots array replace
      }
      if (date) {
        doctor.appointment_date[appointmentIndex].date = date;
      }
      if (day) {
        doctor.appointment_date[appointmentIndex].day = day;
      }
      await doctor.save();
    } else {
      console.log("Appointment not found");
    }




    return res.status(200).json({
      message: "Appointment updated successfully",
      data: doctor.appointment_date,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message || error,
    });
  }
};





export const deleteAppointmentDate = async (req, res) => {
  try {
    const { id } = req.params
    const { appointmentId } = req.body;

    console.log(id, appointmentId);

    if (!id || !appointmentId) {
      return res.json({
        message: "The id,s are required",
      })
    };

    const doctor = await Doctor.findOne({
      doctor: id
    });

    if (!doctor) {
      return res.json({
        message: "The doctor not founf againt this id"
      })
    };

    const appointmentIndx = doctor.appointment_date.find((item) => {
      item._id = appointmentId
    });

    doctor.appointment_date.splice(appointmentIndx, 1);

    await doctor.save();

    res.json({
      message: "The appointment date deleted successfully",
      data: doctor
    })

  } catch (error) {
    res.json({
      message: "The interval server error please try again later",
      error: error.message
    })
  }
}


// export const expireTimeslts = async (req, res) => {
//   try {
//     const id = req.userId;
//     if (!id) {
//       return res.status(403).json({ message: "The id is required" });
//     }
//     const doctor = await Doctor.findOne({ doctor: id });

//     const todayDate = new Date();

//     doctor.appointment_date.forEach((item) => {
//       const itemDate = new Date(item.date);
//       if (todayDate > itemDate) {
//         item.slots((slots)=>{

//         })
//       }
//     })
//     return res.json({ message: "Time slots expired successfully", data: doctor });
//   } catch (error) {
//     res.json({ message: "The interval server error please try again later", error: error.message })
//   }
// }
