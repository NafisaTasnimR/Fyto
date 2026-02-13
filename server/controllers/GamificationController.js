import User from '../models/User.js';
import ChallengeParticipation from '../models/ChallengeParticipation.js';

// Helper function to check and update streak
const updateStreak = async (user) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastParticipation = user.streaks.lastParticipationDate
        ? new Date(user.streaks.lastParticipationDate)
        : null;

    if (lastParticipation) {
        lastParticipation.setHours(0, 0, 0, 0);
        const diffTime = today - lastParticipation;
        const diffDays = diffTime / (1000 * 60 * 60 * 24);

        if (diffDays === 1) {
            // Consecutive day - increment streak
            user.streaks.currentStreak += 1;
        } else if (diffDays > 1) {
            // Streak broken - reset to 1
            user.streaks.currentStreak = 1;
        }
        // If diffDays === 0, same day participation, don't change streak
    } else {
        // First participation
        user.streaks.currentStreak = 1;
    }

    // Update longest streak if current is higher
    if (user.streaks.currentStreak > user.streaks.longestStreak) {
        user.streaks.longestStreak = user.streaks.currentStreak;
    }

    user.streaks.lastParticipationDate = new Date();
};

// Helper function to check and reset monthly scores
const checkAndResetMonthlyScores = async (user) => {
    const now = new Date();
    const currentMonth = now.getMonth() + 1; // 1-12
    const currentYear = now.getFullYear();

    if (!user.monthlyProgress.month || !user.monthlyProgress.year ||
        user.monthlyProgress.month !== currentMonth ||
        user.monthlyProgress.year !== currentYear) {
        // Reset monthly scores
        user.scores.monthlyScore = 0;
        user.monthlyProgress.month = currentMonth;
        user.monthlyProgress.year = currentYear;
        user.monthlyProgress.challengesCompleted = 0;
        user.monthlyProgress.lastReset = now;
    }
};

// Record daily challenge participation (quiz)
export const participateInDailyChallenge = async (req, res) => {
    try {
        const userId = req.user._id;
        const { challengeId, challengeSubType, isCorrect, metadata } = req.body;

        // Validate input
        if (!challengeId || !challengeSubType) {
            return res.status(400).json({
                success: false,
                message: 'Challenge ID and sub-type are required.'
            });
        }

        if (!['image-quiz', 'riddle-quiz'].includes(challengeSubType)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid daily challenge sub-type.'
            });
        }

        // Check if already participated today
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const existingParticipation = await ChallengeParticipation.findOne({
            userId,
            challengeId,
            participatedAt: { $gte: today, $lt: tomorrow }
        });

        if (existingParticipation) {
            return res.status(400).json({
                success: false,
                message: 'You have already participated in this challenge today.'
            });
        }

        // Get user and update streak
        const user = await User.findById(userId);
        await checkAndResetMonthlyScores(user);
        await updateStreak(user);

        // Calculate points (10 for correct, 0 for incorrect)
        const pointsEarned = isCorrect ? 10 : 0;

        // Update user scores
        user.scores.dailyScore += pointsEarned;
        user.scores.monthlyScore += pointsEarned;
        user.scores.totalScore += pointsEarned;
        user.updatedAt = new Date();

        await user.save();

        // Record participation
        const participation = new ChallengeParticipation({
            userId,
            challengeType: 'daily',
            challengeSubType,
            challengeId,
            isCorrect,
            pointsEarned,
            isCompleted: true,
            completedAt: new Date(),
            metadata: metadata || {}
        });

        await participation.save();

        return res.status(201).json({
            success: true,
            message: isCorrect
                ? `Correct! You earned ${pointsEarned} points!`
                : 'Keep trying! Your streak continues.',
            data: {
                pointsEarned,
                totalScore: user.scores.totalScore,
                dailyScore: user.scores.dailyScore,
                monthlyScore: user.scores.monthlyScore,
                currentStreak: user.streaks.currentStreak,
                longestStreak: user.streaks.longestStreak
            }
        });
    } catch (error) {
        console.error('Daily challenge participation error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to record participation.',
            error: error.message
        });
    }
};

