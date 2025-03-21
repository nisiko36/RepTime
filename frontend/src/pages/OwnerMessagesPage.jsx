import OwnerMessageEditor from "../components/OwnerMessageEditor";

const OwnerMessagesPage = () => {
    return (
        <div className="p-4">
        <h1 className="text-xl font-bold">オーナーメッセージ管理</h1>
        <OwnerMessageEditor />
        </div>
    );
};

export default OwnerMessagesPage;
