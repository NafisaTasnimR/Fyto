import User from '../models/User.js';
import ExtraChallenge from '../models/ExtraChallenge.js';
import ChallengeParticipation from '../models/ChallengeParticipation.js';

/**
 * Update user's extra challenge progress when an action is performed
 * @param {String} userId - User ID
 * @param {String} trackingType - Type of action performed
 * @param {Number} incrementBy - Amount to increment (default: 1)
 */
export const trackChallengeProgress = async (userId, trackingType, incrementBy = 1) => {
    try {
        const user = await User.findById(userId);
        if (!user) return;

        // Initialize extraChallenges if not exists
        if (!user.extraChallenges) {
            user.extraChallenges = {
                currentBatch: 1,
                completedChallenges: [],
                progress: {
                    postsCreated: 0,
                    plantsIdentified: 0,
                    journalsCreated: 0,
                    likesGiven: 0,
                    commentsCreated: 0,
                    likesReceived: 0,
                    dailyChallengesCompleted: 0,
                    consecutiveLoginDays: 0
                }
            };
        }

        // Update progress based on tracking type
        switch (trackingType) {
            case 'post_create':
                user.extraChallenges.progress.postsCreated += incrementBy;
                break;
            case 'plant_identify':
                user.extraChallenges.progress.plantsIdentified += incrementBy;
                break;
            case 'journal_create':
                user.extraChallenges.progress.journalsCreated += incrementBy;
                break;
            case 'like_give':
                user.extraChallenges.progress.likesGiven += incrementBy;
                break;
            case 'comment_create':
                user.extraChallenges.progress.commentsCreated += incrementBy;
                break;
            case 'like_receive':
                user.extraChallenges.progress.likesReceived += incrementBy;
                break;
            case 'daily_challenge_complete':
                user.extraChallenges.progress.dailyChallengesCompleted += incrementBy;
                break;
            case 'consecutive_login':
                // Handle consecutive login separately
                await updateConsecutiveLogin(user);
                break;
        }

        await user.save();

        // Check if any challenges are now completed
        await checkAndCompleteExtraChallenges(user);

    } catch (error) {
        console.error('Error tracking challenge progress:', error);
    }
};

/**
 * Update consecutive login tracking
 */
const updateConsecutiveLogin = async (user) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastLogin = user.extraChallenges.progress.lastLoginDate
        ? new Date(user.extraChallenges.progress.lastLoginDate)
        : null;

    if (lastLogin) {
        lastLogin.setHours(0, 0, 0, 0);
        const diffTime = today - lastLogin;
        const diffDays = diffTime / (1000 * 60 * 60 * 24);

        if (diffDays === 1) {
            // Consecutive day - increment streak
            user.extraChallenges.progress.consecutiveLoginDays += 1;
        } else if (diffDays > 1) {
            // Streak broken - reset to 1
            user.extraChallenges.progress.consecutiveLoginDays = 1;
        }
        // If diffDays === 0, same day, don't change
    } else {
        // First login
        user.extraChallenges.progress.consecutiveLoginDays = 1;
    }

    user.extraChallenges.progress.lastLoginDate = new Date();
};

/**
 * Check if any challenges are completed and award points
 */
const checkAndCompleteExtraChallenges = async (user) => {
    try {
        const currentBatch = user.extraChallenges.currentBatch || 1;

        // Get all challenges for current batch that aren't completed yet
        const challenges = await ExtraChallenge.find({
            batch: currentBatch,
            challengeId: { $nin: user.extraChallenges.completedChallenges },
            isActive: true
        });

        let hasNewCompletion = false;

        for (const challenge of challenges) {
            const currentProgress = getCurrentProgress(user, challenge.trackingType);

            // Check if challenge is completed
            if (currentProgress >= challenge.targetCount) {
                // Mark challenge as completed
                user.extraChallenges.completedChallenges.push(challenge.challengeId);

                // Award points
                user.scores.totalScore += challenge.points;

                // Record participation
                await ChallengeParticipation.create({
                    userId: user._id,
                    challengeType: 'extra',
                    challengeSubType: 'milestone',
                    challengeId: challenge.challengeId,
                    isCorrect: null,
                    pointsEarned: challenge.points,
                    isCompleted: true,
                    completedAt: new Date(),
                    completionProgress: 100,
                    metadata: {
                        title: challenge.title,
                        description: challenge.description
                    }
                });

                hasNewCompletion = true;

                console.log(`✅ User ${user._id} completed extra challenge: ${challenge.title} (+${challenge.points} points)`);
            }
        }

        // Check if all challenges in current batch are completed
        const allChallengesInBatch = await ExtraChallenge.find({
            batch: currentBatch,
            isActive: true
        });

        const completedInBatch = allChallengesInBatch.filter(c =>
            user.extraChallenges.completedChallenges.includes(c.challengeId)
        );

        // If all 5 challenges in batch are completed, unlock next batch
        if (completedInBatch.length === allChallengesInBatch.length && currentBatch < 4) {
            user.extraChallenges.currentBatch = currentBatch + 1;
            console.log(`🎉 User ${user._id} unlocked batch ${currentBatch + 1}!`);
        }

        if (hasNewCompletion) {
            await user.save();
        }

    } catch (error) {
        console.error('Error checking completed challenges:', error);
    }
};

