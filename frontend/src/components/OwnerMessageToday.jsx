import useOwnerMessages from "../hooks/useOwnerMessages";

const OwnerMessageToday = () => {
    const { messages, loading } = useOwnerMessages();

    if (loading) return <p>Loading...</p>;

    // 今日の日付を "YYYY-MM-DD" 形式に整形
    const todayStr = new Date().toLocaleDateString("ja-JP", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    }).replace(/\//g, "-");

    // 今日の日付と一致するメッセージのみ抽出
    const todayMessages = messages.filter(
        (msg) => msg.posted_on === todayStr
    );

    if (todayMessages.length === 0) {
        return <p className="text-gray-500">本日のオーナーメッセージはありません。</p>;
    }

    return (
        <div className="p-4 border rounded bg-gray-800 shadow">
            {/* <h2 className="text-xl font-bold mb-2">本日のオーナーメッセージ</h2> */}
            <ul className="space-y-4">
                {todayMessages.map((message) => (
                    <li key={message.id} className="whitespace-pre-wrap text-white text-left">
                        {message.messages}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default OwnerMessageToday;
