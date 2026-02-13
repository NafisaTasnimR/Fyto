import express from 'express';
import {
    participateInDailyChallenge,
    updateMonthlyChallengeProgress,
    completeExtraChallenge,
    getUserStats,
    getLeaderboard,
    getChallengeHistory
} from '../controllers/GamificationController.js';
import {
    getTodaysDailyQuiz,
    submitQuizAnswer,
    getPracticeQuiz,
    generateQuizBatch,
    checkQuizAPIStatus
} from '../controllers/QuizController.js';
import verifyToken from '../middlewares/Authorization.js';

const router = express.Router();

// All routes require authentication
router.use(verifyToken);

// Quiz routes
router.get('/quiz/daily', getTodaysDailyQuiz); // Get today's daily quiz
router.post('/quiz/submit', submitQuizAnswer); // Submit answer (doesn't save, just validates)
router.get('/quiz/practice', getPracticeQuiz); // Get practice quiz
router.post('/quiz/generate-batch', generateQuizBatch); // Admin: generate multiple quizzes
router.get('/quiz/api-status', checkQuizAPIStatus); // Check if API is configured

// Daily challenge participation (after quiz is completed)
router.post('/daily', participateInDailyChallenge);

// Monthly challenge progress
router.post('/monthly', updateMonthlyChallengeProgress);

// Extra challenge completion
router.post('/extra', completeExtraChallenge);

// Get user's stats
router.get('/stats', getUserStats);

// Get leaderboard (query params: type=total|monthly|daily, limit=10)
router.get('/leaderboard', getLeaderboard);

// Get challenge history (query params: challengeType, page, limit)
router.get('/history', getChallengeHistory);

export default router;
