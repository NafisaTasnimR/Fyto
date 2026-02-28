import MarketplacePost from '../models/MarketplacePost.js';

/**
 * Delete all expired marketplace posts
 * This is a backup to MongoDB's TTL index
 * TTL index might have up to 60 seconds delay, this provides immediate cleanup
 */
export const deleteExpiredPosts = async () => {
    try {
        const now = new Date();

        const result = await MarketplacePost.deleteMany({
            expiresAt: { $lte: now }
        });

        if (result.deletedCount > 0) {
            console.log(`🗑️  Deleted ${result.deletedCount} expired marketplace posts`);
        }

        return {
            success: true,
            deletedCount: result.deletedCount
        };
    } catch (error) {
        console.error('Error deleting expired posts:', error);
        return {
            success: false,
            error: error.message
        };
    }
};

/**
 * Get count of posts that will expire soon (within next 7 days)
 */
export const getExpiringPostsCount = async (userId) => {
    try {
        const now = new Date();
        const sevenDaysFromNow = new Date();
        sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

        const count = await MarketplacePost.countDocuments({
            userId,
            status: 'available',
            expiresAt: {
                $gte: now,
                $lte: sevenDaysFromNow
            }
        });

        return count;
    } catch (error) {
        console.error('Error getting expiring posts count:', error);
        return 0;
    }
};

/**
 * Extend expiration date for a specific post
 * Useful if user wants to keep post longer
 */
export const extendPostExpiration = async (postId, userId, additionalDays = 30) => {
    try {
        const post = await MarketplacePost.findOne({
            _id: postId,
            userId: userId
        });

        if (!post) {
            throw new Error('Post not found or unauthorized');
        }

        // Extend from current expiration date
        const newExpiresAt = new Date(post.expiresAt);
        newExpiresAt.setDate(newExpiresAt.getDate() + additionalDays);

        post.expiresAt = newExpiresAt;
        await post.save();

        return {
            success: true,
            expiresAt: newExpiresAt
        };
    } catch (error) {
        console.error('Error extending post expiration:', error);
        throw error;
    }
};

/**
 * Get days remaining until expiration
 */
export const getDaysUntilExpiration = (expiresAt) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diffTime = expiry - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
};