// Update monthly challenge progress
export const updateMonthlyChallengeProgress = async (req, res) => {
    try {
        const userId = req.user._id;
        const { challengeId, progress, isCompleted, metadata } = req.body;

        if (!challengeId) {
            return res.status(400).json({
                success: false,
                message: 'Challenge ID is required.'
            });
        }

        const user = await User.findById(userId);
        await checkAndResetMonthlyScores(user);

        // Find existing participation or create new
        let participation = await ChallengeParticipation.findOne({
            userId,
            challengeId,
            challengeType: 'monthly'
        });

        if (!participation) {
            participation = new ChallengeParticipation({
                userId,
                challengeType: 'monthly',
                challengeSubType: 'task',
                challengeId,
                completionProgress: progress || 0,
                metadata: metadata || {}
            });
        } else {
            participation.completionProgress = progress || participation.completionProgress;
            participation.metadata = { ...participation.metadata, ...metadata };
        }

        // If challenge is being completed
        if (isCompleted && !participation.isCompleted) {
            participation.isCompleted = true;
            participation.completedAt = new Date();
            participation.completionProgress = 100;

            // Calculate points: 50 base points for monthly challenge
            let pointsEarned = 50;
            let bonusPoints = 0;

            // Check if completed within first 15 days of the month
            const completionDate = new Date();
            const dayOfMonth = completionDate.getDate();

            if (dayOfMonth <= 15) {
                bonusPoints = 20; // Extra 20 points for early completion
            }

            const totalPoints = pointsEarned + bonusPoints;
            participation.pointsEarned = pointsEarned;
            participation.bonusPoints = bonusPoints;

            // Update user scores
            user.scores.monthlyScore += totalPoints;
            user.scores.totalScore += totalPoints;
            user.monthlyProgress.challengesCompleted += 1;
            user.updatedAt = new Date();

            await user.save();
            await participation.save();

            return res.status(200).json({
                success: true,
                message: bonusPoints > 0
                    ? `Challenge completed! You earned ${totalPoints} points (${bonusPoints} bonus for early completion)!`
                    : `Challenge completed! You earned ${totalPoints} points!`,
                data: {
                    pointsEarned,
                    bonusPoints,
                    totalPoints,
                    totalScore: user.scores.totalScore,
                    monthlyScore: user.scores.monthlyScore,
                    monthlyChallengesCompleted: user.monthlyProgress.challengesCompleted
                }
            });
        } else {
            // Just updating progress
            await participation.save();

            return res.status(200).json({
                success: true,
                message: 'Progress updated successfully.',
                data: {
                    completionProgress: participation.completionProgress
                }
            });
        }
    } catch (error) {
        console.error('Monthly challenge update error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to update challenge progress.',
            error: error.message
        });
    }
};

// Complete extra challenge
export const completeExtraChallenge = async (req, res) => {
    try {
        const userId = req.user._id;
        const { challengeId, metadata } = req.body;

        if (!challengeId) {
            return res.status(400).json({
                success: false,
                message: 'Challenge ID is required.'
            });
        }

        // Check if already completed
        const existingParticipation = await ChallengeParticipation.findOne({
            userId,
            challengeId,
            challengeType: 'extra',
            isCompleted: true
        });

        if (existingParticipation) {
            return res.status(400).json({
                success: false,
                message: 'You have already completed this extra challenge.'
            });
        }

        const user = await User.findById(userId);
        await checkAndResetMonthlyScores(user);

        // Extra challenges give 30 points
        const pointsEarned = 30;

        // Update user scores
        user.scores.monthlyScore += pointsEarned;
        user.scores.totalScore += pointsEarned;
        user.updatedAt = new Date();

        await user.save();

        // Record participation
        const participation = new ChallengeParticipation({
            userId,
            challengeType: 'extra',
            challengeSubType: 'milestone',
            challengeId,
            pointsEarned,
            isCompleted: true,
            completedAt: new Date(),
            completionProgress: 100,
            metadata: metadata || {}
        });

        await participation.save();

        return res.status(201).json({
            success: true,
            message: `Extra challenge completed! You earned ${pointsEarned} points!`,
            data: {
                pointsEarned,
                totalScore: user.scores.totalScore,
                monthlyScore: user.scores.monthlyScore
            }
        });
    } catch (error) {
        console.error('Extra challenge completion error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to record challenge completion.',
            error: error.message
        });
    }
};

