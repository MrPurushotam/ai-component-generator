import ChatUi from '../../components/ChatUi';

export const metadata = {
    title: "Chat | AI Component Generator",
    description: "Chat with the AI to generate and customize React components instantly.",
    keywords: "AI, React, Chat, Component Generator, Code, Web Development",
    openGraph: {
        title: "Chat | AI Component Generator",
        description: "Chat with the AI to generate and customize React components instantly.",
        type: "website",
        images: ["/og-image.png"],
    },
    twitter: {
        card: "summary_large_image",
        title: "Chat | AI Component Generator",
        description: "Chat with the AI to generate and customize React components instantly.",
        images: ["/og-image.png"],
    },
};

const Chat = () => {
    return (
        <>
            <div className="h-screen">
                <ChatUi chatIdFromUrl={null} />
            </div>
        </>
    )
}

export default Chat;
