import express from 'express';
import {
    createMarketplacePost,
    getAllAvailablePosts,
    searchMarketplacePosts,
    getMarketplacePostById,
    getUserMarketplacePosts,
    updateMarketplacePostStatus,
    markPostAsSold,
    deleteMarketplacePost
} from '../controllers/MarketplaceController.js';
import verifyToken from '../middlewares/Authorization.js';
import {
    validateCreatePost,
    validateStatusUpdate,
    validateStatusQuery
} from '../middlewares/MarketplaceValidation.js';

const router = express.Router();

// All routes require authentication
router.use(verifyToken);

router.post('/', validateCreatePost, createMarketplacePost);

router.get('/', getAllAvailablePosts);

router.get('/search', searchMarketplacePosts);

router.get('/user', validateStatusQuery, getUserMarketplacePosts);

router.get('/:postId', getMarketplacePostById);

router.put('/:postId/status', validateStatusUpdate, updateMarketplacePostStatus);

router.put('/:postId/sold', markPostAsSold);

router.delete('/:postId', deleteMarketplacePost);

export default router;