/**
 * Get current progress for a tracking type
 */
const getCurrentProgress = (user, trackingType) => {
    const progressMap = {
        'post_create': user.extraChallenges.progress.postsCreated,
        'plant_identify': user.extraChallenges.progress.plantsIdentified,
        'journal_create': user.extraChallenges.progress.journalsCreated,
        'like_give': user.extraChallenges.progress.likesGiven,
        'comment_create': user.extraChallenges.progress.commentsCreated,
        'like_receive': user.extraChallenges.progress.likesReceived,
        'daily_challenge_complete': user.extraChallenges.progress.dailyChallengesCompleted,
        'consecutive_login': user.extraChallenges.progress.consecutiveLoginDays
    };

    return progressMap[trackingType] || 0;
};

/**
 * Get visible challenges for user with progress
 */
export const getVisibleChallenges = async (userId) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        // Initialize if needed
        if (!user.extraChallenges) {
            user.extraChallenges = {
                currentBatch: 1,
                completedChallenges: [],
                progress: {
                    postsCreated: 0,
                    plantsIdentified: 0,
                    journalsCreated: 0,
                    likesGiven: 0,
                    commentsCreated: 0,
                    likesReceived: 0,
                    dailyChallengesCompleted: 0,
                    consecutiveLoginDays: 0
                }
            };
            await user.save();
        }

        const currentBatch = user.extraChallenges.currentBatch || 1;

        // Get all challenges for current batch
        const challenges = await ExtraChallenge.find({
            batch: currentBatch,
            isActive: true
        }).sort({ orderInBatch: 1 });

        // Add progress information to each challenge
        const challengesWithProgress = challenges.map(challenge => {
            const currentProgress = getCurrentProgress(user, challenge.trackingType);
            const isCompleted = user.extraChallenges.completedChallenges.includes(challenge.challengeId);

            return {
                id: challenge._id,
                challengeId: challenge.challengeId,
                title: challenge.title,
                description: challenge.description,
                points: challenge.points,
                targetCount: challenge.targetCount,
                currentProgress: currentProgress,
                progressPercentage: Math.min(100, Math.round((currentProgress / challenge.targetCount) * 100)),
                isCompleted: isCompleted,
                batch: challenge.batch,
                orderInBatch: challenge.orderInBatch
            };
        });

        return {
            challenges: challengesWithProgress,
            currentBatch: currentBatch,
            totalBatches: 4,
            completedChallengesCount: user.extraChallenges.completedChallenges.length
        };

    } catch (error) {
        console.error('Error getting visible challenges:', error);
        throw error;
    }
};

/**
 * Get all completed challenges for user
 */
export const getCompletedChallenges = async (userId) => {
    try {
        const participations = await ChallengeParticipation.find({
            userId: userId,
            challengeType: 'extra',
            isCompleted: true
        }).sort({ completedAt: -1 });

        return participations.map(p => ({
            challengeId: p.challengeId,
            title: p.metadata?.title || 'Challenge',
            pointsEarned: p.pointsEarned,
            completedAt: p.completedAt
        }));

    } catch (error) {
        console.error('Error getting completed challenges:', error);
        throw error;
    }
};

/**
 * Get challenge statistics for user
 */
export const getChallengeStats = async (userId) => {
    try {
        const user = await User.findById(userId);
        if (!user || !user.extraChallenges) {
            return {
                totalCompleted: 0,
                totalPoints: 0,
                currentBatch: 1,
                progress: {}
            };
        }

        const totalPoints = await ChallengeParticipation.aggregate([
            {
                $match: {
                    userId: user._id,
                    challengeType: 'extra',
                    isCompleted: true
                }
            },
            {
                $group: {
                    _id: null,
                    totalPoints: { $sum: '$pointsEarned' }
                }
            }
        ]);

        return {
            totalCompleted: user.extraChallenges.completedChallenges.length,
            totalPoints: totalPoints[0]?.totalPoints || 0,
            currentBatch: user.extraChallenges.currentBatch || 1,
            progress: user.extraChallenges.progress
        };

    } catch (error) {
        console.error('Error getting challenge stats:', error);
        throw error;
    }
};
