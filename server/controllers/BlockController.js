import Block from "../models/Block.js";
import Page from "../models/Page.js";
import Journal from "../models/Journal.js";

// Create a new block (text or image)
export const createBlock = async (req, res) => {
    try {
        const { pageId } = req.params;
        const userId = req.user._id;
        const { type, position, text, styles, image } = req.body;

        // Verify page exists and belongs to user
        const page = await Page.findById(pageId).populate('journalId');
        if (!page) {
            return res.status(404).json({
                success: false,
                message: "Page not found"
            });
        }

        if (page.journalId.userId.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: "Access denied"
            });
        }

        // Get the next order number
        const lastBlock = await Block.findOne({ pageId })
            .sort({ order: -1 })
            .limit(1);

        const order = lastBlock ? lastBlock.order + 1 : 0;

        const block = new Block({
            pageId,
            type: type || "text",
            position: position || { x: 0, y: 0 },
            order
        });

        if (type === "text") {
            block.text = text || "";
            if (styles) {
                block.styles = {
                    ...block.styles,
                    ...styles
                };
            }
        } else if (type === "image") {
            if (!image || !image.url) {
                return res.status(400).json({
                    success: false,
                    message: "Image URL is required for image blocks"
                });
            }
            block.image = image;
        }

        await block.save();

        return res.status(201).json({
            success: true,
            message: "Block created successfully",
            data: block
        });
    } catch (error) {
        console.error("Error creating block:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to create block",
            error: error.message
        });
    }
};

// Get all blocks for a page
export const getPageBlocks = async (req, res) => {
    try {
        const { pageId } = req.params;
        const userId = req.user._id;

        // Verify page exists and belongs to user
        const page = await Page.findById(pageId).populate('journalId');
        if (!page) {
            return res.status(404).json({
                success: false,
                message: "Page not found"
            });
        }

        if (page.journalId.userId.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: "Access denied"
            });
        }

        const blocks = await Block.find({ pageId })
            .sort({ order: 1 })
            .lean();

        return res.status(200).json({
            success: true,
            count: blocks.length,
            data: blocks
        });
    } catch (error) {
        console.error("Error fetching blocks:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch blocks",
            error: error.message
        });
    }
};

// Get a specific block
export const getBlockById = async (req, res) => {
    try {
        const { blockId } = req.params;
        const userId = req.user._id;

        const block = await Block.findById(blockId).populate({
            path: 'pageId',
            populate: {
                path: 'journalId'
            }
        });

        if (!block) {
            return res.status(404).json({
                success: false,
                message: "Block not found"
            });
        }

        // Verify ownership
        if (block.pageId.journalId.userId.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: "Access denied"
            });
        }

        return res.status(200).json({
            success: true,
            data: block
        });
    } catch (error) {
        console.error("Error fetching block:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch block",
            error: error.message
        });
    }
};

// Update a block
export const updateBlock = async (req, res) => {
    try {
        const { blockId } = req.params;
        const userId = req.user._id;
        const { position, text, styles, image } = req.body;

        const block = await Block.findById(blockId).populate({
            path: 'pageId',
            populate: {
                path: 'journalId'
            }
        });

        if (!block) {
            return res.status(404).json({
                success: false,
                message: "Block not found"
            });
        }

        // Verify ownership
        if (block.pageId.journalId.userId.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: "Access denied"
            });
        }

        // Update based on block type
        if (position) block.position = position;

        if (block.type === "text") {
            if (text !== undefined) block.text = text;
            if (styles) {
                block.styles = {
                    ...block.styles.toObject(),
                    ...styles
                };
            }
        } else if (block.type === "image") {
            if (image) block.image = { ...block.image.toObject(), ...image };
        }

        await block.save();

        return res.status(200).json({
            success: true,
            message: "Block updated successfully",
            data: block
        });
    } catch (error) {
        console.error("Error updating block:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to update block",
            error: error.message
        });
    }
};

// Update block styles (for text blocks)
export const updateBlockStyles = async (req, res) => {
    try {
        const { blockId } = req.params;
        const userId = req.user._id;
        const styles = req.body;

        const block = await Block.findById(blockId).populate({
            path: 'pageId',
            populate: {
                path: 'journalId'
            }
        });

        if (!block) {
            return res.status(404).json({
                success: false,
                message: "Block not found"
            });
        }

        // Verify ownership
        if (block.pageId.journalId.userId.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: "Access denied"
            });
        }

        if (block.type !== "text") {
            return res.status(400).json({
                success: false,
                message: "Can only update styles for text blocks"
            });
        }

        block.styles = {
            ...block.styles.toObject(),
            ...styles
        };

        await block.save();

        return res.status(200).json({
            success: true,
            message: "Block styles updated successfully",
            data: block
        });
    } catch (error) {
        console.error("Error updating block styles:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to update block styles",
            error: error.message
        });
    }
};

