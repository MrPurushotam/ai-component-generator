const { GoogleGenerativeAI } = require('@google/generative-ai');
const SYSTEM_PROMPT = require('./systemPrompt');

class GeminiService {
    constructor() {
        this.geminiAi = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        this.conversations = new Map();
    }
    /**
     * Retrieves the conversation history for a given user and chat.
     * Initializes an empty array if no history exists for the key.
     * @param {string} userId - The ID of the user.
     * @param {string} chatId - The ID of the specific chat session.
     * @returns {Array} The conversation history array.
     */
    getConversationHistory(userId, chatId) {
        const key = `${userId}_${chatId}`;
        if (!this.conversations.has(key)) {
            this.conversations.set(key, []);
        }
        return this.conversations.get(key);
    }
    /**
     * Saves a message to the conversation history.
     * Keeps only the last 10 messages to manage memory for this demo.
     * @param {string} userId - The ID of the user.
     * @param {string} chatId - The ID of the specific chat session.
     * @param {"user" | "model"} role - The role of the sender ("user" or "model").
     * @param {string | Object[]} content - The content of the message.
     */
    saveToHistory(userId, chatId, role, content) {
        const history = this.getConversationHistory(userId, chatId);
        history.push({ role, parts: [{ text: content }] });

        if (history.length > 10) {
            history.splice(0, history.length - 10);
        }
    }

    /**
     * Generates a response from Gemini AI.
     * @param {Object} options - Options for content generation.
     * @param {string} options.userId - The ID of the user.
     * @param {string} options.chatId - The ID of the specific chat session.
     * @param {string} options.prompt - The user's prompt.
     * @param {string | null} [options.imageData=null] - Base64 encoded image data.
     * @param {string} [options.imageMimeType="image/jpeg"] - MIME type of the image data.
     * @param {string} [options.model="gemini-2.5-flash"] - The Gemini model to use. Changed to 1.5-flash as 2.5 is not public.
     * @param {number} [options.temperature=0.4] - Controls randomness of the response.
     * @returns {Promise<string>} The AI-generated response text.
     * @throws {Error} If content generation fails.
     */
    async generateContent({ userId, chatId, prompt, imageData = null, imageMimeType = "image/jpeg", model = "gemini-2.5-flash", temperature = 0.4 }) {
        const history = this.getConversationHistory(userId, chatId);

        let parts = [{ text: prompt }];
        if (imageData) {
            parts.push({
                inlineData: {
                    data: imageData,
                    mimeType: imageMimeType,
                },
            });
        }
        history.push({ role: "user", parts });
        const modelInstance = this.geminiAi.getGenerativeModel({
            model,
            generationConfig: {
                temperature,
            },
            systemInstruction: SYSTEM_PROMPT.content,
        });
        const result = await modelInstance.generateContent({
            contents: history,
        });
        console.log(result);
        const aiResponse = result.response.text();
        this.saveToHistory(userId, chatId, "model", aiResponse);
        return aiResponse;
    }
}

module.exports = new GeminiService();
