"use client"
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { fetchChats } from '../store/slices/chatSlice';

const HistoryPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { chats, isLoadingChats, error } = useSelector(state => state.chat);

  useEffect(() => {
    dispatch(fetchChats());
  }, [dispatch]);

  const handleChatClick = (chatId) => {
    router.push(`/chat/${chatId}`);
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.round(diffMs / 1000);
    const diffMin = Math.round(diffSec / 60);
    const diffHour = Math.round(diffMin / 60);
    const diffDay = Math.round(diffHour / 24);

    if (diffSec < 60) {
        return 'just now';
    } else if (diffMin < 60) {
        return `${diffMin} minute${diffMin !== 1 ? 's' : ''} ago`;
    } else if (diffHour < 24) {
        return `${diffHour} hour${diffHour !== 1 ? 's' : ''} ago`;
    } else if (diffDay < 30) {
        return `${diffDay} day${diffDay !== 1 ? 's' : ''} ago`;
    } else {
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
};

  return (
    <div className="flex justify-center p-7 min-h-screen bg-gray-50">
      <div className="w-2/3 bg-white rounded-lg shadow p-8">
        <h2 className="text-2xl font-semibold mb-6 text-center">Your Chat History</h2>
        {isLoadingChats ? (
          <div className="text-center text-gray-500">Loading chats...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : chats.length === 0 ? (
          <div className="text-center text-gray-500">No chats found.</div>
        ) : (
          <ul className="space-y-4">
            {chats.map(chat => (
              <li
                key={chat.id}
                className="cursor-pointer border rounded-lg p-4 hover:bg-gray-100 transition"
                onClick={() => handleChatClick(chat.id)}
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium text-lg">{chat.title}</span>
                  <span className="text-gray-500 text-sm">
                    {formatTimestamp(chat.timestamp || chat.createdAt)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;
