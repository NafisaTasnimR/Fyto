
export const validateCreatePost = (req, res, next) => {
    const {
        photos,
        treeName,
        treeType,
        offering,
        postType
    } = req.body;

    if (!photos || photos.length === 0) {
        return res.status(400).json({
            success: false,
            message: 'At least one photo is required.'
        });
    }

    if (!treeName || !treeType || !offering || !postType) {
        return res.status(400).json({
            success: false,
            message: 'Tree name, tree type, offering, and post type are required.'
        });
    }

    const validPostTypes = ['sell', 'exchange', 'donate'];
    if (!validPostTypes.includes(postType)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid post type. Must be sell, exchange, or donate.'
        });
    }

    next();
};
