import Comment from '../models/Comment.js';
import Post from '../models/Post.js';

export const createComment = async (req, res) => {
    try {
        const { postId } = req.params;
        const { content } = req.body;
        const authorId = req.user._id;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Post not found.'
            });
        }

        const newComment = new Comment({
            postId,
            authorId,
            content,
            parentComment: null
        });

        const savedComment = await newComment.save();
        await savedComment.populate('authorId', 'name username profilePic');

        return res.status(201).json({
            success: true,
            message: 'Comment created successfully.',
            comment: savedComment
        });
    } catch (error) {
        console.error('Create comment error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to create comment.',
            error: error.message
        });
    }
};

export const createReply = async (req, res) => {
    try {
        const { commentId } = req.params;
        const { content } = req.body;
        const authorId = req.user._id;

        const parentComment = await Comment.findById(commentId);
        if (!parentComment) {
            return res.status(404).json({
                success: false,
                message: 'Parent comment not found.'
            });
        }

        const newReply = new Comment({
            postId: parentComment.postId,
            authorId,
            content,
            parentComment: commentId
        });

        const savedReply = await newReply.save();
        await savedReply.populate('authorId', 'name username profilePic');

        return res.status(201).json({
            success: true,
            message: 'Reply created successfully.',
            comment: savedReply
        });
    } catch (error) {
        console.error('Create reply error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to create reply.',
            error: error.message
        });
    }
};

export const getCommentsByPost = async (req, res) => {
    try {
        const { postId } = req.params;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Post not found.'
            });
        }

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
            comments: topLevelComments,
            totalComments: comments.length
        });
    } catch (error) {
        console.error('Get comments error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch comments.',
            error: error.message
        });
    }
};

export const updateComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const { content } = req.body;
        const userId = req.user._id;

        const comment = await Comment.findById(commentId);

        if (!comment) {
            return res.status(404).json({
                success: false,
                message: 'Comment not found.'
            });
        }

        if (comment.authorId.toString() !== userId.toString()) {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to update this comment.'
            });
        }

        comment.content = content;
        const updatedComment = await comment.save();
        await updatedComment.populate('authorId', 'name username profilePic');

        return res.status(200).json({
            success: true,
            message: 'Comment updated successfully.',
            comment: updatedComment
        });
    } catch (error) {
        console.error('Update comment error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to update comment.',
            error: error.message
        });
    }
};

export const deleteComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        const userId = req.user._id;

        const comment = await Comment.findById(commentId);

        if (!comment) {
            return res.status(404).json({
                success: false,
                message: 'Comment not found.'
            });
        }

        const post = await Post.findById(comment.postId);
        const isAuthor = comment.authorId.toString() === userId.toString();
        const isPostOwner = post && post.authorId.toString() === userId.toString();

        if (!isAuthor && !isPostOwner) {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to delete this comment.'
            });
        }

        await Comment.deleteMany({
            $or: [
                { _id: commentId },
                { parentComment: commentId }
            ]
        });

        return res.status(200).json({
            success: true,
            message: 'Comment deleted successfully.'
        });
    } catch (error) {
        console.error('Delete comment error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to delete comment.',
            error: error.message
        });
    }
};

export const getCommentById = async (req, res) => {
    try {
        const { commentId } = req.params;

        const comment = await Comment.findById(commentId)
            .populate('authorId', 'name username profilePic')
            .populate('postId', 'content authorId');

        if (!comment) {
            return res.status(404).json({
                success: false,
                message: 'Comment not found.'
            });
        }

        const replies = await Comment.find({ parentComment: commentId })
            .populate('authorId', 'name username profilePic')
            .sort({ createdAt: 1 });

        return res.status(200).json({
            success: true,
            comment: {
                ...comment.toObject(),
                replies
            }
        });
    } catch (error) {
        console.error('Get comment error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch comment.',
            error: error.message
        });
    }
};
