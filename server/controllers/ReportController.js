import PostReport from '../models/PostReport.js';
import Post from '../models/Post.js';
import MarketplacePost from '../models/MarketplacePost.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import { createNotification } from './NotificationController.js';

const REPORT_THRESHOLD = 5; // Number of reports needed to notify admins

// Report a post
export const reportPost = async (req, res) => {
    try {
        const { postId } = req.params;
        const { reason, postType } = req.body; // postType: 'social' or 'marketplace'
        const reporterId = req.user._id;

        if (!reason || !reason.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Report reason is required.'
            });
        }

        if (!postType || !['social', 'marketplace'].includes(postType)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid post type. Must be "social" or "marketplace".'
            });
        }

        // Determine the model based on postType
        const Model = postType === 'social' ? Post : MarketplacePost;
        const modelName = postType === 'social' ? 'Post' : 'MarketplacePost';

        // Check if the post exists
        const post = await Model.findById(postId);
        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Post not found.'
            });
        }

        // Get post author ID (different field names for different models)
        const postAuthorId = postType === 'social' ? post.authorId : post.userId;

        // Check if post is private (only for social posts)
        if (postType === 'social' && post.isPrivate) {
            // Users can't report private posts unless they're the owner
            // But owners shouldn't be able to report their own posts anyway (checked below)
            if (postAuthorId.toString() !== reporterId.toString()) {
                return res.status(403).json({
                    success: false,
                    message: 'Cannot report a private post.'
                });
            }
        }

        // Don't allow users to report their own posts
        if (postAuthorId.toString() === reporterId.toString()) {
            return res.status(400).json({
                success: false,
                message: 'You cannot report your own post.'
            });
        }

        // Find or create the report document
        let postReport = await PostReport.findOne({
            postId,
            postModel: modelName
        });

        if (!postReport) {
            postReport = new PostReport({
                postId,
                postModel: modelName,
                postAuthorId,
                reports: [],
                reportCount: 0
            });
        }

        // Check if user has already reported this post
        const hasReported = postReport.reports.some(
            report => report.reporterId.toString() === reporterId.toString()
        );

        if (hasReported) {
            return res.status(400).json({
                success: false,
                message: 'You have already reported this post.'
            });
        }

        // Add the report
        postReport.reports.push({
            reporterId,
            reason: reason.trim()
        });
        postReport.reportCount = postReport.reports.length;

        await postReport.save();

        // Check if we've reached the threshold and haven't sent admin notification yet
        if (postReport.reportCount >= REPORT_THRESHOLD && !postReport.adminNotificationSent) {
            // Get all admin users
            const admins = await User.find({ isAdmin: true });

            // Create notifications for all admins
            const notificationPromises = admins.map(admin =>
                createNotification({
                    recipientId: admin._id,
                    type: 'post_report',
                    postId,
                    postModel: modelName,
                    reportId: postReport._id,
                    message: `A ${postType} post has received ${postReport.reportCount} reports and requires review.`
                })
            );

            await Promise.all(notificationPromises);

            // Mark that admin notification has been sent
            postReport.adminNotificationSent = true;
            await postReport.save();
        }

        return res.status(200).json({
            success: true,
            message: 'Post reported successfully.',
            reportCount: postReport.reportCount
        });
    } catch (error) {
        console.error('Report post error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to report post.',
            error: error.message
        });
    }
};

// Get all reported posts (Admin only)
export const getReportedPosts = async (req, res) => {
    try {
        const { page = 1, limit = 20, status = 'pending' } = req.query;

        const filter = {};
        if (status && status !== 'all') {
            filter.status = status;
        }

        // Only show posts that have reached the threshold
        filter.reportCount = { $gte: REPORT_THRESHOLD };

        const skip = (Number(page) - 1) * Number(limit);

        const reports = await PostReport.find(filter)
            .populate('postAuthorId', 'name username email profilePic')
            .populate('reports.reporterId', 'name username')
            .populate('reviewedBy', 'name username')
            .sort({ reportCount: -1, createdAt: -1 })
            .skip(skip)
            .limit(Number(limit));

        const totalCount = await PostReport.countDocuments(filter);

        // Fetch the actual post data for each report
        const reportsWithPosts = await Promise.all(
            reports.map(async (report) => {
                const reportObj = report.toObject();
                try {
                    const Model = report.postModel === 'Post' ? Post : MarketplacePost;
                    const populateField = report.postModel === 'Post' ? 'authorId' : 'userId';
                    const post = await Model.findById(report.postId)
                        .populate(populateField, 'name username profilePic');

                    reportObj.postData = post;
                } catch (err) {
                    console.error(`Error fetching post ${report.postId}:`, err);
                    reportObj.postData = null;
                }
                return reportObj;
            })
        );

        return res.status(200).json({
            success: true,
            reports: reportsWithPosts,
            pagination: {
                currentPage: Number(page),
                totalPages: Math.ceil(totalCount / Number(limit)),
                totalCount,
                limit: Number(limit)
            }
        });
    } catch (error) {
        console.error('Get reported posts error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch reported posts.',
            error: error.message
        });
    }
};

