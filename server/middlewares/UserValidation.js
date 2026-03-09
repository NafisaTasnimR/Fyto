export const validateUpdateProfile = (req, res, next) => {
    const { name, username, bio, profilePic, previousPassword, newPassword } = req.body;

    // Check if at least one field is provided
    if (!name && !username && bio === undefined && !profilePic && !previousPassword && !newPassword) {
        return res.status(400).json({
            success: false,
            message: 'At least one field is required for update.'
        });
    }

    // Validate password change fields
    if (previousPassword !== undefined || newPassword !== undefined) {
        if (!previousPassword) {
            return res.status(400).json({ success: false, message: 'Current password is required to set a new password.' });
        }
        if (!newPassword || newPassword.length < 6) {
            return res.status(400).json({ success: false, message: 'New password must be at least 6 characters long.' });
        }
    }

    // Validate name
    if (name !== undefined) {
        if (typeof name !== 'string' || name.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Name must be a non-empty string.'
            });
        }
        if (name.trim().length < 2 || name.trim().length > 50) {
            return res.status(400).json({
                success: false,
                message: 'Name must be between 2 and 50 characters.'
            });
        }
    }

    // Validate username
    if (username !== undefined) {
        if (typeof username !== 'string' || username.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Username must be a non-empty string.'
            });
        }
        if (username.trim().length < 3 || username.trim().length > 30) {
            return res.status(400).json({
                success: false,
                message: 'Username must be between 3 and 30 characters.'
            });
        }
        // Check for valid username format (alphanumeric, underscore, hyphen)
        if (!/^[a-zA-Z0-9_-]+$/.test(username.trim())) {
            return res.status(400).json({
                success: false,
                message: 'Username can only contain letters, numbers, underscores, and hyphens.'
            });
        }
    }

    // Validate bio
    if (bio !== undefined && bio !== null) {
        if (typeof bio !== 'string') {
            return res.status(400).json({
                success: false,
                message: 'Bio must be a string.'
            });
        }
        if (bio.length > 500) {
            return res.status(400).json({
                success: false,
                message: 'Bio must not exceed 500 characters.'
            });
        }
    }

    // Validate profilePic
    if (profilePic !== undefined) {
        if (typeof profilePic !== 'string' || profilePic.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Profile picture must be a valid URL string.'
            });
        }
        // Optional: Add URL format validation
        try {
            new URL(profilePic);
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: 'Profile picture must be a valid URL.'
            });
        }
    }

    next();
};

export const validateGardenShowcase = (req, res, next) => {
    const { gardenShowcase } = req.body;

    if (!Array.isArray(gardenShowcase)) {
        return res.status(400).json({
            success: false,
            message: 'Garden showcase must be an array.'
        });
    }

    if (gardenShowcase.length > 10) {
        return res.status(400).json({
            success: false,
            message: 'Garden showcase cannot have more than 10 items.'
        });
    }

    // Validate each item in the array
    for (let i = 0; i < gardenShowcase.length; i++) {
        const item = gardenShowcase[i];

        if (!item.image || typeof item.image !== 'string') {
            return res.status(400).json({
                success: false,
                message: `Garden showcase item ${i + 1} must have a valid image URL.`
            });
        }

        if (item.caption !== undefined) {
            if (typeof item.caption !== 'string') {
                return res.status(400).json({
                    success: false,
                    message: `Garden showcase item ${i + 1} caption must be a string.`
                });
            }
            if (item.caption.length > 200) {
                return res.status(400).json({
                    success: false,
                    message: `Garden showcase item ${i + 1} caption must not exceed 200 characters.`
                });
            }
        }
    }

    next();
};
