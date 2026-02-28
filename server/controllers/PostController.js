import Post from '../models/Post.js';
import { createNotification } from './NotificationController.js';
import { trackChallengeProgress } from '../services/ExtraChallengeService.js';

export const createPost = async (req, res) => {
    try {
        const { content, images, isPrivate } = req.body;
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
            likes: [],
            isPrivate: isPrivate || false
        });

        const savedPost = await newPost.save();

        await savedPost.populate('authorId', 'name username profilePic');

        // Track extra challenge progress
        await trackChallengeProgress(authorId, 'post_create');

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
        const isAdmin = req.user.isAdmin;

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Post not found.'
            });
        }

        // Allow deletion if user is the author OR if user is an admin
        if (post.authorId.toString() !== userId.toString() && !isAdmin) {
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
        const { content, images, isPrivate } = req.body;
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
        if (typeof isPrivate === 'boolean') post.isPrivate = isPrivate;

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
        const { type, targetUserId } = req.query;

        let posts;
        const userIdToFetch = targetUserId || userId;

        if (type === 'liked') {
            // When fetching liked posts, respect privacy if viewing another user's likes
            const filter = { likes: userIdToFetch };
            if (targetUserId && targetUserId !== userId.toString()) {
                filter.isPrivate = false;
            }
            posts = await Post.find(filter)
                .populate('authorId', 'name username profilePic')
                .sort({ createdAt: -1 });
        } else {
            // When fetching user's own posts, show all. When viewing others, show only public
            const filter = { authorId: userIdToFetch };
            if (targetUserId && targetUserId !== userId.toString()) {
                filter.isPrivate = false;
            }
            posts = await Post.find(filter)
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
        const userId = req.user._id;

        // Only show public posts or user's own posts
        const posts = await Post.find({
            $or: [
                { isPrivate: false },
                { authorId: userId }
            ]
        })
            .populate('authorId', 'name username profilePic')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        const count = await Post.countDocuments({
            $or: [
                { isPrivate: false },
                { authorId: userId }
            ]
        });

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

        // Check if user can like this post (must be public or user's own post)
        if (post.isPrivate && post.authorId.toString() !== userId.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Cannot like a private post.'
            });
        }

        const likeIndex = post.likes.indexOf(userId);

        if (likeIndex > -1) {
            post.likes.splice(likeIndex, 1);
        } else {
            post.likes.push(userId);

            // Track extra challenge progress - like given
            await trackChallengeProgress(userId, 'like_give');

            // Track extra challenge progress - like received (for post author)
            if (post.authorId.toString() !== userId.toString()) {
                await trackChallengeProgress(post.authorId, 'like_receive');
            }

            // Create notification for post author when someone likes their post
            try {
                await createNotification({
                    recipientId: post.authorId,
                    senderId: userId,
                    type: 'like',
                    postId: post._id,
                    postModel: 'Post',
                    message: 'liked your post.'
                });
            } catch (notifError) {
                console.error('Failed to create like notification:', notifError);
            }
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
        const userId = req.user._id;

        const post = await Post.findById(postId)
            .populate('authorId', 'name username profilePic');

        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Post not found.'
            });
        }

        // Check if user has permission to view this post
        if (post.isPrivate && post.authorId._id.toString() !== userId.toString()) {
            return res.status(403).json({
                success: false,
                message: 'This post is private.'
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
        const userId = req.user._id;

        if (!query || query.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'Search query is required.'
            });
        }

        // Only search in public posts or user's own posts
        const posts = await Post.find({
            content: { $regex: query, $options: 'i' },
            $or: [
                { isPrivate: false },
                { authorId: userId }
            ]
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


export const getSharedPost = async (req, res) => {
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

        // Shared posts can only be viewed if they are public
        if (post.isPrivate) {
            return res.status(403).json({
                success: false,
                message: 'This post is private and cannot be shared.'
            });
        }

        const Comment = (await import('../models/Comment.js')).default;
        const comments = await Comment.find({ postId })
            .populate('authorId', 'name username profilePic')
            .sort({ createdAt: -1 });

        const commentMap = {};
        const topLevelComments = [];

        comments.forEach(comment => {
            commentMap[comment._id] = {
                ...comment.toObject(),
                replies: []
            };
        });

        comments.forEach(comment => {
            if (comment.parentComment) {
                if (commentMap[comment.parentComment]) {
                    commentMap[comment.parentComment].replies.push(commentMap[comment._id]);
                }
            } else {
                topLevelComments.push(commentMap[comment._id]);
            }
        });

        return res.status(200).json({
            success: true,
            post: {
                ...post.toObject(),
                likesCount: post.likes.length
            },
            comments: topLevelComments,
            totalComments: comments.length
        });
    } catch (error) {
        console.error('Get shared post error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch post.',
            error: error.message
        });
    }
};
