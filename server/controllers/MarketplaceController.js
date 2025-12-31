import MarketplacePost from '../models/MarketplacePost.js';

export const createMarketplacePost = async (req, res) => {
    try {
        const {
            photos,
            treeName,
            treeType,
            offering,
            description,
            postType,
            price,
            contactInfo,
            treeAge
        } = req.body;

        const userId = req.user.userId || req.user._id;

        const newPost = new MarketplacePost({
            userId,
            photos,
            treeName,
            treeType,
            offering,
            description,
            postType,
            price: postType === 'sell' ? price : 0,
            contactInfo,
            treeAge,
            status: 'available'
        });

        const savedPost = await newPost.save();
        await savedPost.populate('userId', 'name username email profilePic');

        return res.status(201).json({
            success: true,
            message: 'Marketplace post created successfully.',
            post: savedPost
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to create marketplace post.',
            error: error.message
        });
    }
};


