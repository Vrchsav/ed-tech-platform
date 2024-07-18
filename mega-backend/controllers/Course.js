const Course = require('../models/Course');
const Tag = require('../models/Tags');
const User = require('../models/User');
const { uploadImageToCloudinary } = require('../utils/cloudinary');



exports.createCourse = async (req, res) => {
    try {
        const { courseName, courseDescription, price, whatYouWillLearn, tag } = req.body;

        const thumbnail = req.files.thumbnailImage;


        if (!courseName || !courseDescription || !price || !thumbnail) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            })
        }

        const userId = req.user.id;
        const instructorDetails = await User.findById(userId);
        console.log(instructorDetails);

        if (!instructorDetails) {
            return res.status(400).json({
                success: false,
                message: 'Instructor not found'
            })
        }
        const tagDetails = await Tag.findById(tag);
        if (!tagDetails) {
            return res.status(400).json({
                success: false,
                message: 'Tag not found'
            })
        }
        const thumbnailImage = await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME);

        const newCourse = await Course.create({
            courseName,
            courseDescription,
            instructor: instructorDetails._id,
            whatYouWillLearn: whatYouWillLearn,
            tag: tagDetails._id,
            price,
            thumbnail: thumbnailImage.secure_url
        })
        await User.findByIdAndUpdate(_id: instructorDetails._id, { $push: { courses: newCourse._id } }, { new: true });
        await Tag.findByIdAndUpdate(_id: tagDetails._id, { $push: { courses: newCourse._id } }, { new: true });

        return res.status(200).json({
            success: true,
            message: 'Course created successfully',
            newCourse
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error creating course',
            error: error.message
        })
    }
}

exports.showAllCourses = async (req, res) => {
    try {
        const courses = await Course.find({},{courseName:true,courseDescription:true,thumbnail:true,price:true,ratingAndReviews:true}).populate('instructor');
        return res.status(200).json({
            success: true,
            message: 'Courses fetched successfully',
            courses
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error fetching courses',
            error: error.message
        })
    }
}