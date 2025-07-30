import ChatUi from '../../../components/ChatUi'

export default async function ChatDetailPage({ params }) {
    const id = await params.id;
    console.log(id);

    return <ChatUi chatIdFromUrl={id} />
}