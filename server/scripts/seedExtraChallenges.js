import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import ExtraChallenge from "../models/ExtraChallenge.js";
import connectDB from "../config/db.js";

const challenges = [
    // BATCH 1: First Steps (Challenges 1-5)
    {
        challengeId: "extra_001",
        title: "First Steps",
        description: "Create your first social post",
        points: 10,
        trackingType: "post_create",
        targetCount: 1,
        batch: 1,
        orderInBatch: 1
    },
    {
        challengeId: "extra_002",
        title: "Plant Explorer",
        description: "Identify your first plant using image recognition",
        points: 10,
        trackingType: "plant_identify",
        targetCount: 1,
        batch: 1,
        orderInBatch: 2
    },
    {
        challengeId: "extra_003",
        title: "Journal Beginner",
        description: "Create your first journal",
        points: 10,
        trackingType: "journal_create",
        targetCount: 1,
        batch: 1,
        orderInBatch: 3
    },
    {
        challengeId: "extra_004",
        title: "Supportive Gardener",
        description: "Give your first like on a post",
        points: 5,
        trackingType: "like_give",
        targetCount: 1,
        batch: 1,
        orderInBatch: 4
    },
    {
        challengeId: "extra_005",
        title: "Community Voice",
        description: "Write your first comment",
        points: 5,
        trackingType: "comment_create",
        targetCount: 1,
        batch: 1,
        orderInBatch: 5
    },

    // BATCH 2: Building Habits (Challenges 6-10)
    {
        challengeId: "extra_006",
        title: "Content Creator",
        description: "Post 5 social media posts",
        points: 25,
        trackingType: "post_create",
        targetCount: 5,
        batch: 2,
        orderInBatch: 1
    },
    {
        challengeId: "extra_007",
        title: "Plant Enthusiast",
        description: "Identify 3 different plants",
        points: 20,
        trackingType: "plant_identify",
        targetCount: 3,
        batch: 2,
        orderInBatch: 2
    },
    {
        challengeId: "extra_008",
        title: "Daily Journaler",
        description: "Create 3 journal entries",
        points: 20,
        trackingType: "journal_create",
        targetCount: 3,
        batch: 2,
        orderInBatch: 3
    },
    {
        challengeId: "extra_009",
        title: "Rising Star",
        description: "Receive 10 likes on your posts",
        points: 30,
        trackingType: "like_receive",
        targetCount: 10,
        batch: 2,
        orderInBatch: 4
    },
    {
        challengeId: "extra_010",
        title: "Active Commenter",
        description: "Comment on 5 different posts",
        points: 25,
        trackingType: "comment_create",
        targetCount: 5,
        batch: 2,
        orderInBatch: 5
    },

    // BATCH 3: Active Engagement (Challenges 11-15)
    {
        challengeId: "extra_011",
        title: "Social Butterfly",
        description: "Post 15 social media posts",
        points: 50,
        trackingType: "post_create",
        targetCount: 15,
        batch: 3,
        orderInBatch: 1
    },
    {
        challengeId: "extra_012",
        title: "Botanist",
        description: "Identify 10 different plants",
        points: 50,
        trackingType: "plant_identify",
        targetCount: 10,
        batch: 3,
        orderInBatch: 2
    },
    {
        challengeId: "extra_013",
        title: "Dedicated Writer",
        description: "Create 10 journal entries",
        points: 50,
        trackingType: "journal_create",
        targetCount: 10,
        batch: 3,
        orderInBatch: 3
    },
    {
        challengeId: "extra_014",
        title: "Popular Gardener",
        description: "Receive 50 total likes",
        points: 75,
        trackingType: "like_receive",
        targetCount: 50,
        batch: 3,
        orderInBatch: 4
    },
    {
        challengeId: "extra_015",
        title: "Challenge Starter",
        description: "Complete your first daily challenge",
        points: 40,
        trackingType: "daily_challenge_complete",
        targetCount: 1,
        batch: 3,
        orderInBatch: 5
    },

    // BATCH 4: Master Level (Challenges 16-20)
    {
        challengeId: "extra_016",
        title: "Influencer",
        description: "Post 30 social media posts",
        points: 100,
        trackingType: "post_create",
        targetCount: 30,
        batch: 4,
        orderInBatch: 1
    },
    {
        challengeId: "extra_017",
        title: "Master Botanist",
        description: "Identify 25 different plants",
        points: 100,
        trackingType: "plant_identify",
        targetCount: 25,
        batch: 4,
        orderInBatch: 2
    },
    {
        challengeId: "extra_018",
        title: "Community Favorite",
        description: "Receive 100 total likes",
        points: 150,
        trackingType: "like_receive",
        targetCount: 100,
        batch: 4,
        orderInBatch: 3
    },
    {
        challengeId: "extra_019",
        title: "Challenge Master",
        description: "Complete 5 daily challenges",
        points: 100,
        trackingType: "daily_challenge_complete",
        targetCount: 5,
        batch: 4,
        orderInBatch: 4
    },
    {
        challengeId: "extra_020",
        title: "Dedicated Member",
        description: "Login for 7 consecutive days",
        points: 120,
        trackingType: "consecutive_login",
        targetCount: 7,
        batch: 4,
        orderInBatch: 5
    }
];

const seedExtraChallenges = async () => {
    try {
        console.log("🌱 Connecting to database...");
        await connectDB();

        console.log("🗑️  Clearing existing extra challenges...");
        await ExtraChallenge.deleteMany({});

        console.log("📝 Seeding 20 extra challenges...");
        await ExtraChallenge.insertMany(challenges);

        console.log("✅ Successfully seeded 20 extra challenges!");
        console.log("\n📊 Challenge Summary:");
        console.log("   Batch 1 (First Steps): 5 challenges - 40 total points");
        console.log("   Batch 2 (Building Habits): 5 challenges - 120 total points");
        console.log("   Batch 3 (Active Engagement): 5 challenges - 265 total points");
        console.log("   Batch 4 (Master Level): 5 challenges - 570 total points");
        console.log("   Total: 20 challenges - 995 total points possible\n");

        process.exit(0);
    } catch (error) {
        console.error("❌ Error seeding challenges:", error);
        process.exit(1);
    }
};

seedExtraChallenges();
