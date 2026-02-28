import express from 'express';
import {
    reportPost,
    getReportedPosts,
    getReportedPostById,
    deleteReportedPost,
    dismissReport,
    getReportStatistics
} from '../controllers/ReportController.js';
import verifyToken, { verifyAdmin } from '../middlewares/Authorization.js';
import { reportPostValidation } from '../middlewares/ReportValidation.js';

const router = express.Router();

// All routes require authentication
router.use(verifyToken);

// User route - Report a post
router.post('/:postId', reportPostValidation, reportPost);

// Admin routes - Require admin privileges
router.get('/admin/statistics', verifyAdmin, getReportStatistics);
router.get('/admin/posts', verifyAdmin, getReportedPosts);
router.get('/admin/posts/:reportId', verifyAdmin, getReportedPostById);
router.delete('/admin/posts/:reportId', verifyAdmin, deleteReportedPost);
router.patch('/admin/posts/:reportId/dismiss', verifyAdmin, dismissReport);

export default router;
