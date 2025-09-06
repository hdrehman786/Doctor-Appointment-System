import { getTimeSlots } from "../../client/src/utils/usersystem.js";
import Appointment from "../Modals/AppointmentModel.js";
import Doctor from "../Modals/DoctorModel.js";




export const addAppointment = async (req, res) => {
    const { doctor, date, time, fees } = req.body;
    const patient = req.userId;



    if (!doctor || !date || !time || !fees || !patient) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {

        const doctorData = await Doctor.findById(doctor); // 👈 renamed

        if (!doctorData) {
            return res.status(404).json({ message: "Doctor not found" });
        }

        const appntId = doctorData.appointment_date.find((item) => item._id.toString() === date);


        function convert(timeRange) {
            const [start, end] = timeRange.split(" - ");
            return {
                startTime: new Date("1970/01/01 " + start).toTimeString().slice(0, 5),
                endTime: new Date("1970/01/01 " + end).toTimeString().slice(0, 5),
            };
        }



        // function isSame(slot1, slot2) {
        //     return slot1.startTime === slot2.startTime && slot1.endTime === slot2.endTime;
        // }

        const incoming = convert(time);



        const bookedSlot = appntId.slots.find((slot) => {
            if (slot.startTime === incoming.startTime && slot.endTime === incoming.endTime) {
                slot.isBooked = true;   // update slot
                return true;            // return this slot
            }
            return false;
        });


        if(!bookedSlot){
            return res.json({
                message : "The slot has not found",
            })
        }

        const newAppointment = new Appointment({
            doctor: doctorData._id,
            patient,
            date : appntId.date,
            time,
            fees,
        });

        await newAppointment.save();
        await doctorData.save();
        res
            .status(201)
            .json({ message: "Appointment created successfully", newAppointment });
    } catch (error) {
        console.error("Error creating appointment:", error);
        res.status(500).json({ message: "Error creating appointment", error: error.message });
    }
};



export const getAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find().populate({
            path: "doctor",
            populate: {
                path: "doctor",
            }
        }).populate("patient");
        console.log("appointemes", appointments);
        res.status(200).json(appointments);
    } catch (error) {
        res.status(500).json({ message: "Error fetching appointments", error: error.message });
    }
}

export const getAppointmentById = async (req, res) => {
    const id = req.userId;
    if (!id) {
        return res.status(400).json({ message: "Appointment ID is required" });
    }
    try {
        const appointment = await Appointment.find({
            patient: id
        }).populate({
            path: "doctor",
            populate: {
                path: "doctor",
            }
        });
        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }
        res.status(200).json({
            message: "Appointment fetched successfully",
            data: appointment,
            error: false,
            success: true
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching appointment", error: error.message });
    }
}

// delete and Approve Appointment
export const deleteAppointment = async (req, res) => {
    const { id } = req.params;
    console.log(id);
    if (!id) {
        return res.status(400).json({ message: "Appointment ID is required" });
    }

    try {
        const appointment = await Appointment.findByIdAndDelete(id);
        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }
        res.status(200).json({ message: "Appointment cancelled successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error cancelling appointment", error: error.message });
    }
}

export const approveAppointment = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ message: "Appointment ID is required" });
    }

    try {
        const appointment = await Appointment.findByIdAndUpdate(id, { status: 'approved' }, { new: true });
        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }
        res.status(200).json({ message: "Appointment approved successfully", appointment });
    } catch (error) {
        res.status(500).json({ message: "Error approving appointment", error: error.message });
    }
}



export const cancelAppointment = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ message: "Appointment ID is required" });
    }

    try {
        const appointment = await Appointment.findByIdAndUpdate(id, { status: 'cancelled' }, { new: true });
        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }
        res.status(200).json({ message: "Appointment cancelled successfully", appointment });
    } catch (error) {
        res.status(500).json({ message: "Error cancelling appointment", error: error.message });
    }
}


export const completeAppointemen = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "Appointment ID is required" });
        }
        const appointment = await Appointment.findByIdAndUpdate(id, { status: 'completed' }, { new: true });
        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }
        res.status(200).json({ message: "Appointment completed successfully", appointment });
    } catch (error) {
        res.status(500).json({ message: "Error completing appointment", error: error.message });
    }
}

export const expiredAppointment = async (req, res) => {
    try {
        const now = new Date();
        const result = await Appointment.updateMany(
            { date: { $lt: now }, status: { $in: ['pending', 'approved'] } },
            { $set: { status: 'expired' } }
        );
        res.status(200).json({ message: "Expired appointments updated successfully", modifiedCount: result.nModified });
    } catch (error) {
        res.status(500).json({ message: "Error updating expired appointments", error: error.message });
    }
}