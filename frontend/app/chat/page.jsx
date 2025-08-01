import ChatUi from '../../components/ChatUi';

const Chat = () => {
    return (
        <>
            <Head>
                <title>Chat | AI Component Generator</title>
                <meta name="description" content="Chat with the AI to generate and customize React components instantly." />
                <meta name="keywords" content="AI, React, Chat, Component Generator, Code, Web Development" />
                <meta property="og:title" content="Chat | AI Component Generator" />
                <meta property="og:description" content="Chat with the AI to generate and customize React components instantly." />
                <meta property="og:type" content="website" />
                <meta property="og:image" content="/og-image.png" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Chat | AI Component Generator" />
                <meta name="twitter:description" content="Chat with the AI to generate and customize React components instantly." />
                <meta name="twitter:image" content="/og-image.png" />
            </Head>

            <div className="h-screen">
                <ChatUi chatIdFromUrl={null} />
            </div>
        </>
    )
}

export default Chat;
