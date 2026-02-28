export const reportPostValidation = (req, res, next) => {
    const { reason, postType } = req.body;

    if (!reason || typeof reason !== 'string' || reason.trim().length === 0) {
        return res.status(400).json({
            success: false,
            message: 'Report reason is required and must be a non-empty string.'
        });
    }

    if (reason.trim().length < 10) {
        return res.status(400).json({
            success: false,
            message: 'Report reason must be at least 10 characters long.'
        });
    }

    if (reason.trim().length > 500) {
        return res.status(400).json({
            success: false,
            message: 'Report reason must not exceed 500 characters.'
        });
    }

    if (!postType || !['social', 'marketplace'].includes(postType)) {
        return res.status(400).json({
            success: false,
            message: 'Post type is required and must be either "social" or "marketplace".'
        });
    }

    next();
};
