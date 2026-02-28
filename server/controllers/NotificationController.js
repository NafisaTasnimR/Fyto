import Notification from '../models/Notification.js';

// Get all notifications for the authenticated user
export const getNotifications = async (req, res) => {
    try {
        const userId = req.user._id;
        const { page = 1, limit = 20, unreadOnly = false } = req.query;

        const filter = { recipientId: userId };
        if (unreadOnly === 'true') {
            filter.isRead = false;
        }

        const skip = (Number(page) - 1) * Number(limit);

        const notifications = await Notification.find(filter)
            .populate('senderId', 'name username profilePic')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit));

        const totalCount = await Notification.countDocuments(filter);
        const unreadCount = await Notification.countDocuments({
            recipientId: userId,
            isRead: false
        });

        return res.status(200).json({
            success: true,
            notifications,
            pagination: {
                currentPage: Number(page),
                totalPages: Math.ceil(totalCount / Number(limit)),
                totalCount,
                limit: Number(limit)
            },
            unreadCount
        });
    } catch (error) {
        console.error('Get notifications error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch notifications.',
            error: error.message
        });
    }
};

// Mark a notification as read
export const markAsRead = async (req, res) => {
    try {
        const { notificationId } = req.params;
        const userId = req.user._id;

        const notification = await Notification.findOne({
            _id: notificationId,
            recipientId: userId
        });

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: 'Notification not found.'
            });
        }

        notification.isRead = true;
        await notification.save();

        return res.status(200).json({
            success: true,
            message: 'Notification marked as read.',
            notification
        });
    } catch (error) {
        console.error('Mark as read error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to mark notification as read.',
            error: error.message
        });
    }
};

// Mark all notifications as read
export const markAllAsRead = async (req, res) => {
    try {
        const userId = req.user._id;

        await Notification.updateMany(
            { recipientId: userId, isRead: false },
            { isRead: true }
        );

        return res.status(200).json({
            success: true,
            message: 'All notifications marked as read.'
        });
    } catch (error) {
        console.error('Mark all as read error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to mark all notifications as read.',
            error: error.message
        });
    }
};

// Delete a notification
export const deleteNotification = async (req, res) => {
    try {
        const { notificationId } = req.params;
        const userId = req.user._id;

        const notification = await Notification.findOne({
            _id: notificationId,
            recipientId: userId
        });

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: 'Notification not found.'
            });
        }

        await Notification.findByIdAndDelete(notificationId);

        return res.status(200).json({
            success: true,
            message: 'Notification deleted successfully.'
        });
    } catch (error) {
        console.error('Delete notification error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to delete notification.',
            error: error.message
        });
    }
};

// Get unread notification count
export const getUnreadCount = async (req, res) => {
    try {
        const userId = req.user._id;

        const unreadCount = await Notification.countDocuments({
            recipientId: userId,
            isRead: false
        });

        return res.status(200).json({
            success: true,
            unreadCount
        });
    } catch (error) {
        console.error('Get unread count error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to get unread count.',
            error: error.message
        });
    }
};

// Helper function to create a notification (used by other controllers)
export const createNotification = async (notificationData) => {
    try {
        // Don't send notification to yourself
        if (notificationData.recipientId.toString() === notificationData.senderId?.toString()) {
            return null;
        }

        const notification = new Notification(notificationData);
        await notification.save();
        return notification;
    } catch (error) {
        console.error('Create notification error:', error);
        throw error;
    }
};
