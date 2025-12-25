import Post from '../models/Post.js';

// Create a new post
export const createPost = async (req, res) => {
    try {
        const { content, images } = req.body;
        const authorId = req.users.userId || req.users._id;

        // Validate required fields
        if (!content && (!images || images.length === 0)) {
            return res.status(400).json({
                success: false,
                message: 'Post must contain either content or images.'
            });
        }

        // Create new post
        const newPost = new Post({
            authorId,
            content,
            images: images || [],
            likes: []
        });

        const savedPost = await newPost.save();

        // Populate author information
        await savedPost.populate('authorId', 'name username profilePic');

        return res.status(201).json({
            success: true,
            message: 'Post created successfully.',
            post: savedPost
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to create post.',
            error: error.message
        });
    }
};

// Delete a post
export const deletePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.user.userId || req.user.id;

        // Find the post
        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Post not found.'
            });
        }

        // Check if the user is the author
        if (post.authorId.toString() !== userId.toString()) {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to delete this post.'
            });
        }

        // Delete the post
        await Post.findByIdAndDelete(postId);

        return res.status(200).json({
            success: true,
            message: 'Post deleted successfully.'
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to delete post.',
            error: error.message
        });
    }
};

// Update a post
export const updatePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const { content, images } = req.body;
        const userId = req.user.userId || req.user.id;

        // Find the post
        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Post not found.'
            });
        }

        // Check if the user is the author
        if (post.authorId.toString() !== userId.toString()) {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to update this post.'
            });
        }

        // Update fields
        if (content !== undefined) post.content = content;
        if (images !== undefined) post.images = images;

        const updatedPost = await post.save();

        // Populate author information
        await updatedPost.populate('authorId', 'name username profilePic');

        return res.status(200).json({
            success: true,
            message: 'Post updated successfully.',
            post: updatedPost
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to update post.',
            error: error.message
        });
    }
};

// Get posts (user's own posts or posts user liked)
export const getUserPosts = async (req, res) => {
    try {
        const userId = req.user.userId || req.user.id;
        const { type } = req.query; // type can be 'created' or 'liked'

        let posts;

        if (type === 'liked') {
            // Get posts that user liked
            posts = await Post.find({ likes: userId })
                .populate('authorId', 'name username profilePic')
                .sort({ createdAt: -1 });
        } else {
            // Default: Get posts created by user
            posts = await Post.find({ authorId: userId })
                .populate('authorId', 'name username profilePic')
                .sort({ createdAt: -1 });
        }

        return res.status(200).json({
            success: true,
            count: posts.length,
            posts
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch posts.',
            error: error.message
        });
    }
};

// Get all posts sorted by creation date
export const getAllPosts = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;

        const posts = await Post.find()
            .populate('authorId', 'name username profilePic')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        const count = await Post.countDocuments();

        return res.status(200).json({
            success: true,
            posts,
            totalPages: Math.ceil(count / limit),
            currentPage: parseInt(page),
            totalPosts: count
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch posts.',
            error: error.message
        });
    }
};

// Toggle like on a post
export const toggleLike = async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.user.userId || req.user.id;

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Post not found.'
            });
        }

        // Check if user already liked the post
        const likeIndex = post.likes.indexOf(userId);

        if (likeIndex > -1) {
            // Unlike: Remove user from likes array
            post.likes.splice(likeIndex, 1);
        } else {
            // Like: Add user to likes array
            post.likes.push(userId);
        }

        await post.save();

        return res.status(200).json({
            success: true,
            message: likeIndex > -1 ? 'Post unliked.' : 'Post liked.',
            likesCount: post.likes.length,
            isLiked: likeIndex === -1
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to toggle like.',
            error: error.message
        });
    }
};

// Get a single post by ID
export const getPostById = async (req, res) => {
    try {
        const { postId } = req.params;

        const post = await Post.findById(postId)
            .populate('authorId', 'name username profilePic');

        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Post not found.'
            });
        }

        return res.status(200).json({
            success: true,
            post
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch post.',
            error: error.message
        });
    }
};
