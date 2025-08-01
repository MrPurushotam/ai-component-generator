"use client";
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import EditChat from './EditChat';
import ChatListItem from './ChatListItem';
import { BotMessageSquare, ImagePlus, Loader2, Plus, Send } from 'lucide-react';
import {
    fetchChats,
    fetchMessages,
    createChat,
    editChat,
    deleteChat,
    sendMessage,
    setCurrentChat
} from '../store/slices/chatSlice';
import { useDispatch, useSelector } from 'react-redux';
import ListIndividualMessage from './ListIndividualMessage';

const ChatUi = ({ chatIdFromUrl }) => {
    const router = useRouter();
    const dispatch = useDispatch();
    const textareaRef = useRef(null);
    const messagesEndRef = useRef(null);

    // Local UI state only
    const [message, setMessage] = useState('');
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const [showEditChat, setShowEditChat] = useState(false);
    const [editChatType, setEditChatType] = useState('new');
    const [chatToEdit, setChatToEdit] = useState(null);

    const chats = useSelector(state => state.chat.chats);
    const isLoading = useSelector(state => state.chat.isLoading);
    const isLoadingChats = useSelector(state => state.chat.isLoadingChats);
    const isLoadingMessages = useSelector(state => state.chat.isLoadingMessages);
    const error = useSelector(state => state.chat.error);
    const currentChat = useSelector(state => state.chat.currentChat);

    const selectedChatId = chatIdFromUrl || currentChat;
    const selectedChat = chats.find(chat => chat.id === selectedChatId);
    const messages = selectedChat?.messages ?? [];

    // Fetch chats on mount
    useEffect(() => {
        dispatch(fetchChats());
    }, [dispatch]);

    useEffect(() => {
        if (chatIdFromUrl) {
            dispatch(setCurrentChat(chatIdFromUrl));
        }
    }, [chatIdFromUrl, dispatch]);

    useEffect(() => {
        if (selectedChatId) {
            dispatch(fetchMessages(selectedChatId));
        }
    }, [selectedChatId, dispatch]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
        }
    }, [message]);


    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result); // reader.result is a base64 string (data URL)
                setImagePreview(URL.createObjectURL(file));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setImage(null);
        if (imagePreview) {
            URL.revokeObjectURL(imagePreview);
            setImagePreview(null);
        }
    };

    const handleSendMessage = async () => {
        if (!message.trim() || !selectedChatId) return;
        try {
            await dispatch(sendMessage({ chatId: selectedChatId, message, imageData: image })); // image is base64 string
            setMessage('');
        } catch (err) {
            // Optionally show error to user
        } finally {
            setImage(null);
            if (imagePreview) {
                URL.revokeObjectURL(imagePreview);
                setImagePreview(null);
            }
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleNewChat = () => {
        setEditChatType('new');
        setChatToEdit(null);
        setShowEditChat(true);
    };

    const handleEditChat = (chat) => {
        setEditChatType('edit');
        setChatToEdit(chat);
        setShowEditChat(true);
    };

    const handleSaveChat = async (title) => {
        if (editChatType === 'new') {
            const result = await dispatch(createChat(title));
            if (result.payload?.id) {
                dispatch(setCurrentChat(result.payload.id));
                router.push(`/chat/${result.payload.id}`);
            }
        } else if (editChatType === 'edit' && chatToEdit) {
            await dispatch(editChat({ id: chatToEdit.id, title }));
            router.push(`/chat/${chatToEdit.id}`);
        }
        setShowEditChat(false);
        setChatToEdit(null);
    };

    const updateChats = async (action, chatId) => {
        if (action === 'delete') {
            await dispatch(deleteChat(chatId));
            if (selectedChatId === chatId) {
                dispatch(setCurrentChat(null));
                router.push('/chat');
            }
        }
    };

    const handleChatSelection = (chatId) => {
        dispatch(setCurrentChat(chatId));
        router.push(`/chat/${chatId}`);
    };
    const sortedChats = [...chats].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return (
        <div className="flex flex-col md:flex-row h-screen overflow-hidden">
            <div className="w-full md:w-80 lg:w-96 bg-gray-800 text-white flex flex-col h-auto md:h-screen shrink-0 order-2 md:order-1">
                <div className="p-4 border-b border-gray-700">
                    <h2 className="text-xl font-bold italic tracking-wide text-green-100">Ai-Componet-Gen</h2>
                </div>
                <div className="flex-1 overflow-y-auto my-2 relative">
                    {isLoadingChats && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-70 z-10">
                            <div className="flex flex-col items-center">
                                <Loader2 className="animate-spin h-8 w-8 text-white mb-2" />
                                <span className="text-white text-sm">Loading chats...</span>
                            </div>
                        </div>
                    )}
                    {!isLoadingChats && sortedChats.map(chat => (
                        <ChatListItem
                            key={chat.id}
                            chat={chat}
                            updateChats={updateChats}
                            editChat={handleEditChat}
                            selectedChatId={selectedChatId}
                            onChatSelect={handleChatSelection}
                        />
                    ))}
                </div>
                <div className="p-4 border-t border-gray-700">
                    <button
                        onClick={handleNewChat}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md flex items-center justify-center gap-2"
                    >
                        <Plus className="h-5 w-5 mt-1" />
                        New Chat
                    </button>
                </div>
            </div>

            {/* Chat Area - flexible width that fills remaining space */}
            <div className="flex-1 flex flex-col bg-gray-50 w-full h-screen overflow-hidden order-1 md:order-2">
                <div className="border-b p-4 bg-white shadow-sm">
                    <h2 className="flex items-center justify-center text-center gap-2 text-lg font-semibold">
                        <BotMessageSquare className="h-5 w-5" />
                        {selectedChat ? selectedChat.title : "AI Component Generator"}
                    </h2>
                    <p className="text-sm text-gray-500 text-center">Describe your component and I'll generate it for you</p>
                </div>

                <div className="flex-1 p-4 overflow-y-auto space-y-4 relative">
                    {isLoadingMessages && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 bg-opacity-70 z-10">
                            <div className="flex flex-col items-center">
                                <Loader2 className="animate-spin h-8 w-8 text-blue-500 mb-2" />
                                <span className="text-blue-700 text-sm">Loading messages...</span>
                            </div>
                        </div>
                    )}
                    {!isLoadingMessages && messages.map((msg, idx) => (
                        <ListIndividualMessage
                            key={msg.id}
                            message={msg}
                            preview={idx >= messages.length - 6}
                        />
                    ))}
                    <div ref={messagesEndRef} />
                    {/* Loading indicator positioned at the bottom center */}
                    {isLoading && (
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                            <div className="bg-white px-6 py-3 rounded-full shadow-md">
                                <div className="flex items-center gap-3">
                                    <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                                    <span className="text-sm text-gray-700 font-medium">Generating component...</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="border-t p-4 bg-white shadow-md">
                    {/* Image preview and remove button */}
                    {imagePreview && (
                        <div className="mb-3 relative flex flex-col items-start">
                            <span className="text-xs text-gray-500 mb-1">Image Preview:</span>
                            <div className="relative inline-block">
                                <img
                                    src={imagePreview}
                                    alt="Upload preview"
                                    className="h-24 w-auto rounded-md border border-gray-300"
                                />
                                <button
                                    onClick={handleRemoveImage}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                    aria-label="Remove image"
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="flex gap-2">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            disabled={!selectedChatId || isLoading}
                            className="hidden"
                            id="image-upload"
                        />
                        <label htmlFor="image-upload" className={`flex items-center justify-center px-4 py-2 bg-gray-200 text-gray-700 rounded-md cursor-pointer hover:bg-gray-300 ${!selectedChatId ? 'opacity-50 cursor-not-allowed' : ''}`}>
                            <ImagePlus className='w-5 h-5' />
                        </label>
                        <div className="flex-1 relative">
                            <textarea
                                ref={textareaRef}
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Describe the component you want to generate..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none min-h-[40px] max-h-[120px] overflow-y-auto"
                                disabled={!selectedChatId || isLoading}
                                rows={1}
                                style={{ lineHeight: '1.5' }}
                            />
                        </div>
                        <button
                            onClick={handleSendMessage}
                            disabled={!selectedChatId || isLoading || (!message.trim() && !image)}
                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[48px]"
                        >
                            {isLoading ? <Loader2 className='w-5 h-5 animate-spin' /> : <Send className="w-5 h-5" />}
                        </button>
                    </div>
                    {!selectedChatId && (
                        <div className="mt-4 text-center text-sm text-gray-500">
                            Please <button className="text-blue-600 underline" onClick={handleNewChat}>create a new chat</button> to start generating components.
                        </div>
                    )}
                </div>
            </div>

            {showEditChat && (
                <EditChat
                    type={editChatType}
                    chat={chatToEdit}
                    onSave={handleSaveChat}
                    onCancel={() => {
                        setShowEditChat(false);
                        setChatToEdit(null);
                    }}
                />
            )}
        </div>
    );
};

export default ChatUi;