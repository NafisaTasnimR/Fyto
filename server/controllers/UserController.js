import UserModel from "../models/User.js";

const getCurrentUser = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await UserModel.findById(userId).select('-passwordHash');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error('Get current user error:', error);
        res.status(500).json({ message: "Internal Server Error", success: false });
    }
}

const getUserById = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await UserModel.findById(userId).select('-passwordHash');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error('Get user by ID error:', error);
        res.status(500).json({ message: "Internal Server Error", success: false });
    }
}

const searchUsers = async (req, res) => {
    try {
        const { query } = req.query;

        if (!query || query.trim() === '') {
            return res.status(400).json({
                message: "Search query is required",
                success: false
            });
        }

        // Search users by username or name (case-insensitive)
        const users = await UserModel.find({
            $or: [
                { username: { $regex: query, $options: 'i' } },
                { name: { $regex: query, $options: 'i' } }
            ]
        })
            .select('name username profilePic bio')
            .limit(20);

        return res.status(200).json({
            success: true,
            count: users.length,
            users
        });
    } catch (error) {
        console.error('Search users error:', error);
        res.status(500).json({ message: "Internal Server Error", success: false });
    }
}

// Get user profile with public posts and journals
const getUserProfile = async (req, res) => {
    try {
        const { userId } = req.params;
        const currentUserId = req.user._id;

        const user = await UserModel.findById(userId).select('-passwordHash');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Import models dynamically to avoid circular dependencies
        const Post = (await import('../models/Post.js')).default;
        const Journal = (await import('../models/Journal.js')).default;

        // Fetch public posts (or all if viewing own profile)
        const postsQuery = userId === currentUserId.toString()
            ? { authorId: userId }
            : { authorId: userId, isPrivate: false };

        const posts = await Post.find(postsQuery)
            .sort({ createdAt: -1 })
            .limit(10);

        // Fetch public journals (or all if viewing own profile)
        const journalsQuery = userId === currentUserId.toString()
            ? { userId: userId }
            : { userId: userId, isPublic: true };

        const journals = await Journal.find(journalsQuery)
            .sort({ createdAt: -1 })
            .limit(10);

        return res.status(200).json({
            success: true,
            data: {
                user,
                posts,
                journals,
                postsCount: posts.length,
                journalsCount: journals.length
            }
        });
    } catch (error) {
        console.error('Get user profile error:', error);
        res.status(500).json({ message: "Internal Server Error", success: false });
    }
}

// Update user profile
const updateProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        const { name, username, bio, profilePic } = req.body;

        const user = await UserModel.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Check if username is being changed and if it's already taken
        if (username && username !== user.username) {
            const existingUser = await UserModel.findOne({ username });
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: "Username is already taken"
                });
            }
            user.username = username;
        }

        // Check if name is being changed and if it's already taken
        if (name && name !== user.name) {
            const existingUser = await UserModel.findOne({ name });
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: "Name is already taken"
                });
            }
            user.name = name;
        }

        // Update other fields
        if (bio !== undefined) user.bio = bio;
        if (profilePic) user.profilePic = profilePic;

        user.updatedAt = new Date();
        await user.save();

        // Return updated user without password
        const updatedUser = await UserModel.findById(userId).select('-passwordHash');

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: updatedUser
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({
            message: "Internal Server Error",
            success: false,
            error: error.message
        });
    }
}

// Update garden showcase
const updateGardenShowcase = async (req, res) => {
    try {
        const userId = req.user._id;
        const { gardenShowcase } = req.body;

        if (!Array.isArray(gardenShowcase)) {
            return res.status(400).json({
                success: false,
                message: "Garden showcase must be an array"
            });
        }

        const user = await UserModel.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        user.gardenShowcase = gardenShowcase;
        user.updatedAt = new Date();
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Garden showcase updated successfully",
            data: user.gardenShowcase
        });
    } catch (error) {
        console.error('Update garden showcase error:', error);
        res.status(500).json({
            message: "Internal Server Error",
            success: false,
            error: error.message
        });
    }
}

export { getCurrentUser, getUserById, searchUsers, getUserProfile, updateProfile, updateGardenShowcase };