// Update block position
export const updateBlockPosition = async (req, res) => {
    try {
        const { blockId } = req.params;
        const userId = req.user._id;
        const { x, y } = req.body;

        const block = await Block.findById(blockId).populate({
            path: 'pageId',
            populate: {
                path: 'journalId'
            }
        });

        if (!block) {
            return res.status(404).json({
                success: false,
                message: "Block not found"
            });
        }

        // Verify ownership
        if (block.pageId.journalId.userId.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: "Access denied"
            });
        }

        if (x !== undefined) block.position.x = x;
        if (y !== undefined) block.position.y = y;

        await block.save();

        return res.status(200).json({
            success: true,
            message: "Block position updated successfully",
            data: block
        });
    } catch (error) {
        console.error("Error updating block position:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to update block position",
            error: error.message
        });
    }
};

// Delete a block
export const deleteBlock = async (req, res) => {
    try {
        const { blockId } = req.params;
        const userId = req.user._id;

        const block = await Block.findById(blockId).populate({
            path: 'pageId',
            populate: {
                path: 'journalId'
            }
        });

        if (!block) {
            return res.status(404).json({
                success: false,
                message: "Block not found"
            });
        }

        // Verify ownership
        if (block.pageId.journalId.userId.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: "Access denied"
            });
        }

        const pageId = block.pageId._id;
        const deletedOrder = block.order;

        // Delete the block
        await Block.deleteOne({ _id: blockId });

        // Update order for subsequent blocks
        await Block.updateMany(
            { pageId, order: { $gt: deletedOrder } },
            { $inc: { order: -1 } }
        );

        return res.status(200).json({
            success: true,
            message: "Block deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting block:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to delete block",
            error: error.message
        });
    }
};

// Reorder blocks
export const reorderBlocks = async (req, res) => {
    try {
        const { pageId } = req.params;
        const userId = req.user._id;
        const { blockOrder } = req.body; // Array of block IDs in desired order

        // Verify page exists and belongs to user
        const page = await Page.findById(pageId).populate('journalId');
        if (!page) {
            return res.status(404).json({
                success: false,
                message: "Page not found"
            });
        }

        if (page.journalId.userId.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: "Access denied"
            });
        }

        if (!Array.isArray(blockOrder)) {
            return res.status(400).json({
                success: false,
                message: "blockOrder must be an array"
            });
        }

        // Update order based on the new arrangement
        const updatePromises = blockOrder.map((blockId, index) =>
            Block.updateOne(
                { _id: blockId, pageId },
                { order: index }
            )
        );

        await Promise.all(updatePromises);

        return res.status(200).json({
            success: true,
            message: "Blocks reordered successfully"
        });
    } catch (error) {
        console.error("Error reordering blocks:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to reorder blocks",
            error: error.message
        });
    }
};

// Bulk update blocks (for efficient saving)
export const bulkUpdateBlocks = async (req, res) => {
    try {
        const { pageId } = req.params;
        const userId = req.user._id;
        const { blocks } = req.body; // Array of block updates

        // Verify page exists and belongs to user
        const page = await Page.findById(pageId).populate('journalId');
        if (!page) {
            return res.status(404).json({
                success: false,
                message: "Page not found"
            });
        }

        if (page.journalId.userId.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: "Access denied"
            });
        }

        if (!Array.isArray(blocks)) {
            return res.status(400).json({
                success: false,
                message: "blocks must be an array"
            });
        }

        // Update all blocks
        const updatePromises = blocks.map(blockUpdate => {
            const { _id, ...updateData } = blockUpdate;
            return Block.findByIdAndUpdate(_id, updateData, { new: true });
        });

        const updatedBlocks = await Promise.all(updatePromises);

        return res.status(200).json({
            success: true,
            message: "Blocks updated successfully",
            data: updatedBlocks
        });
    } catch (error) {
        console.error("Error bulk updating blocks:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to update blocks",
            error: error.message
        });
    }
};
