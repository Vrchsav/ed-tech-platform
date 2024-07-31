const Profile = require('../models/Profile');
const User = require('../models/User');


exports.updateProfile = async (req, res) => {
    try {

        //fetch user
        const {dateOfBirth="", gender,about="", contactNumber } = req.body;
        //get userID
        const id = req.user.id;
        //validation
        if ( !gender  || !contactNumber ||!id) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            })
        }
        //find user
        const userDetails = await User.findById(id);
        const profileId= userDetails.additionalDetails;
        const profileDetails = await Profile.findById(profileId);
        profileDetails.dateOfBirth = dateOfBirth;
        profileDetails.gender = gender;
        profileDetails.about = about;
        profileDetails.contactNumber = contactNumber;
        await profileDetails.save();
        //return response
        return res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            profileDetails
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error updating profile',
            error: error.message
        })
    }

        
}
//delete profile
exports.deleteAccount  = async (req, res) => {
    try{
    //get id
    const id = req.user.id;
    //find user
    const userDetails = await User.findById(id);
    if (!userDetails) {
        return res.status(400).json({
            success: false,
            message: 'User not found'
        })
    }
    //delete profile
    await Profile.findByIdAndDelete({_id:userDetails.additionalDetails});
    //delete user 
    await User.findByIdAndDelete({_id:id});
    return res.status(200).json({
        success: true,
        message: 'Account deleted successfully',
        profileDetails
    })

    }catch(error){
        return res.status(500).json({
            success: false,
            message: 'Error deleting account',
            error: error.message
        })
    }
    
    
}

exports.getAllUserDetails = async (req, res) => {
    try {
        //get id
        const id=req.user.id;
        //find user
        const userDetails = await User.findById(id).populate('additionalDetails').exec();
        
        return res.status(200).json({
            success: true,
            message: 'User details fetched successfully',
            
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error fetching users',
            error: error.message
        })
    }
}  