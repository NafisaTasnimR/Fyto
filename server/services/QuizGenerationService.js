import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * Quiz Generation Service
 * Uses Gemini API for generating plant-related quizzes
 * 
 * To use:
 * 1. Add to .env file:
 *    - QUIZ_PROVIDER=your_gemini_key
 * 
 * 2. Install dependencies:
 *    npm install @google/generative-ai
 */

// Initialize Gemini AI client
let genAI = null;

const initializeClients = () => {
    if (process.env.QUIZ_PROVIDER) {
        genAI = new GoogleGenerativeAI(process.env.QUIZ_PROVIDER);
    }
};

// Generate quiz using Gemini
const generateQuizWithGemini = async (quizType, difficulty) => {
    try {
        if (!genAI) initializeClients();

        if (!genAI) {
            throw new Error('Gemini API key not configured. Add QUIZ_PROVIDER to .env file.');
        }

        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

        const prompt = createQuizPrompt(quizType, difficulty);

        const result = await model.generateContent(prompt);
        let text = result.response.text();

        // Clean the response
        text = text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();

        return JSON.parse(text);
    } catch (error) {
        console.error("Gemini Quiz Generation Error:", error.message);
        throw new Error(`Failed to generate quiz with Gemini: ${error.message}`);
    }
};

// Create quiz prompt based on type
const createQuizPrompt = (quizType, difficulty = 'medium') => {
    const difficultyDescriptions = {
        easy: 'beginner-friendly, common plants',
        medium: 'moderate difficulty, mix of common and uncommon plants',
        hard: 'challenging, rare plants and advanced botany'
    };

    if (quizType === 'image-quiz') {
        return `
Generate a plant identification quiz question (${difficultyDescriptions[difficulty]}).

Return STRICT JSON format:
{
  "quizId": "unique-id-YYYYMMDD-001",
  "type": "image-quiz",
  "difficulty": "${difficulty}",
  "question": "Identify this plant:",
  "plantName": "Scientific name (Common name)",
  "imageUrl": "https://example.com/plant-image.jpg",
  "options": [
    "Correct plant name",
    "Wrong option 1",
    "Wrong option 2",
    "Wrong option 3"
  ],
  "correctAnswer": "Correct plant name",
  "explanation": "Brief educational fact about this plant",
  "hint": "Helpful hint for identification",
  "funFact": "Interesting fact about the plant"
}

Requirements:
- Use real plant scientific names
- Provide plausible image URL (use placeholder services like Unsplash or plant image APIs)
- Make sure options are similar enough to be challenging
- Shuffle options (correct answer can be at any position)
- Keep question educational and engaging

ONLY return valid JSON, no explanations.
`;
    } else if (quizType === 'riddle-quiz') {
        return `
Generate a plant-themed riddle quiz question (${difficultyDescriptions[difficulty]}).

Return STRICT JSON format:
{
  "quizId": "unique-id-YYYYMMDD-002",
  "type": "riddle-quiz",
  "difficulty": "${difficulty}",
  "riddle": "Creative riddle about a plant",
  "options": [
    "Correct plant answer",
    "Wrong option 1",
    "Wrong option 2",
    "Wrong option 3"
  ],
  "correctAnswer": "Correct plant answer",
  "explanation": "Why this is the answer",
  "hint": "Helpful clue",
  "category": "plant-feature|plant-use|plant-habitat|plant-lifecycle"
}

Requirements:
- Create engaging, creative riddles
- Use metaphors and descriptive language
- Make options plausible
- Include educational value
- Can be about: plant features, uses, habitats, growth patterns, etc.

Example riddle style:
"I wear a crown of golden petals, following the sun's path across the sky. My seeds feed birds and humans alike. What am I?"

ONLY return valid JSON, no explanations.
`;
    }

    throw new Error('Invalid quiz type. Use "image-quiz" or "riddle-quiz"');
};

