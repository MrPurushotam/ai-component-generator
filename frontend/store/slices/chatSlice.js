import api from "../../lib/api";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchChats = createAsyncThunk("chat/fetchChats", async () => {
    const resp = await api.get("/chat/history");
    if (resp.data.success) {
        return resp.data.sessions.map(session => ({
            id: session.id,
            title: session.title,
            createdAt: session.createdAt,
            timpestamp: session.timestamp
        }));
    }
    throw new Error(resp.data.message || "Failed to fetch chats");
});

export const fetchMessages = createAsyncThunk("chat/fetchMessages", async (chatId) => {
    const resp = await api.get(`/chat/history/${chatId}`);
    if (resp.data.success) {
        return {
            chatId,
            messages: resp.data.messages.map(msg => ({
                id: msg.id,
                content: msg.content,
                imageData: msg.imageData,
                role: msg.role,
                timestamp: msg.timestamp,
            }))
        };
    }
    throw new Error(resp.data.message || "Failed to fetch messages");
});

export const createChat = createAsyncThunk("chat/createChat", async (title) => {
    const resp = await api.post('/chat/create', { title });
    if (resp.data.success) {
        return {
            id: resp.data.session.id,
            title,
            createdAt: resp.data.session.createdAt,
            userId: resp.data.session.userId
        };
    }
    throw new Error(resp.data.message || "Failed to create chat");
});

export const editChat = createAsyncThunk("chat/editChat", async ({ id, title }) => {
    const resp = await api.put(`/chat/edit/${id}`, { title });
    if (resp.data.success) {
        return { id, title };
    }
    throw new Error(resp.data.message || "Failed to edit chat");
});

export const deleteChat = createAsyncThunk("chat/deleteChat", async (id) => {
    const resp = await api.delete(`/chat/${id}`);
    if (resp.data.success) {
        return id;
    }
    throw new Error(resp.data.message || "Failed to delete chat");
});

export const sendMessage = createAsyncThunk("chat/sendMessage", async ({ chatId, message, imageData }) => {

    const resp = await api.post(`/chat/${chatId}`, { prompt: message, imageData });
    if (resp.data.success) {
        return {
            chatId,
            userMessage: resp.data.userMessage,
            aiResponse: resp.data.aiResponse
        };
    }
    throw new Error(resp.data.message || "Failed to send message");
});

// Initial state
const initialState = {
    chats: [],
    isLoading: false,
    isLoadingChats: false,
    isLoadingMessages: false,
    error: null,
    currentChat: null,
    isComponentRendered: false,
    currentComponent: null
};

const chatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {
        clearChatError: (state) => {
            state.error = null;
            state.isLoading = false;
        },
        setCurrentChat: (state, action) => {
            state.currentChat = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchChats.pending, (state) => {
                state.isLoadingChats = true;
                state.error = null;
            })
            .addCase(fetchChats.fulfilled, (state, action) => {
                state.isLoadingChats = false;
                state.chats = action.payload;
            })
            .addCase(fetchChats.rejected, (state, action) => {
                state.isLoadingChats = false;
                state.error = action.error.message;
            })
            .addCase(fetchMessages.pending, (state) => {
                state.isLoadingMessages = true;
                state.error = null;
            })
            .addCase(fetchMessages.fulfilled, (state, action) => {
                const { chatId, messages } = action.payload;
                state.chats = state.chats.map(chat =>
                    chat.id === chatId ? { ...chat, messages } : chat
                );
                state.isLoadingMessages = false;
            })
            .addCase(fetchMessages.rejected, (state, action) => {
                state.isLoadingMessages = false;
                state.error = action.error.message;
            })
            .addCase(createChat.fulfilled, (state, action) => {
                state.chats.unshift(action.payload);
                state.currentChat = action.payload.id;
            })
            .addCase(editChat.fulfilled, (state, action) => {
                state.chats = state.chats.map(chat =>
                    chat.id === action.payload.id ? { ...chat, title: action.payload.title } : chat
                );
            })
            .addCase(deleteChat.fulfilled, (state, action) => {
                state.chats = state.chats.filter(chat => chat.id !== action.payload);
                if (state.currentChat === action.payload) {
                    state.currentChat = null;
                }
            })
            .addCase(sendMessage.pending, (state, action) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(sendMessage.fulfilled, (state, action) => {
                const { chatId, userMessage, aiResponse } = action.payload;
                state.chats = state.chats.map(chat =>
                    chat.id === chatId
                        ? {
                            ...chat,
                            messages: [
                                ...(chat.messages || []),
                                userMessage,
                                aiResponse
                            ]
                        }
                        : chat
                )
                state.isLoading = false;
                state.error = null;
            })
            .addCase(sendMessage.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    }
});

export const { clearChatError, setCurrentChat } = chatSlice.actions;
export default chatSlice.reducer;