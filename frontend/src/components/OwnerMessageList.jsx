import useOwnerMessages from "../hooks/useOwnerMessages";

const OwnerMessageList = () => {
    const { messages, loading } = useOwnerMessages();

    if (loading) return <p>Loading...</p>;

    // 投稿日の昇順で並べ替え
    const sortedMessages = messages
        .slice()
        .sort((a, b) => new Date(a.posted_on) - new Date(b.posted_on));

    return (
        <div className="mt-4">
            <h2 className="text-lg font-bold">オーナーメッセージ一覧</h2>
            <ul className="mt-2">
                {sortedMessages.map((message) => (
                    <li key={message.id} className="p-2 border-b">
                        <div>
                            <p className="font-medium">{message.messages}</p>
                            <p className="text-sm text-gray-500">
                                投稿日: {new Date(message.posted_on).toLocaleDateString("ja-JP")}
                            </p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default OwnerMessageList;
