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

        const userId = req.user._id;

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


export const deleteMarketplacePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.user._id;

        const post = await MarketplacePost.findById(postId);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Marketplace post not found.'
            });
        }

        if (post.userId.toString() !== userId.toString()) {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to delete this post.'
            });
        }

        await MarketplacePost.findByIdAndDelete(postId);

        return res.status(200).json({
            success: true,
            message: 'Marketplace post deleted successfully.'
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to delete marketplace post.',
            error: error.message
        });
    }
};


export const getAllAvailablePosts = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;

        const filter = { status: 'available' };

        const skip = (Number(page) - 1) * Number(limit);

        const posts = await MarketplacePost.find(filter)
            .populate('userId', 'name username email profilePic')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit));

        const total = await MarketplacePost.countDocuments(filter);

        return res.status(200).json({
            success: true,
            posts,
            pagination: {
                currentPage: Number(page),
                totalPages: Math.ceil(total / Number(limit)),
                totalPosts: total,
                postsPerPage: Number(limit)
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch marketplace posts.',
            error: error.message
        });
    }
};


export const searchMarketplacePosts = async (req, res) => {
    try {
        const {
            postType,
            treeType,
            minPrice,
            maxPrice,
            minAge,
            maxAge,
            keyword,
            page = 1,
            limit = 10
        } = req.query;

        const filter = { status: 'available' };

        if (postType) {
            filter.postType = postType;
        }

        if (treeType) {
            filter.treeType = { $regex: treeType, $options: 'i' };
        }

        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }

        if (minAge || maxAge) {
            filter.treeAge = {};
            if (minAge) filter.treeAge.$gte = Number(minAge);
            if (maxAge) filter.treeAge.$lte = Number(maxAge);
        }

        if (keyword) {
            filter.$or = [
                { treeName: { $regex: keyword, $options: 'i' } },
                { description: { $regex: keyword, $options: 'i' } },
                { offering: { $regex: keyword, $options: 'i' } }
            ];
        }

        const skip = (Number(page) - 1) * Number(limit);

        const posts = await MarketplacePost.find(filter)
            .populate('userId', 'name username email profilePic')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit));

        const total = await MarketplacePost.countDocuments(filter);

        return res.status(200).json({
            success: true,
            posts,
            pagination: {
                currentPage: Number(page),
                totalPages: Math.ceil(total / Number(limit)),
                totalPosts: total,
                postsPerPage: Number(limit)
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to search marketplace posts.',
            error: error.message
        });
    }
};


export const getMarketplacePostById = async (req, res) => {
    try {
        const { postId } = req.params;

        const post = await MarketplacePost.findById(postId)
            .populate('userId', 'name username email profilePic phone');

        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Marketplace post not found.'
            });
        }

        return res.status(200).json({
            success: true,
            post
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch post details.',
            error: error.message
        });
    }
};


export const getUserMarketplacePosts = async (req, res) => {
    try {
        const userId = req.user._id;
        const { status, page = 1, limit = 10 } = req.query;

        
        const filter = { userId };

        
        if (status) {
            filter.status = status;
        }

        
        const skip = (Number(page) - 1) * Number(limit);

        
        const posts = await MarketplacePost.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit));

        
        const total = await MarketplacePost.countDocuments(filter);

        return res.status(200).json({
            success: true,
            posts,
            pagination: {
                currentPage: Number(page),
                totalPages: Math.ceil(total / Number(limit)),
                totalPosts: total,
                postsPerPage: Number(limit)
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch user posts.',
            error: error.message
        });
    }
};


export const updateMarketplacePostStatus = async (req, res) => {
    try {
        const { postId } = req.params;
        const { status } = req.body;
        const userId = req.user._id;

        const post = await MarketplacePost.findById(postId);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Marketplace post not found.'
            });
        }

        if (post.userId.toString() !== userId.toString()) {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to update this post.'
            });
        }

        post.status = status;
        await post.save();

        await post.populate('userId', 'name username email profilePic');

        return res.status(200).json({
            success: true,
            message: 'Post status updated successfully.',
            post
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to update post status.',
            error: error.message
        });
    }
};


export const markPostAsSold = async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.user._id;

        const post = await MarketplacePost.findById(postId);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Marketplace post not found.'
            });
        }

        if (post.userId.toString() !== userId.toString()) {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to update this post.'
            });
        }

        post.status = 'unavailable';
        await post.save();

        await post.populate('userId', 'name username email profilePic');

        return res.status(200).json({
            success: true,
            message: `Post marked as ${post.postType === 'sell' ? 'sold' : 'exchanged'} successfully.`,
            post
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to mark post as sold/exchanged.',
            error: error.message
        });
    }
};