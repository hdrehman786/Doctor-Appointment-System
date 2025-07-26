
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

  console.log(id);

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
