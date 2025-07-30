import React, { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import RenderMicroComponent from './RenderMicroComponent';

const ListIndividualMessage = ({ message, preview = true }) => {
    const [codeBlocks, setCodeBlocks] = useState({});
    const [showPreview, setShowPreview] = useState(preview); 
    const [timeAgo, setTimeAgo] = useState('');
    const [mainContent, setMainContent] = useState('');
    const [filesCreated, setFilesCreated] = useState([]);

    useEffect(() => {
        setShowPreview(preview);
    }, [preview]);

    useEffect(() => {
        if (message.timestamp) {
            setTimeAgo(formatTimestamp(message.timestamp));
        }

        if (message.role === 'assistant' && message.content) {
            const jsxMatch = message.content.match(/### JSX\s+([\s\S]*?)(?=###)/);
            const cssMatch = message.content.match(/### CSS\s+([\s\S]*?)(?=###)/);
            const filesMatch = message.content.match(/### Files Created\s+([\s\S]*?)(?=###|$)/);

            const extractedBlocks = {};

            if (jsxMatch && jsxMatch[1]) {
                const jsxCodeMatch = jsxMatch[1].match(/```jsx\s+([\s\S]*?)```/);
                if (jsxCodeMatch && jsxCodeMatch[1]) {
                    extractedBlocks.jsx = jsxCodeMatch[1].trim();
                }
            }

            if (cssMatch && cssMatch[1]) {
                const cssCodeMatch = cssMatch[1].match(/```css\s+([\s\S]*?)```/);
                if (cssCodeMatch && cssCodeMatch[1]) {
                    extractedBlocks.css = cssCodeMatch[1].trim();
                }
            }
            const filesList = [];
            if (filesMatch && filesMatch[1]) {
                const filesContent = filesMatch[1].trim();
                const filesBlockMatch = filesContent.match(/```\s+([\s\S]*?)```/);
                if (filesBlockMatch && filesBlockMatch[1]) {
                    filesList.push(...filesBlockMatch[1].trim().split('\n').filter(line => line.trim()));
                }
            }

            setFilesCreated(filesList);
            setCodeBlocks(extractedBlocks);

            let remaining = message.content.split('### JSX')[0].trim();
            if (!remaining) {
                const afterFilesCreated = message.content.split(/### Files Created\s+([\s\S]*?)(?=###|$)/)[2];
                if (afterFilesCreated) {
                    remaining = afterFilesCreated.trim();
                }
            }

            setMainContent(remaining);
        } else if (message.role === 'user') {
            setMainContent(message.content);
        }
    }, [message]);

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

    const hasCodeBlocks = Object.keys(codeBlocks).length > 0;

    return (
        <div className={`my-4 flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`rounded-lg p-4 max-w-[90%] md:max-w-[60%] shadow-md 
        ${message.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'}`}
            >
                {mainContent && (
                    <div className="prose prose-sm max-w-none overflow-auto">
                        <ReactMarkdown>{mainContent}</ReactMarkdown>
                    </div>
                )}

                {/* Render image if imageData exists and is not empty */}
                {message.imageData && (
                    <div className="mt-3 flex justify-center bg-gray-100 rounded-md">
                        <img
                            src={message.imageData}
                            alt="User upload"
                            className="max-h-40 rounded-md border border-gray-300"
                        />
                    </div>
                )}

                {message.role === 'assistant' && hasCodeBlocks && (
                    <div className={`${mainContent ? 'mt-4 pt-4' : ''}`}>
                        <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">Generated Component</h4>
                            <button
                                onClick={() => setShowPreview(!showPreview)}
                                className="flex items-center gap-1 text-sm px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded-md"
                            >
                                {showPreview ? (
                                    <><EyeOff className="h-4 w-4" /> Hide Preview</>
                                ) : (
                                    <><Eye className="h-4 w-4" /> Preview</>
                                )}
                            </button>
                        </div>

                        {showPreview && (
                            <RenderMicroComponent
                                generatedCode={codeBlocks.jsx || ''}
                                generatedCSS={codeBlocks.css || ''}
                            />
                        )}

                        {filesCreated.length > 0 && (
                            <div className="mt-4 bg-gray-900 text-white p-3 rounded-md">
                                <h5 className="text-sm font-mono mb-2">Files Created</h5>
                                <ul className="list-disc pl-5 text-sm">
                                    {filesCreated.map((file, index) => (
                                        <li key={index}>{file}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}

                <div className={`text-xs mt-2 ${message.role === 'user' ? 'text-blue-200' : 'text-gray-500'}`}>
                    {timeAgo}
                </div>
            </div>
        </div>
    );
};

export default ListIndividualMessage;