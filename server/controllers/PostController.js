import Post from '../models/Post.js';

export const createPost = async (req, res) => {
    try {
        const { content, images } = req.body;
        const authorId = req.user._id;

        if (!content && (!images || images.length === 0)) {
            return res.status(400).json({
                success: false,
                message: 'Post must contain either content or images.'
            });
        }

        const newPost = new Post({
            authorId,
            content,
            images: images || [],
            likes: []
        });

        const savedPost = await newPost.save();

        await savedPost.populate('authorId', 'name username profilePic');

        return res.status(201).json({
            success: true,
            message: 'Post created successfully.',
            post: savedPost
        });
    } catch (error) {
        console.error('Create post error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to create post.',
            error: error.message
        });
    }
};


export const deletePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.user._id;

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Post not found.'
            });
        }

        if (post.authorId.toString() !== userId.toString()) {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to delete this post.'
            });
        }

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

export const updatePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const { content, images } = req.body;
        const userId = req.user._id;

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Post not found.'
            });
        }

        if (post.authorId.toString() !== userId.toString()) {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to update this post.'
            });
        }

        if (content !== undefined) post.content = content;
        if (images !== undefined) post.images = images;

        const updatedPost = await post.save();

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


export const getUserPosts = async (req, res) => {
    try {
        const userId = req.user._id;
        const { type } = req.query;

        let posts;

        if (type === 'liked') {
            posts = await Post.find({ likes: userId })
                .populate('authorId', 'name username profilePic')
                .sort({ createdAt: -1 });
        } else {
            posts = await Post.find({ authorId: userId })
                .populate('authorId', 'name username profilePic')
                .sort({ createdAt: -1 });
        }

        if (!posts || posts.length === 0) {
            return res.status(200).json({
                success: true,
                message: 'No posts available',
                count: 0,
                posts: []
            });
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

        if (count === 0 || posts.length === 0) {
            return res.status(200).json({
                success: true,
                message: 'No posts available',
                posts: [],
                totalPages: 0,
                currentPage: parseInt(page),
                totalPosts: 0
            });
        }

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


export const toggleLike = async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.user._id;

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Post not found.'
            });
        }

        const likeIndex = post.likes.indexOf(userId);

        if (likeIndex > -1) {
            post.likes.splice(likeIndex, 1);
        } else {
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


export const searchPosts = async (req, res) => {
    try {
        const { query } = req.query;

        if (!query || query.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'Search query is required.'
            });
        }

        
        const posts = await Post.find({
            content: { $regex: query, $options: 'i' }
        })
            .populate('authorId', 'name username profilePic')
            .sort({ createdAt: -1 })
            .limit(50);

        return res.status(200).json({
            success: true,
            count: posts.length,
            posts
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to search posts.',
            error: error.message
        });
    }
};
