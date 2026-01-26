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

export { getCurrentUser, getUserById, searchUsers };
