import Appointment from "../Modals/AppointmentModel.js";




export const addAppointment = async (req,res) => {
    const { doctor, date, time, fees } = req.body;
    const patient = req.userId;
    if (!doctor || !date || !time || !fees || !patient) {
        return res.status(400).json({ message: "All fields are required" });
    }
    try {
        const newAppointment = new Appointment({
            doctor,
            patient,
            date,
            time,
            fees
        });

        await newAppointment.save();
        res.status(201).json({ message: "Appointment created successfully", appointment: newAppointment });
    } catch (error) {
        res.status(500).json({ message: "Error creating appointment", error: error.message });
    }
}


export const getAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find().populate({
            path: "doctor",
            populate: {
                path: "doctor",
            }
        }).populate("patient");
        res.status(200).json(appointments);
    } catch (error) {
        res.status(500).json({ message: "Error fetching appointments", error: error.message });
    }
}

export const getAppointmentById = async (req, res) => {
    const  id  = req.userId;
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
            data : appointment,
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