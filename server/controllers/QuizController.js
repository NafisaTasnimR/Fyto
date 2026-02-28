import { generateDailyQuiz, generateMultipleQuizzes, validateQuizAnswer } from '../services/QuizGenerationService.js';
import ChallengeParticipation from '../models/ChallengeParticipation.js';

// Get today's daily quiz
export const getTodaysDailyQuiz = async (req, res) => {
    try {
        const { type = 'image-quiz', difficulty = 'medium' } = req.query;

        // Check if user already participated today
        const userId = req.user._id;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const todaysParticipation = await ChallengeParticipation.findOne({
            userId,
            challengeType: 'daily',
            participatedAt: { $gte: today, $lt: tomorrow }
        });

        // Generate quiz
        const quiz = await generateDailyQuiz(type, difficulty);

        // Return quiz with participation status
        return res.status(200).json({
            success: true,
            message: todaysParticipation
                ? 'You have already participated in today\'s quiz. Here\'s another one for practice!'
                : 'Today\'s quiz is ready!',
            quiz: {
                ...quiz,
                // Don't send correct answer to client
                correctAnswer: undefined,
                explanation: undefined
            },
            alreadyParticipated: !!todaysParticipation,
            participationData: todaysParticipation ? {
                pointsEarned: todaysParticipation.pointsEarned,
                wasCorrect: todaysParticipation.isCorrect,
                participatedAt: todaysParticipation.participatedAt
            } : null
        });
    } catch (error) {
        console.error('Get daily quiz error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to generate quiz.',
            error: error.message
        });
    }
};

// Submit quiz answer (this will be called before participation endpoint)
export const submitQuizAnswer = async (req, res) => {
    try {
        const { quizId, userAnswer, quizData } = req.body;

        if (!quizId || !userAnswer || !quizData) {
            return res.status(400).json({
                success: false,
                message: 'Quiz ID, answer, and quiz data are required.'
            });
        }

        // Validate answer
        const validation = validateQuizAnswer(quizData, userAnswer);

        return res.status(200).json({
            success: true,
            ...validation
        });
    } catch (error) {
        console.error('Submit quiz answer error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to validate answer.',
            error: error.message
        });
    }
};

// Generate quiz batch (admin function)
export const generateQuizBatch = async (req, res) => {
    try {
        const { count = 5, types } = req.body;

        const quizTypes = types || ['image-quiz', 'riddle-quiz'];
        const quizzes = await generateMultipleQuizzes(count, quizTypes);

        return res.status(200).json({
            success: true,
            message: `Generated ${quizzes.length} quizzes successfully.`,
            quizzes: quizzes.map(q => ({
                ...q,
                // Keep answers for admin review
            }))
        });
    } catch (error) {
        console.error('Generate quiz batch error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to generate quiz batch.',
            error: error.message
        });
    }
};

// Get random practice quiz (doesn't affect scores)
export const getPracticeQuiz = async (req, res) => {
    try {
        const { type = 'image-quiz', difficulty = 'medium' } = req.query;

        const quiz = await generateDailyQuiz(type, difficulty);

        return res.status(200).json({
            success: true,
            message: 'Practice quiz generated!',
            quiz: {
                ...quiz,
                correctAnswer: undefined, // Don't send answer
                explanation: undefined,
                isPractice: true
            }
        });
    } catch (error) {
        console.error('Get practice quiz error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to generate practice quiz.',
            error: error.message
        });
    }
};

// Check API configuration status
export const checkQuizAPIStatus = async (req, res) => {
    try {
        const geminiConfigured = !!process.env.QUIZ_PROVIDER;

        const status = geminiConfigured ? 'configured' : 'not_configured';

        return res.status(200).json({
            success: true,
            data: {
                status,
                activeProvider: geminiConfigured ? 'gemini' : null,
                available: {
                    gemini: geminiConfigured
                },
                fallbackEnabled: true,
                message: geminiConfigured
                    ? 'Quiz generation is active using Gemini'
                    : 'No API key configured. Using fallback quizzes. Add QUIZ_PROVIDER to .env file.'
            }
        });
    } catch (error) {
        console.error('Check API status error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to check API status.',
            error: error.message
        });
    }
};
