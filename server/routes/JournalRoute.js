import express from "express";
import {
    createJournal,
    createJournalWithFirstPage,
    getUserJournals,
    getJournalById,
    updateJournal,
    deleteJournal,
    updateWordCount
} from "../controllers/JournalController.js";
import {
    createPage,
    getJournalPages,
    getPageById,
    updatePage,
    deletePage,
    reorderPages
} from "../controllers/PageController.js";
import {
    createBlock,
    getPageBlocks,
    getBlockById,
    updateBlock,
    updateBlockStyles,
    updateBlockPosition,
    deleteBlock,
    reorderBlocks,
    bulkUpdateBlocks
} from "../controllers/BlockController.js";
import verifyToken from "../middlewares/Authorization.js";
import {
    validateCreateJournal,
    validateUpdateJournal,
    validateJournalId,
    validateCreatePage,
    validateUpdatePage,
    validatePageId,
    validateCreateBlock,
    validateUpdateBlock,
    validateBlockId,
    validateReorderPages,
    validateReorderBlocks,
    validateBulkUpdateBlocks
} from "../middlewares/JournalValidation.js";

const router = express.Router();


router.use(verifyToken);



router.post("/with-first-page", validateCreateJournal, createJournalWithFirstPage);

router.post("/", validateCreateJournal, createJournal);

router.get("/", getUserJournals);

router.get("/:journalId", validateJournalId, getJournalById);

router.put("/:journalId", validateUpdateJournal, updateJournal);

router.delete("/:journalId", validateJournalId, deleteJournal);

router.post("/:journalId/word-count", validateJournalId, updateWordCount);



router.post("/:journalId/pages", validateCreatePage, createPage);

router.get("/:journalId/pages", validateJournalId, getJournalPages);

router.put("/:journalId/pages/reorder", validateReorderPages, reorderPages);

router.get("/pages/:pageId", validatePageId, getPageById);

router.put("/pages/:pageId", validateUpdatePage, updatePage);

router.delete("/pages/:pageId", validatePageId, deletePage);



router.post("/pages/:pageId/blocks", validateCreateBlock, createBlock);

router.get("/pages/:pageId/blocks", validatePageId, getPageBlocks);

router.put("/pages/:pageId/blocks/bulk", validateBulkUpdateBlocks, bulkUpdateBlocks);

router.put("/pages/:pageId/blocks/reorder", validateReorderBlocks, reorderBlocks);

router.get("/blocks/:blockId", validateBlockId, getBlockById);

router.put("/blocks/:blockId", validateUpdateBlock, updateBlock);

router.patch("/blocks/:blockId/styles", validateBlockId, updateBlockStyles);

router.patch("/blocks/:blockId/position", validateBlockId, updateBlockPosition);

router.delete("/blocks/:blockId", validateBlockId, deleteBlock);

export default router;
