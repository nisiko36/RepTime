import useOwnerMessages from "../hooks/useOwnerMessages";

const OwnerMessageList = () => {
    const { messages, loading } = useOwnerMessages();

    if (loading) return <p>Loading...</p>;

    return (
        <ul className="mt-4">
        {messages.map((message) => (
            <li key={message.id} className="p-2 border-b">
            {message.messages} - {message.pinned ? "固定" : "通常"}
            </li>
        ))}
        </ul>
    );
};

export default OwnerMessageList;
