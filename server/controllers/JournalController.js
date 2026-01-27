import Journal from "../models/Journal.js";
import Page from "../models/Page.js";
import Block from "../models/Block.js";
import mongoose from "mongoose";


export const createJournal = async (req, res) => {
    try {
        const { title, coverImage } = req.body;
        const userId = req.user._id;

        if (!title || !coverImage || !coverImage.url) {
            return res.status(400).json({
                success: false,
                message: "Title and cover image are required"
            });
        }

        const journal = new Journal({
            userId,
            title,
            coverImage: {
                url: coverImage.url,
                width: coverImage.width || 800,
                height: coverImage.height || 600
            }
        });

        await journal.save();

        return res.status(201).json({
            success: true,
            message: "Journal created successfully",
            data: journal
        });
    } catch (error) {
        console.error("Error creating journal:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to create journal",
            error: error.message
        });
    }
};


export const createJournalWithFirstPage = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { title, coverImage, firstPage } = req.body;
        const userId = req.user._id;

        
        const journal = new Journal({
            userId,
            title,
            coverImage
        });
        const savedJournal = await journal.save({ session });

        const page = new Page({
            journalId: savedJournal._id,
            pageNumber: 1,
            backgroundColor: firstPage.backgroundColor,
            pageSize: firstPage.pageSize
        });
        const savedPage = await page.save({ session });

        
        if (firstPage.content && firstPage.content.trim()) {
            const textBlock = new Block({
                pageId: savedPage._id,
                type: 'text',
                text: firstPage.content,
                position: { x: 0, y: 0 },
                styles: firstPage.styles
            });
            await textBlock.save({ session });
        }

        if (firstPage.elements && firstPage.elements.length > 0) {
            const imageBlocks = firstPage.elements.map(element => ({
                pageId: savedPage._id,
                type: 'image',
                position: { x: element.x, y: element.y },
                image: {
                    url: element.imageUrl,
                    width: element.width,
                    height: element.height
                }
            }));
            await Block.insertMany(imageBlocks, { session });
        }

        await session.commitTransaction();

        return res.status(201).json({
            success: true,
            message: "Journal and first page created successfully",
            data: {
                journal: savedJournal,
                page: savedPage
            }
        });

    } catch (error) {
        await session.abortTransaction();
        console.error("Error creating journal with first page:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to create journal",
            error: error.message
        });
    } finally {
        session.endSession();
    }
};


export const getUserJournals = async (req, res) => {
    try {
        const userId = req.user._id;

        const journals = await Journal.find({ userId })
            .sort({ createdAt: -1 })
            .lean();

        return res.status(200).json({
            success: true,
            count: journals.length,
            data: journals
        });
    } catch (error) {
        console.error("Error fetching journals:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch journals",
            error: error.message
        });
    }
};


export const getJournalById = async (req, res) => {
    try {
        const { journalId } = req.params;
        const userId = req.user._id;

        const journal = await Journal.findOne({
            _id: journalId,
            userId
        });

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
            data: {
                ...journal.toObject(),
                pages
            }
        });
    } catch (error) {
        console.error("Error fetching journal:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch journal",
            error: error.message
        });
    }
};

export const updateJournal = async (req, res) => {
    try {
        const { journalId } = req.params;
        const userId = req.user._id;
        const { title, coverImage, isPublic } = req.body;

        const journal = await Journal.findOne({
            _id: journalId,
            userId
        });

        if (!journal) {
            return res.status(404).json({
                success: false,
                message: "Journal not found"
            });
        }

        if (title) journal.title = title;
        if (coverImage) journal.coverImage = coverImage;
        if (typeof isPublic === 'boolean') journal.isPublic = isPublic;

        await journal.save();

        return res.status(200).json({
            success: true,
            message: "Journal updated successfully",
            data: journal
        });
    } catch (error) {
        console.error("Error updating journal:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to update journal",
            error: error.message
        });
    }
};


export const deleteJournal = async (req, res) => {
    try {
        const { journalId } = req.params;
        const userId = req.user._id;

        const journal = await Journal.findOne({
            _id: journalId,
            userId
        });

        if (!journal) {
            return res.status(404).json({
                success: false,
                message: "Journal not found"
            });
        }

        
        const pages = await Page.find({ journalId });
        const pageIds = pages.map(page => page._id);

       
        await Block.deleteMany({ pageId: { $in: pageIds } });

        
        await Page.deleteMany({ journalId });

        
        await Journal.deleteOne({ _id: journalId });

        return res.status(200).json({
            success: true,
            message: "Journal and all associated data deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting journal:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to delete journal",
            error: error.message
        });
    }
};


export const updateWordCount = async (req, res) => {
    try {
        const { journalId } = req.params;
        const userId = req.user._id;

        const journal = await Journal.findOne({
            _id: journalId,
            userId
        });

        if (!journal) {
            return res.status(404).json({
                success: false,
                message: "Journal not found"
            });
        }

       
        const pages = await Page.find({ journalId });
        const pageIds = pages.map(page => page._id);

      
        const blocks = await Block.find({
            pageId: { $in: pageIds },
            type: "text"
        });

       
        const totalWordCount = blocks.reduce((count, block) => {
            if (block.text) {
                const words = block.text.trim().split(/\s+/).filter(word => word.length > 0);
                return count + words.length;
            }
            return count;
        }, 0);

        journal.totalWordCount = totalWordCount;
        await journal.save();

        return res.status(200).json({
            success: true,
            message: "Word count updated successfully",
            data: {
                totalWordCount
            }
        });
    } catch (error) {
        console.error("Error updating word count:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to update word count",
            error: error.message
        });
    }
};
