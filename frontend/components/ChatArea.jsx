"use client";
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sendMessage, fetchMessages } from '../store/slices/chatSlice';
import { BotMessageSquare, ImagePlus } from 'lucide-react';

const ChatArea = ({ chatId }) => {
    const dispatch = useDispatch();
    
    const [message, setMessage] = useState('');
    const [image, setImage] = useState(null);

    const { chats, isLoading } = useSelector(state => state.chat);
    const selectedChat = chats.find(chat => chat.id === chatId);
    const messages = selectedChat?.messages ?? [];

    useEffect(() => {
        if (chatId) {
            // We've improved the fetchMessages thunk to avoid unnecessary fetches
            dispatch(fetchMessages(chatId));
        }
    }, [chatId, dispatch]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSendMessage = async () => {
        if (!message.trim() || !chatId) return;
        await dispatch(sendMessage({ chatId, message, imageData: image }));
        setMessage('');
        setImage(null);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <div className="flex-1 flex flex-col bg-gray-50">
            <div className="border-b p-4 bg-white shadow-sm ">
                <h2 className="flex items-center justify-center text-center gap-2 text-lg font-semibold ">
                    <BotMessageSquare className="h-5 w-5" />
                    {selectedChat ? selectedChat.title : "AI Component Generator"}
                </h2>
                <p className="text-sm text-gray-500 text-center">Describe your component and I'll generate it for you</p>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {messages.map(msg => (
                    <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${msg.sender === 'user'
                            ? 'bg-blue-500 text-white' : 'bg-white text-gray-800 shadow-sm'}`}>
                            <p className="text-sm">{msg.text}</p>
                            <p className="text-xs mt-1">{msg.timestamp}</p>
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-white px-4 py-2 rounded-lg shadow-sm">
                            <div className="flex items-center gap-2">
                                <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                                <span className="text-sm text-gray-600">Generating component...</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="border-t p-4 bg-white shadow-md">
                <div className="flex gap-2">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        disabled={!chatId || isLoading}
                        className="hidden"
                        id="image-upload"
                    />
                    <label htmlFor="image-upload" className={`px-4 py-2 bg-gray-200 text-gray-700 rounded-md cursor-pointer hover:bg-gray-300 ${!chatId ? 'opacity-50 cursor-not-allowed' : ''}`}>
                        <ImagePlus className='w-5 h-5 mt-1' />
                    </label>
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Describe the component you want to generate..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={!chatId || isLoading}
                    />
                    <button
                        onClick={handleSendMessage}
                        disabled={!chatId || isLoading}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatArea;
