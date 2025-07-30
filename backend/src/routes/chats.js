const authMiddleware = require("../middleware/auth.middleware");
const router = require("express").Router();
const prisma = require("../utils/prismaClient");
const geminiService = require("../utils/gemini");

router.use(authMiddleware);

// handles new chat creation
router.post("/create", async (req, res) => {
    const { title } = req.body;
    const userId = req.user?.userId;
    if (!userId) {
        return res.status(401).json({ message: "Unauthorized: User not found", success: false });
    }
    if (!title.trim()) {
        return res.status(401).json({ message: "Title is required.", success: false });
    }

    try {
        const session = await prisma.session.create({
            data: {
                userId,
                title,
            },
            select: {
                id: true,
                userId: true,
                title: true,
                createdAt: true,
            }
        })
        console.log(session)
        return res.status(200).json({ message: "Chat-id created.", success: true, session })

    } catch (error) {
        console.error("Error occurred while creating new chat:", error);
        return res.status(500).json({ message: "Internal server error.", success: false });
    }
})
// handle ai output generation 
router.post("/:chatId", async (req, res) => {
    try {
        const { prompt, imageData } = req.body;
        const chatId = req.params.chatId;
        const userId = req.user.userId;
        if (!prompt || typeof prompt !== "string") {
            return res.status(400).json({ message: "Prompt is required and must be a string.", success: false });
        }

        const session = await prisma.session.findUnique({
            where: { id: chatId },
            include: { user: true },
        });

        if (!session || session.userId !== userId) {
            return res.status(404).json({ message: "Session not found or unauthorized", success: false });
        }

        let geminiImageData = null;
        let geminiImageMimeType = "image/jpeg";
        if (imageData && typeof imageData === "string") {
            const match = imageData.match(/^data:(image\/\w+);base64,(.+)$/);
            if (match) {
                geminiImageMimeType = match[1];
                geminiImageData = match[2];
            }
        }
        const userMessage = await prisma.message.create({
            data: {
                sessionId: chatId,
                role: "user",
                content: prompt,
                imageData: imageData || ""
            }, select: {
                id: true,
                sessionId: true,
                role: true,
                content: true,
                imageData: true,
                timestamp: true
            }
        });
        let response;
        try {
            response = await geminiService.generateContent({
                userId,
                chatId,
                prompt,
                imageData: geminiImageData,
                imageMimeType: geminiImageMimeType
            });
        } catch (error) {
            console.error("Gemini generation error:", error);
            return res.status(500).json({ message: "Failed to generate AI response.", success: false });
        }
        console.log(response);
        const assistantMessage = await prisma.message.create({
            data: {
                sessionId: chatId,
                role: "assistant",
                content: response,
                imageData: ""
            }, select: {
                id: true,
                sessionId: true,
                role: true,
                content: true,
                imageData: true,
                timestamp: true
            }
        });
        return res.status(200).json({
            message: "AI response generated successfully",
            success: true,
            userMessage,
            aiResponse: assistantMessage
        });
    } catch (error) {
        console.log("Error creating chat ", error);
        res.status(500).json({ message: "Error occured while prompting", success: false })
    }
})
// edit detail of a chat 
router.put("/edit/:chatId", async (req, res) => {
    const { chatId } = req.params;
    const { title } = req.body;

    try {
        const updatedSession = await prisma.session.update({
            where: { id: chatId },
            data: {
                ...(title && { title }),
                updatedAt: new Date()
            },
            select: {
                id: true,
                userId: true,
                title: true,
                createdAt: true
            }
        });

        return res.status(200).json({ message: "Chat updated successfully", success: true, session: updatedSession });
    } catch (error) {
        console.error("Error occurred while editing chat:", error);
        return res.status(500).json({ message: "Error occurred while editing existing chat.", success: false });
    }
});
// delete a chat
router.delete("/:chatId", async (req, res) => {
    const { chatId } = req.params;
    const userId = req.user?.userId;
    if (!userId) {
        return res.status(401).json({ message: "Unauthorized", success: false });
    }

    console.log(chatId)
    try {
        const existingSession = await prisma.session.findFirst({
            where: {
                id: chatId,
                userId: userId
            }
        });

        if (!existingSession) {
            return res.status(404).json({
                message: "Chat not found or you don't have permission to delete it",
                success: false
            });
        }
        await prisma.session.delete({
            where: { id: chatId }
        });

        return res.status(200).json({ message: "Chat deleted successfully", success: true });
    } catch (error) {
        console.error("Error occurred while deleting chat:", error);
        return res.status(500).json({ message: "Error occurred while deleting chat.", success: false });
    }
});
// fetches all the messages from a chat
router.get("/history/:chatId", async (req, res) => {
    const { chatId } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
        return res.status(401).json({ message: "Unauthorized", success: false });
    }


    try {
        const session = await prisma.session.findFirst({
            where: {
                id: chatId,
                userId: userId
            }
        });

        if (!session) {
            return res.status(404).json({
                success: false,
                message: "Chat not found or you don't have permission to access it"
            });
        }

        const messages = await prisma.message.findMany({
            where: {
                sessionId: chatId,
            },
            orderBy: {
                timestamp: "asc",
            },
            select: {
                id: true,
                sessionId: true,
                role: true,
                content: true,
                imageData: true,
                timestamp: true,
            }
        });

        return res.status(200).json({
            success: true,
            chatId,
            messages,
        });
    } catch (error) {
        console.error("Error fetching chat history:", error);
        return res.status(500).json({
            success: false,
            message: "Error occurred while fetching chat history.",
        });
    }
});

// Fetches all the chats
router.get("/history", async (req, res) => {
    const userId = req.user?.userId;
    if (!userId) {
        return res.status(401).json({ message: "Unauthorized", success: false });
    }

    try {
        const sessions = await prisma.session.findMany({
            where: {
                userId: userId,
            },
            select: {
                id: true,
                title: true,
                createdAt: true,
                codeContent: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return res.status(200).json({ success: true, sessions });
    } catch (error) {
        console.error("Error occurred while fetching chat sessions:", error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
});

module.exports = router;