// Get user's gamification stats
export const getUserStats = async (req, res) => {
    try {
        const userId = req.user._id;

        const user = await User.findById(userId)
            .select('scores streaks monthlyProgress username name profilePic');

        await checkAndResetMonthlyScores(user);
        await user.save();

        // Get participation history
        const participationCount = await ChallengeParticipation.countDocuments({
            userId,
            isCompleted: true
        });

        // Get this month's completions
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const monthlyCompletions = await ChallengeParticipation.countDocuments({
            userId,
            isCompleted: true,
            completedAt: { $gte: startOfMonth }
        });

        return res.status(200).json({
            success: true,
            data: {
                scores: user.scores,
                streaks: user.streaks,
                monthlyProgress: user.monthlyProgress,
                totalChallengesCompleted: participationCount,
                monthlyChallengesCompleted: monthlyCompletions
            }
        });
    } catch (error) {
        console.error('Get user stats error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch user statistics.',
            error: error.message
        });
    }
};

// Get leaderboard
export const getLeaderboard = async (req, res) => {
    try {
        const { type = 'total', limit = 10 } = req.query;
        const userId = req.user._id;

        let sortField;
        switch (type) {
            case 'daily':
                sortField = 'scores.dailyScore';
                break;
            case 'monthly':
                sortField = 'scores.monthlyScore';
                break;
            case 'total':
            default:
                sortField = 'scores.totalScore';
                break;
        }

        // Get top users
        const topUsers = await User.find()
            .select('username name profilePic scores streaks')
            .sort({ [sortField]: -1 })
            .limit(parseInt(limit));

        // Get current user's rank
        const allUsers = await User.find()
            .select('_id scores')
            .sort({ [sortField]: -1 });

        const userRank = allUsers.findIndex(u => u._id.toString() === userId.toString()) + 1;

        const currentUser = await User.findById(userId)
            .select('username name profilePic scores streaks');

        return res.status(200).json({
            success: true,
            data: {
                leaderboard: topUsers.map((user, index) => ({
                    rank: index + 1,
                    userId: user._id,
                    username: user.username,
                    name: user.name,
                    profilePic: user.profilePic,
                    score: type === 'daily' ? user.scores.dailyScore :
                        type === 'monthly' ? user.scores.monthlyScore :
                            user.scores.totalScore,
                    currentStreak: user.streaks.currentStreak
                })),
                currentUser: {
                    rank: userRank,
                    userId: currentUser._id,
                    username: currentUser.username,
                    name: currentUser.name,
                    profilePic: currentUser.profilePic,
                    score: type === 'daily' ? currentUser.scores.dailyScore :
                        type === 'monthly' ? currentUser.scores.monthlyScore :
                            currentUser.scores.totalScore,
                    currentStreak: currentUser.streaks.currentStreak
                },
                type
            }
        });
    } catch (error) {
        console.error('Get leaderboard error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch leaderboard.',
            error: error.message
        });
    }
};

// Get user's challenge history
export const getChallengeHistory = async (req, res) => {
    try {
        const userId = req.user._id;
        const { challengeType, page = 1, limit = 20 } = req.query;

        const query = { userId };
        if (challengeType) {
            query.challengeType = challengeType;
        }

        const participations = await ChallengeParticipation.find(query)
            .sort({ participatedAt: -1 })
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit));

        const total = await ChallengeParticipation.countDocuments(query);

        return res.status(200).json({
            success: true,
            data: {
                participations,
                pagination: {
                    total,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    totalPages: Math.ceil(total / parseInt(limit))
                }
            }
        });
    } catch (error) {
        console.error('Get challenge history error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch challenge history.',
            error: error.message
        });
    }
};
