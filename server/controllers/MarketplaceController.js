import MarketplacePost from '../models/MarketplacePost.js';
import User from '../models/User.js';
import { deleteExpiredPosts, getDaysUntilExpiration, extendPostExpiration } from '../services/MarketplaceCleanupService.js';

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

        // Set expiration date to 30 days from now
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 30);

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
            status: 'available',
            expiresAt
        });

        const savedPost = await newPost.save();
        await savedPost.populate('userId', 'name username email profilePic');

        const postWithExpiry = {
            ...savedPost.toObject(),
            daysRemaining: 30,
            isExpired: false
        };

        return res.status(201).json({
            success: true,
            message: 'Marketplace post created successfully. Post will expire in 30 days.',
            post: postWithExpiry
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
        const isAdmin = req.user.isAdmin;

        const post = await MarketplacePost.findById(postId);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Marketplace post not found.'
            });
        }

        // Allow deletion if user is the author OR if user is an admin
        if (post.userId.toString() !== userId.toString() && !isAdmin) {
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

        // Clean up expired posts before fetching
        await deleteExpiredPosts();

        const now = new Date();
        const filter = {
            status: 'available',
            expiresAt: { $gt: now } // Only show non-expired posts
        };

        const skip = (Number(page) - 1) * Number(limit);

        const posts = await MarketplacePost.find(filter)
            .populate('userId', 'name username email profilePic')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit));

        // Add days remaining to each post
        const postsWithExpiry = posts.map(post => ({
            ...post.toObject(),
            daysRemaining: getDaysUntilExpiration(post.expiresAt)
        }));

        const total = await MarketplacePost.countDocuments(filter);

        return res.status(200).json({
            success: true,
            posts: postsWithExpiry,
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

        // Clean up expired posts before searching
        await deleteExpiredPosts();

        const now = new Date();
        const filter = {
            status: 'available',
            expiresAt: { $gt: now } // Only show non-expired posts
        };

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

        // Add days remaining to each post
        const postsWithExpiry = posts.map(post => ({
            ...post.toObject(),
            daysRemaining: getDaysUntilExpiration(post.expiresAt)
        }));

        const total = await MarketplacePost.countDocuments(filter);

        return res.status(200).json({
            success: true,
            posts: postsWithExpiry,
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

        // Add days remaining and check if expired
        const postWithExpiry = {
            ...post.toObject(),
            daysRemaining: getDaysUntilExpiration(post.expiresAt),
            isExpired: new Date() > new Date(post.expiresAt)
        };

        return res.status(200).json({
            success: true,
            post: postWithExpiry
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch post details.',
            error: error.message
        });
    }
};
/**
 * Extend post expiration by additional days (default 30)
 */
export const extendPostExpirationDate = async (req, res) => {
    try {
        const { postId } = req.params;
        const { additionalDays = 30 } = req.body;
        const userId = req.user._id;

        const result = await extendPostExpiration(postId, userId, additionalDays);

        return res.status(200).json({
            success: true,
            message: `Post expiration extended by ${additionalDays} days.`,
            expiresAt: result.expiresAt,
            daysRemaining: getDaysUntilExpiration(result.expiresAt)
        });
    } catch (error) {
        return res.status(error.message === 'Post not found or unauthorized' ? 404 : 500).json({
            success: false,
            message: error.message || 'Failed to extend post expiration.',
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

        // Add days remaining and expiration status to each post
        const postsWithExpiry = posts.map(post => {
            const now = new Date();
            const isExpired = now > new Date(post.expiresAt);
            return {
                ...post.toObject(),
                daysRemaining: getDaysUntilExpiration(post.expiresAt),
                isExpired
            };
        });


        const total = await MarketplacePost.countDocuments(filter);

        return res.status(200).json({
            success: true,
            posts: postsWithExpiry,
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

/**
 * Toggle save/unsave marketplace post
 * If post is already saved, it will be removed. If not saved, it will be added.
 */
export const toggleSavePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.user._id;

        // Check if post exists
        const post = await MarketplacePost.findById(postId);
        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Marketplace post not found.'
            });
        }

        // Get user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found.'
            });
        }

        // Initialize savedMarketplacePosts array if it doesn't exist
        if (!user.savedMarketplacePosts) {
            user.savedMarketplacePosts = [];
        }

        // Check if post is already saved
        const savedIndex = user.savedMarketplacePosts.findIndex(
            id => id.toString() === postId
        );

        let isSaved;
        let message;

        if (savedIndex > -1) {
            // Post is already saved, remove it
            user.savedMarketplacePosts.splice(savedIndex, 1);
            isSaved = false;
            message = 'Post removed from saved items.';
        } else {
            // Post is not saved, add it
            user.savedMarketplacePosts.push(postId);
            isSaved = true;
            message = 'Post saved for later.';
        }

        await user.save();

        return res.status(200).json({
            success: true,
            message: message,
            isSaved: isSaved,
            savedCount: user.savedMarketplacePosts.length
        });
    } catch (error) {
        console.error('Toggle save post error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to save/unsave post.',
            error: error.message
        });
    }
};

/**
 * Get all saved marketplace posts for the authenticated user
 */
export const getSavedPosts = async (req, res) => {
    try {
        const userId = req.user._id;
        const { page = 1, limit = 10 } = req.query;

        // Clean up expired posts before fetching
        await deleteExpiredPosts();

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found.'
            });
        }

        // Get saved post IDs
        const savedPostIds = user.savedMarketplacePosts || [];

        if (savedPostIds.length === 0) {
            return res.status(200).json({
                success: true,
                posts: [],
                pagination: {
                    currentPage: Number(page),
                    totalPages: 0,
                    totalPosts: 0,
                    postsPerPage: Number(limit)
                }
            });
        }

        // Filter out expired posts
        const now = new Date();
        const skip = (Number(page) - 1) * Number(limit);

        const posts = await MarketplacePost.find({
            _id: { $in: savedPostIds },
            expiresAt: { $gt: now }
        })
            .populate('userId', 'name username email profilePic')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit));

        // Add days remaining to each post
        const postsWithExpiry = posts.map(post => ({
            ...post.toObject(),
            daysRemaining: getDaysUntilExpiration(post.expiresAt),
            isSaved: true
        }));

        const total = await MarketplacePost.countDocuments({
            _id: { $in: savedPostIds },
            expiresAt: { $gt: now }
        });

        // Clean up saved posts that no longer exist or are expired
        const validPostIds = posts.map(p => p._id.toString());
        const anyRemoved = user.savedMarketplacePosts.some(
            id => !validPostIds.includes(id.toString())
        );

        if (anyRemoved && posts.length < savedPostIds.length) {
            user.savedMarketplacePosts = user.savedMarketplacePosts.filter(id =>
                posts.some(p => p._id.toString() === id.toString())
            );
            await user.save();
        }

        return res.status(200).json({
            success: true,
            posts: postsWithExpiry,
            pagination: {
                currentPage: Number(page),
                totalPages: Math.ceil(total / Number(limit)),
                totalPosts: total,
                postsPerPage: Number(limit)
            }
        });
    } catch (error) {
        console.error('Get saved posts error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch saved posts.',
            error: error.message
        });
    }
};

/**
 * Check if a specific post is saved by the user
 */
export const checkIfPostSaved = async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.user._id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found.'
            });
        }

        const isSaved = user.savedMarketplacePosts &&
            user.savedMarketplacePosts.some(id => id.toString() === postId);

        return res.status(200).json({
            success: true,
            isSaved: isSaved
        });
    } catch (error) {
        console.error('Check saved post error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to check saved status.',
            error: error.message
        });
    }
};