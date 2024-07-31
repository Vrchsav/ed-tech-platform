const SubSection = require('../models/SubSection');
const Section = require('../models/Section');
const { uploadImageToCloudinary } = require('../utils/imageUploader');


exports.createSubSection = async (req, res) => {
    try {
        //data fetching
        const {sectionId, title, timeDuration, description} = req.body;
        //extra video file
        const video =req.file.videoFile;
        //validation
        if (!sectionId || !title || !timeDuration || !description) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            })
        } 
        //upload video
        const uploadDetails = await uploadImageToCloudinary(video, process.env.FOLDER_NAME);
        //create sub section
        const SubSectionDetails = await SubSection.create({
            title: title,
            timeDuration: timeDuration,
            description: description,
            videoUrl: uploadDetails.secure_url
        })
        //update section
        const updatedSection = await Section.findByIdAndUpdate({_id:sectionId}, {
            $push: { subSection: SubSectionDetails._id }
        }, { new: true }).populate('subSection');  

        //response
        return res.status(200).json({
            success: true,
            message: 'Sub section created successfully',
            updatedSection
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error creating sub section',  
            error: error.message
        })
    }
} 

exports.updateSubSection = async (req, res) => {
    try {
        //data fetching
        const { subSectionId, title, timeDuration, description } = req.body;
        //extra video file
        const updateData = {};
        const video =req.file.videoFile;
        //upload video
        
        if (video) {
            const uploadDetails = await uploadImageToCloudinary(video, process.env.FOLDER_NAME);
            updateData.videoUrl = uploadDetails.secure_url
        }

        //validation
        if (title !== undefined) updateData.title = title;
        if (timeDuration !== undefined) updateData.timeDuration = timeDuration;
        if (description !== undefined) updateData.description = description;
        //update sub section
        const updatedSubSection = await SubSection.findByIdAndUpdate({_id:subSectionId}, {
            title: title,
            updateData
        }, { new: true });
        //response
        return res.status(200).json({
            success: true,
            message: 'Sub section updated successfully',
            updatedSubSection
        })
    } catch (error) {    
        return res.status(500).json({
            success: false,
            message: 'Error updating sub section',
            error: error.message
        })
    }
}

exports.deleteSubSection = async (req, res) => { 
    try {
        //data fetching
        const { subSectionId } = req.params;
        //delete sub section
        await SubSection.findByIdAndDelete({_id:subSectionId});
        //response
        return res.status(200).json({
            success: true,
            message: 'Sub section deleted successfully'
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error deleting sub section',
            error: error.message
        })
    }
} 