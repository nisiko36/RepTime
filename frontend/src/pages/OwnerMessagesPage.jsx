import React from "react";
import useAuth from "../hooks/useAuth";
import OwnerMessageEditor from "../components/OwnerMessageEditor";
import OwnerMessageList from "../components/OwnerMessageList";

const OwnerMessagesPage = () => {
    const { user } = useAuth(); // ログインユーザーを取得

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">オーナーメッセージ</h1>

            {/* オーナーは編集可能、それ以外は閲覧のみ */}
            {user?.role === "owner" ? (
                <OwnerMessageEditor />
            ) : (
                <OwnerMessageList />
            )}
        </div>
    );
};

export default OwnerMessagesPage;
