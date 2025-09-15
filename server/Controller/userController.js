import User from "../Modals/UserModel.js";
import bcrypt from "bcryptjs";
import genrateToken from "../utils/genratetoken.js";
import jwt, { decode } from "jsonwebtoken";
import Appointment from "../Modals/AppointmentModel.js";



export const register = async (req, res) => {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ msg: "User already exists" });
    };
    if (!name || !email || !password) {
        return res.status(400).json({ msg: "Please fill in all fields" });
    };
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedpassword = await bcrypt.hash(password, salt);
        const user = new User({
            name,
            email,
            password: hashedpassword
        });
        await user.save();
        res.json({
            msg: "User created successfully",
            error: false,
            success: true,
            data: user
        })


    } catch (error) {
        res.json({
            message: error.message || error,
            success: false,
            error: true
        })
    }

}


export const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ msg: "Please fill in all fields" });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: "Invalid credentials" });
        }

        const token = await genrateToken(user);

        // ✅ consistent cookie options
        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "None",   // important for cross-site
            path: "/",          // must match on logout
        };

        res.cookie("token", token, cookieOptions);

        res.json({
            message: "Logged in successfully",
            error: false,
            success: true,
            data: user,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message || "Something went wrong during login",
            success: false,
            error: true,
        });
    }
};





export const verifyToken = async (req, res, next) => {
    try {
        const token = req.cookies?.token || req.headers["authorization"]?.split(" ")[1];
        if (!token) {
            return res.status(401).json({
                message: "Access denied. No token provided.",
                error: true,
                success: false
            });
        }

        // 2️⃣ Verify token
        const decoded = jwt.verify(token, process.env.SECRET_KEY);

        // 3️⃣ Attach userId to request
        req.userId = decoded.id;

        next(); // ✅ Continue
    } catch (error) {
        // 4️⃣ Handle different JWT errors
        let msg = "Invalid token";
        if (error.name === "TokenExpiredError") msg = "Token expired, please login again.";
        if (error.name === "JsonWebTokenError") msg = "Malformed token.";

        return res.status(403).json({
            message: msg,
            error: true,
            success: false
        });
    }
};





export const getprofile = async (req, res) => {
    const id = req.userId;
    try {
        const user = await User.findById(id).select("-password");
        if (!user) {
            return res.json({
                message: "The user has not fined",
                error: true,
                success: false,
            })
        }
        res.json({
            message: "get data successfully",
            error: false,
            success: true,
            data: user
        })
    } catch (error) {
        res.json({
            message: error || error.message,
            error: true,
            success: false
        })
    }
}



export const Logout = async (req, res) => {
    try {
        // ✅ use the exact same options as login
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "None",
            path: "/",   // must match
        });

        return res.status(200).json({
            message: "Logout Successfully",
            error: false,
            success: true,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message || "Something went wrong during logout",
            success: false,
            error: true,
        });
    }
};





export const EditProfile = async (req, res) => {
    const { name, email, age, address, gender, avatar, phone } = req.body;
    const id = req.userId;
    if (!id) {
        return res.status(400).json({
            message: "User ID is required",
            error: true,
            success: false
        })
    }

    try {
        const user = await User.findByIdAndUpdate(id, {
            name,
            email,
            age,
            address,
            gender,
            avatar,
            phonenumber: phone
        },
            { new: true, runValidators: true }
        )
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                error: true,
                success: false
            })
        }

        res.json({
            message: "Profile updated successfully",
            error: false,
            success: true,
            data: user
        })

    } catch (error) {
        res.json({
            message: error.message || error,
            success: false,
            error: true
        })
    }
}



export const getAllData = async (req, res) => {
    try {
        const appointments = await Appointment.find().populate("patient");
        const patient = await User.find({
            role: "Patient"
        }).countDocuments();
        const doctors = await User.find({
            role: "Doctor"
        }).countDocuments();

        if (!appointments || !patient || !doctors) {
            res.status(404).json({
                message: "Not found all requirments"
            })
        };
        const appointments_count = await Appointment.find().countDocuments();
        res.json({
            appointments: appointments,
            patients: patient,
            doctors: doctors,
            appointments_count: appointments_count
        })
    } catch (error) {
        res.status(500).json({
            message: "interval server error",
            error: error.message
        })
    }
}