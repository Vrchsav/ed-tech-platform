const jwt=require('jsonwebtoken');
require('dotenv').config();
const User = require('../models/User');


exports.auth = async (req, res, next) => {
    try {
        const token = req.cookies.token || req.body.token ||req.header('Authorization').replace('Bearer ', '') ;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Token not found'
            })
        }
        try {
            const decod=jwt.verify(token,process.env.JWT_SECRET);
            console.log(decod);
            req.user=decod;
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: 'Invalid token'
            })
        }
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'token problem'
        })
    }
}
exports.isStudent = async (req, res, next) => {
    try {
        if (req.user.accountType === 'Student') {
            next();
        } else {
            res.status(401).json({
                success: false,
                message: 'route for students only'
            })
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'role cannot be verified'
        })
        
    }
}
exports.isInstructor = async (req, res, next) => {
    try {
        if (req.user.accountType === 'Instructor') {
            next();
        } else {
            res.status(401).json({
                success: false,
                message: 'route for Instructor only'
            })
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'role cannot be verified'
        })
        
    }
}

exports.isAdmin = async (req, res, next) => {
    try {
        if (req.user.accountType === 'Admin') {
            next();
        } else {
            res.status(401).json({
                success: false,
                message: 'route for Admin only'
            })
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'role cannot be verified'
        })
        
    }
}