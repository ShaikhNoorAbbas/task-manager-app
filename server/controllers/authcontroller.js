import User from "../models/User.js";

import bcrypt from "bcryptjs";

import jwt from "jsonwebtoken";

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

export const signin = async (req, res) => {

    try {

        const { email, password } = req.body;

        // checking email password
        if (!email || !password) {

            return res.status(400).json({
                success: false,
                message: "Please Provide Both Email and password"
            })
        }

        //Checking email existence
        const user = await User.findOne({ email });

        if (!user) {
            res.status(400).json({
                success: false,
                message: "Invalid Email or password"
            })
        }

        //Comparing typed Password with hashed password in DB
        const isPasswordMatch = await bcrypt.compare(password, user.password)
        if (!isPasswordMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or password"
            })
        }


        // creating JWT Token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        )

        // sending Back with token info
        res.status(200).json({
            success: true,
            message: "Login Successfully",
            token,
            user
        });


    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something Went Wrong while Signin up"
        })
    }

}