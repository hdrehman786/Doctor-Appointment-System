import User from "../Modals/UserModel.js";
import bcrypt from "bcryptjs";
import genrateToken from "../utils/genratetoken.js";
import jwt, { decode } from "jsonwebtoken";



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


        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 30 * 24 * 60 * 60 * 1000,
            secure: process.env.NODE_ENV === "production",
            secure: true,
            sameSite: "Lax",
        })

        res.json({
            message: "Logged in successfully",
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



export const verifyToken = async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        res.json({
            message: "Token has not found",
            error: true,
            success: false
        })
    }
    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.userId = decoded.user._id;
        next();
    } catch (error) {
        res.json({
            message: error || error.message,
            error: true,
            success: false
        })
    }

}



export const getprofile = async (req, res) => {
    const id = req.userId;
    try {
        const user = await User.findById(id).select("-password");
        if (!user) {
            res.json({
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
        res.clearCookie("token", {
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production",
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