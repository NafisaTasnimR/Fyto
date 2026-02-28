import express from 'express';
import {
    createMarketplacePost,
    getAllAvailablePosts,
    searchMarketplacePosts,
    getMarketplacePostById,
    getUserMarketplacePosts,
    updateMarketplacePostStatus,
    markPostAsSold,
    deleteMarketplacePost,
    extendPostExpirationDate,
    toggleSavePost,
    getSavedPosts,
    checkIfPostSaved
} from '../controllers/MarketplaceController.js';
import verifyToken from '../middlewares/Authorization.js';
import {
    validateCreatePost,
    validateStatusUpdate,
    validateStatusQuery
} from '../middlewares/MarketplaceValidation.js';

const router = express.Router();


router.use(verifyToken);

router.post('/', validateCreatePost, createMarketplacePost);

router.get('/', getAllAvailablePosts);

router.get('/search', searchMarketplacePosts);

// Get user's saved posts
router.get('/saved', getSavedPosts);

router.get('/user', validateStatusQuery, getUserMarketplacePosts);

router.get('/:postId', getMarketplacePostById);

// Check if post is saved
router.get('/:postId/saved', checkIfPostSaved);

router.put('/:postId/status', validateStatusUpdate, updateMarketplacePostStatus);

router.put('/:postId/sold', markPostAsSold);

// Extend post expiration by additional days
router.put('/:postId/extend', extendPostExpirationDate);

// Toggle save/unsave post
router.put('/:postId/save', toggleSavePost);

router.delete('/:postId', deleteMarketplacePost);

export default router;
