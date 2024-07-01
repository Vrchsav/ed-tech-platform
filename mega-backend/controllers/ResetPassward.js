const User = require('../models/User');
const mailSender = require('../utils/mailSender');
const bcrypt = require('bcrypt');




exports.resetPasswardToken = async (req, res) => {
    try {
        //algorithm
        //get email
        //check user
        //generate token
        //update user by adding token and expiry
        //send mail containing the url
        //return res
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found"
            })
        }
        const token = crypto.randomUUID();
        const updateDetails = await User.findOneAndUpdate({ email: email }, {   token: token, resetPasswordExpires: Date.now() + 5 * 60 * 1000 }, { new: true });
        const url = `http://localhost:3000/reset-password/${token}`;
        await mailSender(email, "Reset Password", `Click here to reset your password ${url}`); 
        return res.json({ success: true, message: "Password reset link sent to your email" })


    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Error in sending password reset link"
        })
        
    }
}

exports.resetPassword = async (req, res) => {
    try {
        const { token, password, confirmPassword } = req.body;
        
        if(password !== confirmPassword){
            return res.status(401).json({
                success: false,
                message: "Passwords do not match"
            })
        }

        const userDetails = await User.findOne({ token : token });
        if(!userDetails){
            return res.status(401).json({
                success: false,
                message: "Invalid token"
            })
        } 
        if(userDetails.resetPasswordExpires < Date.now()){
            return res.status(401).json({
                success: false,
                message: "Token expired"
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.findOneAndUpdate({ token: token }, { password: hashedPassword, }, { new: true });
        return res.json({ success: true, message: "Password reset successfully" })

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Error in resetting password"
        })
        
    }
}