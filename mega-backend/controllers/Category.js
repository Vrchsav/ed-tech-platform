const Category =require('../models/Category');




exports.createCategory = async (req, res) => {
    try {
        const { name, description} = req.body;

        if (!name || !description) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            })
        }

        const categoryDetails = await Category.create({
            name: name,
            description: description
        });
        console.log(categoryDetails);
        return res.status(200).json({
            success: true,
            message: 'Category created successfully',
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error creating category',
            error: error.message
        })
    }
        
    }


exports.showAllCategories = async (req, res) => {
    try {
        const categories = await Category.find({},{name:true,description:true});
        return res.status(200).json({
            success: true,
            message: 'Categories fetched successfully',
            data: categories
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error fetching categories',
            error: error.message
        })
    }
}

