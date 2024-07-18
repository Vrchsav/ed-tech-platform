const Tag =require('../models/Tags');




exports.createTag = async (req, res) => {
    try {
        const { name, description} = req.body;

        if (!name || !description) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            })
        }

        const tagDetails = await Tag.create({
            name: name,
            description: description
        });
        console.log(tagDetails);
        return res.status(200).json({
            success: true,
            message: 'Tag created successfully',
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error creating tag',
            error: error.message
        })
    }
        
    }


exports.showAlltags = async (req, res) => {
    try {
        const tags = await Tag.find({},{name:true,description:true});
        return res.status(200).json({
            success: true,
            message: 'Tags fetched successfully',
            tags
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Error fetching tags',
            error: error.message
        })
    }
}

