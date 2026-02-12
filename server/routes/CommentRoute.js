import express from 'express';
import {
    createReply,
    updateComment,
    deleteComment,
    getCommentById
} from '../controllers/CommentController.js';
import { createCommentValidation, updateCommentValidation } from '../middlewares/CommentValidation.js';
import verifyToken from '../middlewares/Authorization.js';

const router = express.Router();

// All routes require authentication
router.use(verifyToken);

// Get a single comment by ID
router.get('/:commentId', getCommentById);

// Create a reply to a comment
router.post('/:commentId/replies', createCommentValidation, createReply);

// Update a comment
router.put('/:commentId', updateCommentValidation, updateComment);

// Delete a comment
router.delete('/:commentId', deleteComment);

export default router;
