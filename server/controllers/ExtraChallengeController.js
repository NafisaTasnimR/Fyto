import {
    getVisibleChallenges,
    getCompletedChallenges,
    getChallengeStats
} from '../services/ExtraChallengeService.js';

/**
 * Get visible extra challenges for current user
 * Shows 5 challenges from current batch with progress
 */
export const getMyExtraChallenges = async (req, res) => {
    try {
        const userId = req.user._id;

        const result = await getVisibleChallenges(userId);

        return res.status(200).json({
            success: true,
            data: result
        });

    } catch (error) {
        console.error('Error getting extra challenges:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to get extra challenges',
            error: error.message
        });
    }
};

/**
 * Get all completed extra challenges
 */
export const getMyCompletedChallenges = async (req, res) => {
    try {
        const userId = req.user._id;

        const completedChallenges = await getCompletedChallenges(userId);

        return res.status(200).json({
            success: true,
            data: completedChallenges,
            count: completedChallenges.length
        });

    } catch (error) {
        console.error('Error getting completed challenges:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to get completed challenges',
            error: error.message
        });
    }
};

/**
 * Get challenge statistics
 */
export const getMyChallengeStats = async (req, res) => {
    try {
        const userId = req.user._id;

        const stats = await getChallengeStats(userId);

        return res.status(200).json({
            success: true,
            data: stats
        });

    } catch (error) {
        console.error('Error getting challenge stats:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to get challenge statistics',
            error: error.message
        });
    }
};
