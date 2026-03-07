import Journal from "../models/Journal.js";
import Page from "../models/Page.js";
import Block from "../models/Block.js";
import mongoose from "mongoose";
import { trackChallengeProgress } from '../services/ExtraChallengeService.js';


export const createJournal = async (req, res) => {
    try {
        const { title, coverImage, isPublic } = req.body;
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
            },
            isPublic: isPublic || false
        });

        await journal.save();

        // Track extra challenge progress
        await trackChallengeProgress(userId, 'journal_create');

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

        // Track extra challenge progress
        await trackChallengeProgress(userId, 'journal_create');

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
        const { targetUserId } = req.query;

        // Determine which user's journals to fetch
        const userIdToFetch = targetUserId || userId;

        // Build query based on whether viewing own journals or someone else's
        let query = { userId: userIdToFetch };

        // If viewing someone else's journals, only show public ones
        if (targetUserId && targetUserId !== userId.toString()) {
            query.isPublic = true;
        }

        const journals = await Journal.find(query)
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

        const journal = await Journal.findById(journalId);

        if (!journal) {
            return res.status(404).json({
                success: false,
                message: "Journal not found"
            });
        }

        // Check if user has permission to view this journal
        // Allow if: user is the owner OR the journal is public
        if (journal.userId.toString() !== userId.toString() && !journal.isPublic) {
            return res.status(403).json({
                success: false,
                message: "This journal is private."
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


// Get all public journals
export const getAllPublicJournals = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const skip = (Number(page) - 1) * Number(limit);

        const journals = await Journal.find({ isPublic: true })
            .populate('userId', 'name username profilePic')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit))
            .lean();

        const totalCount = await Journal.countDocuments({ isPublic: true });

        return res.status(200).json({
            success: true,
            count: journals.length,
            data: journals,
            pagination: {
                currentPage: Number(page),
                totalPages: Math.ceil(totalCount / Number(limit)),
                totalCount,
                limit: Number(limit)
            }
        });
    } catch (error) {
        console.error("Error fetching public journals:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch public journals",
            error: error.message
        });
    }
};


// Search public journals by title
export const searchPublicJournals = async (req, res) => {
    try {
        const { query } = req.query;

        if (!query || query.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'Search query is required.'
            });
        }

        const journals = await Journal.find({
            isPublic: true,
            title: { $regex: query, $options: 'i' }
        })
            .populate('userId', 'name username profilePic')
            .sort({ createdAt: -1 })
            .limit(50)
            .lean();

        return res.status(200).json({
            success: true,
            count: journals.length,
            data: journals
        });
    } catch (error) {
        console.error("Error searching public journals:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to search public journals",
            error: error.message
        });
    }
};
