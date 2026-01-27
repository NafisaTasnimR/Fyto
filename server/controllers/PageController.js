import Page from "../models/Page.js";
import Block from "../models/Block.js";
import Journal from "../models/Journal.js";


export const createPage = async (req, res) => {
    try {
        const { journalId } = req.params;
        const userId = req.user._id;
        const { backgroundColor, pageSize } = req.body;

        
        const journal = await Journal.findOne({ _id: journalId, userId });
        if (!journal) {
            return res.status(404).json({
                success: false,
                message: "Journal not found"
            });
        }

        
        const lastPage = await Page.findOne({ journalId })
            .sort({ pageNumber: -1 })
            .limit(1);

        const pageNumber = lastPage ? lastPage.pageNumber + 1 : 1;

        const page = new Page({
            journalId,
            pageNumber,
            backgroundColor: backgroundColor || "#FFFFFF",
            pageSize: pageSize || { width: 800, height: 1000 }
        });

        await page.save();

        return res.status(201).json({
            success: true,
            message: "Page created successfully",
            data: page
        });
    } catch (error) {
        console.error("Error creating page:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to create page",
            error: error.message
        });
    }
};


export const getJournalPages = async (req, res) => {
    try {
        const { journalId } = req.params;
        const userId = req.user._id;

        
        const journal = await Journal.findOne({ _id: journalId, userId });
        if (!journal) {
            return res.status(404).json({
                success: false,
                message: "Journal not found"
            });
        }

        const pages = await Page.find({ journalId })
            .sort({ pageNumber: 1 })
            .lean();

        return res.status(200).json({
            success: true,
            count: pages.length,
            data: pages
        });
    } catch (error) {
        console.error("Error fetching pages:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch pages",
            error: error.message
        });
    }
};


export const getPageById = async (req, res) => {
    try {
        const { pageId } = req.params;
        const userId = req.user._id;

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
            data: {
                ...page.toObject(),
                blocks
            }
        });
    } catch (error) {
        console.error("Error fetching page:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch page",
            error: error.message
        });
    }
};


export const updatePage = async (req, res) => {
    try {
        const { pageId } = req.params;
        const userId = req.user._id;
        const { backgroundColor, pageSize } = req.body;

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

        if (backgroundColor) page.backgroundColor = backgroundColor;
        if (pageSize) page.pageSize = pageSize;

        await page.save();

        return res.status(200).json({
            success: true,
            message: "Page updated successfully",
            data: page
        });
    } catch (error) {
        console.error("Error updating page:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to update page",
            error: error.message
        });
    }
};


export const deletePage = async (req, res) => {
    try {
        const { pageId } = req.params;
        const userId = req.user._id;

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

        const journalId = page.journalId._id;
        const deletedPageNumber = page.pageNumber;

        await Block.deleteMany({ pageId });

        await Page.deleteOne({ _id: pageId });

        await Page.updateMany(
            { journalId, pageNumber: { $gt: deletedPageNumber } },
            { $inc: { pageNumber: -1 } }
        );

        return res.status(200).json({
            success: true,
            message: "Page deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting page:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to delete page",
            error: error.message
        });
    }
};

export const reorderPages = async (req, res) => {
    try {
        const { journalId } = req.params;
        const userId = req.user._id;
        const { pageOrder } = req.body; 

        
        const journal = await Journal.findOne({ _id: journalId, userId });
        if (!journal) {
            return res.status(404).json({
                success: false,
                message: "Journal not found"
            });
        }

        if (!Array.isArray(pageOrder)) {
            return res.status(400).json({
                success: false,
                message: "pageOrder must be an array"
            });
        }

        
        const updatePromises = pageOrder.map((pageId, index) =>
            Page.updateOne(
                { _id: pageId, journalId },
                { pageNumber: index + 1 }
            )
        );

        await Promise.all(updatePromises);

        return res.status(200).json({
            success: true,
            message: "Pages reordered successfully"
        });
    } catch (error) {
        console.error("Error reordering pages:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to reorder pages",
            error: error.message
        });
    }
};
