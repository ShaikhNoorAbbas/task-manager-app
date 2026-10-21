import User from "../models/User.js";

import bcrypt from "bcryptjs";


export const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;


        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please Provide Name,Email and Password"
            })
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User with this Email Already Exists"
            })
        }
        
        const salt = await bcrypt.genSalt(10);

        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = await User.create({
            name,
            email,
            password: hashedPassword
        })

        res.status(201).json({
            success: true,
            message: "user registered Successfully",
            newUser
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error during Signup",
            error: error.message
        })
    }
}