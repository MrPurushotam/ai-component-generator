import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { EllipsisVertical } from "lucide-react";
import api from "../lib/api";

const ChatListItem = ({ chat, updateChats, editChat, selectedChatId, onChatSelect }) => {
    const [showMenu, setShowMenu] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isClicked, setIsClicked] = useState(false);
    const menuRef = useRef(null);
    const itemRef = useRef(null);
    const router = useRouter();
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowMenu(false);
            }
        };

        if (showMenu) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showMenu]);

    const handleEdit = () => {
        editChat(chat);
        setShowMenu(false);
    }

    const handleClick = () => {
        if (!chat.id) return;
        setIsClicked(true);
        // Reset clicked state after a short delay
        setTimeout(() => setIsClicked(false), 300);
        onChatSelect(chat.id);
        router.push(`/chat/${chat.id}`)
    }

    const handleDelete = async () => {
        setLoading(true);
        try {
            await updateChats('delete', chat.id);
        } finally {
            setLoading(false);
            setShowMenu(false);
        }
    }

    return (
        <div
            ref={itemRef}
            className={`group relative flex items-center justify-between px-4 py-2 cursor-pointer transition-colors duration-200 ${selectedChatId === chat.id
                    ? "bg-gray-700"
                    : isClicked
                        ? "bg-gray-600"
                        : "hover:bg-gray-700"
                }`}
            onClick={handleClick}
        >
            <span className="truncate">{chat.title}</span>
            <div
                ref={menuRef}
                className="relative"
                onClick={(e) => {
                    e.stopPropagation()
                    setShowMenu((prev) => !prev)
                }}
            >
                <EllipsisVertical className="w-4 h-4 opacity-70 group-hover:opacity-100" />
                {showMenu && (
                    <div className="absolute right-0 top-full mt-1 bg-white text-black rounded shadow-md z-10 w-32">
                        <button
                            onClick={handleEdit}
                            className="block w-full px-4 py-2 text-sm hover:bg-gray-100 text-left"
                            disabled={loading}
                        >
                            Edit
                        </button>
                        <button
                            onClick={handleDelete}
                            className="block w-full px-4 py-2 text-sm hover:bg-red-100 text-red-600 text-left"
                            disabled={loading}
                        >
                            {loading ? "Deleting..." : "Delete"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ChatListItem