// Get a specific reported post with details (Admin only)
export const getReportedPostById = async (req, res) => {
    try {
        const { reportId } = req.params;

        const report = await PostReport.findById(reportId)
            .populate('postAuthorId', 'name username email profilePic')
            .populate('reports.reporterId', 'name username profilePic')
            .populate('reviewedBy', 'name username');

        if (!report) {
            return res.status(404).json({
                success: false,
                message: 'Report not found.'
            });
        }

        // Fetch the actual post
        const Model = report.postModel === 'Post' ? Post : MarketplacePost;
        const post = await Model.findById(report.postId)
            .populate('authorId', 'name username profilePic')
            .populate('userId', 'name username profilePic');

        const reportObj = report.toObject();
        reportObj.postData = post;

        return res.status(200).json({
            success: true,
            report: reportObj
        });
    } catch (error) {
        console.error('Get reported post by ID error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch reported post.',
            error: error.message
        });
    }
};

// Review and delete a reported post (Admin only)
export const deleteReportedPost = async (req, res) => {
    try {
        const { reportId } = req.params;
        const adminNotes = req.body?.adminNotes;
        const adminId = req.user._id;

        const report = await PostReport.findById(reportId);

        if (!report) {
            return res.status(404).json({
                success: false,
                message: 'Report not found.'
            });
        }

        // Notify the post author before deleting the post
        try {
            await createNotification({
                recipientId: report.postAuthorId,
                senderId: adminId,
                type: 'admin_action',
                message: `Your ${report.postModel === 'Post' ? 'social' : 'marketplace'} post has been removed by an administrator due to multiple reports.`
            });
        } catch (notifError) {
            console.error('Failed to send notification to post author:', notifError);
            // Continue with deletion even if notification fails
        }

        // Notify all reporters that the post was deleted
        try {
            const reporterNotifications = report.reports.map(r =>
                createNotification({
                    recipientId: r.reporterId,
                    senderId: adminId,
                    type: 'admin_action',
                    message: `A ${report.postModel === 'Post' ? 'social' : 'marketplace'} post you reported has been reviewed and removed by an administrator.`
                })
            );
            await Promise.all(reporterNotifications);
        } catch (notifError) {
            console.error('Failed to send notifications to reporters:', notifError);
            // Continue with deletion even if notification fails
        }

        // Delete the actual post
        const Model = report.postModel === 'Post' ? Post : MarketplacePost;
        const post = await Model.findByIdAndDelete(report.postId);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Post not found or already deleted.'
            });
        }

        // Update report status
        report.status = 'deleted';
        report.reviewedBy = adminId;
        report.reviewedAt = new Date();
        report.adminNotes = adminNotes || 'Post deleted by admin after review.';
        await report.save();

        return res.status(200).json({
            success: true,
            message: 'Post deleted successfully.'
        });
    } catch (error) {
        console.error('Delete reported post error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to delete reported post.',
            error: error.message
        });
    }
};

// Dismiss a report (Admin only)
export const dismissReport = async (req, res) => {
    try {
        const { reportId } = req.params;
        const adminNotes = req.body?.adminNotes;
        const adminId = req.user._id;

        const report = await PostReport.findById(reportId);

        if (!report) {
            return res.status(404).json({
                success: false,
                message: 'Report not found.'
            });
        }

        report.status = 'dismissed';
        report.reviewedBy = adminId;
        report.reviewedAt = new Date();
        report.adminNotes = adminNotes || 'Report dismissed by admin after review.';
        await report.save();

        // Notify all reporters that their report was reviewed but dismissed
        try {
            const reporterNotifications = report.reports.map(r =>
                createNotification({
                    recipientId: r.reporterId,
                    senderId: adminId,
                    type: 'admin_action',
                    message: `A ${report.postModel === 'Post' ? 'social' : 'marketplace'} post you reported has been reviewed. The report was dismissed as the post does not violate our guidelines.`
                })
            );
            await Promise.all(reporterNotifications);
        } catch (notifError) {
            console.error('Failed to send notifications to reporters:', notifError);
            // Continue even if notification fails
        }

        return res.status(200).json({
            success: true,
            message: 'Report dismissed successfully.'
        });
    } catch (error) {
        console.error('Dismiss report error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to dismiss report.',
            error: error.message
        });
    }
};

// Get report statistics (Admin only)
export const getReportStatistics = async (req, res) => {
    try {
        const totalReports = await PostReport.countDocuments();
        const pendingReports = await PostReport.countDocuments({
            status: 'pending',
            reportCount: { $gte: REPORT_THRESHOLD }
        });
        const reviewedReports = await PostReport.countDocuments({ status: 'reviewed' });
        const dismissedReports = await PostReport.countDocuments({ status: 'dismissed' });
        const deletedReports = await PostReport.countDocuments({ status: 'deleted' });

        const highPriorityReports = await PostReport.countDocuments({
            status: 'pending',
            reportCount: { $gte: REPORT_THRESHOLD * 2 }
        });

        return res.status(200).json({
            success: true,
            statistics: {
                total: totalReports,
                pending: pendingReports,
                reviewed: reviewedReports,
                dismissed: dismissedReports,
                deleted: deletedReports,
                highPriority: highPriorityReports,
                threshold: REPORT_THRESHOLD
            }
        });
    } catch (error) {
        console.error('Get report statistics error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch report statistics.',
            error: error.message
        });
    }
};
