const Section = require('../models/Section');
const Course = require('../models/Course');

exports.createSection = async (req, res) => {
    try {
        //data fetching
        const { sectionName, courseId } = req.body;
        //validation
        if (!sectionName || !courseId) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            })
        }
        //create section
        const newSection = await Section.create({
            sectionName});

        //update course
        const updatedCourseDetails  = await Course.findByIdAndUpdate (courseId, {
            $push: { courseContent: newSection._id } },{ new: true } ,
        ).populate('courseContent');
        //response
        return res.status(200).json({
            success: true,
            message: 'Section created successfully',
            data: updatedCourseDetails
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error creating section',
            error: error.message
        })
    }


}
exports.updateSection = async (req, res) => {
    try {
        //data fetching
        const { sectionId, sectionName } = req.body;
        //validation
        if (!sectionId || !sectionName) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            })
        }
        //update section
        const updatedSection = await Section.findByIdAndUpdate(sectionId, {
            sectionName
        }, { new: true });
        //response
        return res.status(200).json({
            success: true,
            message: 'Section updated successfully',
            data: updatedSection
        })  
    } catch (error) {    
        return res.status(500).json({
            success: false,
            message: 'Error updating section',
            error: error.message
        })
    }
}

exports.deleteSection = async (req, res) => {
    try {
        //data fetching-assuming that user parameter
        const { sectionId } = req.params;
        //validation
        if (!sectionId) {
            return res.status(400).json({
                success: false,
                message: 'wrong id'
            })
        }
        //delete section
        await Section.findByIdAndDelete(sectionId);
        //delete entry from course
        
        //response
        return res.status(200).json({
            success: true,
            message: 'Section deleted successfully'
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error deleting section',
            error: error.message
        })
    }
}