// Main function to generate daily quiz
export const generateDailyQuiz = async (quizType = 'image-quiz', difficulty = 'medium') => {
    try {
        console.log(`🎯 Generating ${quizType} with Gemini...`);

        // Validate inputs
        if (!['image-quiz', 'riddle-quiz'].includes(quizType)) {
            throw new Error('Invalid quiz type. Use "image-quiz" or "riddle-quiz"');
        }

        if (!['easy', 'medium', 'hard'].includes(difficulty)) {
            difficulty = 'medium';
        }

        // Generate quiz using Gemini
        const quiz = await generateQuizWithGemini(quizType, difficulty);

        // Add metadata
        quiz.generatedAt = new Date().toISOString();
        quiz.provider = 'gemini';

        console.log(`✅ Quiz generated successfully: ${quiz.quizId}`);
        return quiz;
    } catch (error) {
        console.error("Quiz Generation Error:", error.message);

        // Return fallback quiz if API fails
        return getFallbackQuiz(quizType, difficulty);
    }
};

// Generate multiple quizzes at once
export const generateMultipleQuizzes = async (count = 5, quizTypes = ['image-quiz', 'riddle-quiz']) => {
    try {
        const quizzes = [];
        const difficulties = ['easy', 'medium', 'hard'];

        for (let i = 0; i < count; i++) {
            const quizType = quizTypes[i % quizTypes.length];
            const difficulty = difficulties[i % difficulties.length];

            const quiz = await generateDailyQuiz(quizType, difficulty);
            quizzes.push(quiz);

            // Add delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        return quizzes;
    } catch (error) {
        console.error("Multiple Quiz Generation Error:", error.message);
        throw error;
    }
};

// Fallback quiz if API fails
const getFallbackQuiz = (quizType, difficulty) => {
    const fallbackQuizzes = {
        'image-quiz': {
            quizId: `fallback-${Date.now()}-image`,
            type: 'image-quiz',
            difficulty: difficulty,
            question: "Identify this plant:",
            plantName: "Monstera deliciosa (Swiss Cheese Plant)",
            imageUrl: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=800",
            options: [
                "Monstera deliciosa",
                "Philodendron bipinnatifidum",
                "Epipremnum aureum",
                "Scindapsus pictus"
            ],
            correctAnswer: "Monstera deliciosa",
            explanation: "Monstera deliciosa is known for its large, glossy leaves with distinctive holes and splits.",
            hint: "This plant's leaves develop holes as it matures, giving it a 'Swiss cheese' appearance.",
            funFact: "The holes in Monstera leaves are called fenestrations and help the plant withstand strong winds in its natural habitat.",
            generatedAt: new Date().toISOString(),
            provider: 'fallback'
        },
        'riddle-quiz': {
            quizId: `fallback-${Date.now()}-riddle`,
            type: 'riddle-quiz',
            difficulty: difficulty,
            riddle: "I have a golden crown and follow the sun from dawn to dusk. My seeds feed both birds and humans. My oil is used in cooking. What am I?",
            options: [
                "Sunflower",
                "Marigold",
                "Dandelion",
                "Calendula"
            ],
            correctAnswer: "Sunflower",
            explanation: "Sunflowers are heliotropic when young, meaning they track the sun's movement. They produce edible seeds and oil.",
            hint: "This plant is famous for turning its face towards the sun.",
            category: "plant-feature",
            generatedAt: new Date().toISOString(),
            provider: 'fallback'
        }
    };

    return fallbackQuizzes[quizType] || fallbackQuizzes['image-quiz'];
};

// Validate quiz answer
export const validateQuizAnswer = (quiz, userAnswer) => {
    const isCorrect = quiz.correctAnswer.toLowerCase().trim() === userAnswer.toLowerCase().trim();

    return {
        isCorrect,
        correctAnswer: quiz.correctAnswer,
        explanation: quiz.explanation,
        funFact: quiz.funFact || null
    };
};
