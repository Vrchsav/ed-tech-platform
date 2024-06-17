const User = require('../models/User');
const OTP = require('../models/OTP');
const Profile = require('../models/Profile');
const otpGenerator = require('otp-generator');
const validator = require("email-validator");

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config()




exports.sendOTP = async (req, res) => {
    try {
        const { email } = req.body;
        if (!validator.validate(email)) {
            return res.status(401).json({
                success: false,
                message: "Invalid email"
            })
        }
        const checkUserPresent = await User.findOne({ email });
        if (checkUserPresent) {
            return res.status(401).json({
                success: false,
                message: "User already exists"
            })
        }
        var otp = otpGenerator.generate(6, {
            lowerCaseAlphabets: false,
            upperCaseAlphabets: false,
            specialChars: false
        });
        let result = await OTP.findOne({ otp: otp });
        while (result) {
            otp = otpGenerator.generate(6, {
                lowerCaseAlphabets: false,
                upperCaseAlphabets: false,
                specialChars: false
            });
        }
        const otpPayload = {
            email: email,
            otp: otp
        }
        const optBody = await OTP.create(otpPayload);
        console.log(optBody);
        res.status(200).json({
            success: true,
            message: "OTP sent successfully",
            otp
        })


    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: "opt sending failed" + " " + err.message
        })

    }

}


//========================================================================================================================================================
exports.signUp = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            accountType,
            contactNumber,
            otp
        } = req.body;
        if (!firstName || !lastName || !email || !password || !confirmPassword || !contactNumber || !otp) {
            return res.status(401).json({
                success: false,
                message: "All fields are required"
            })
        }

        if (password !== confirmPassword) {
            return res.status(401).json({
                success: false,
                message: "Passwords do not match"
            })
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(401).json({
                success: false,
                message: "User already exists"
            })
        }
        const recentOtp = await OTP.findOne({ email }).sort({ createdAt: -1 }).limit(1);
        console.log(recentOtp);

        if (recentOtp.length == 0) {
            return res.status(401).json({
                success: false,
                message: "OTP not found"
            })
        } else if (otp !== recentOtp.otp) {
            return res.status(401).json({
                success: false,
                message: "Invalid OTP"
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10);


        const profileDetails = await Profile.create({
            gender: null,
            dateOfBirth: null,
            about: null,
            contactNumber: null

        })

        const user = await User.create({
            firstName,
            lastName,
            email,
            contactNumber,
            password: hashedPassword,
            accountType,
            additionalDetails: profileDetails._id,
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`
        })

        res.status(200).json({
            success: true,
            message: "User created successfully",
            user
        })

    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: "User creation failed" + " " + err.message
        })
    }

}


//=========================================================================================================================

exports.login = async (req, res) => {
    try {

        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(401).json({
                success: false,
                message: "All fields are required"
            })
        }

        const user = await User.findOne({ email }).populate("additionalDetails");

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found please signup"
            })
        }
        if (await bcrypt.compare(password, user.password)) {

            const payload = {
                email: user.email,
                id: user._id,
                role: user.role,

            }
            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: "2h",
            })
        };

    } catch (error) {

    }
}