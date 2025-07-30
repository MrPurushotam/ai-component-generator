"use client"
import React, { useState, useEffect } from 'react'

const EditChat = ({ type, chat, onSave, onCancel }) => {
    const [title, setTitle] = useState('')

    useEffect(() => {
        if (type === 'edit' && chat) {
            setTitle(chat.title || '')
        } else {
            setTitle('')
        }
    }, [type, chat])

    const handleSubmit = (e) => {
        e.preventDefault()
        if (title.trim()) {
            onSave(title.trim())
        }
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Escape') {
            onCancel()
        }
    }

    const isNewForm = type === 'new'

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-w-md mx-4">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">
                    {isNewForm ? 'Create New Chat' : 'Edit Chat'}
                </h3>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="chatTitle" className="block text-sm font-medium text-gray-700 mb-2">
                            Chat Title
                        </label>
                        {type === 'edit' && chat && (
                            <p className="text-sm text-gray-500 mb-2">
                                Current: {chat.title}
                            </p>
                        )}
                        <input
                            id="chatTitle"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder={isNewForm ? "Enter chat title..." : "Enter new chat title..."}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            autoFocus={true}
                            required={true}
                        />
                    </div>
                    <div className="flex gap-3 justify-end">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={!title.trim()}
                            className={`px-4 py-2 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${isNewForm
                                ? 'bg-blue-500 hover:bg-blue-600'
                                : 'bg-green-500 hover:bg-green-600'
                                }`}
                        >
                            {isNewForm ? 'Create Chat' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default EditChat
