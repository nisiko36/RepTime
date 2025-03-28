import React from "react";
import useAuth from "../hooks/useAuth";
import OwnerMessageEditor from "../components/OwnerMessageEditor";
import OwnerMessageList from "../components/OwnerMessageList";
import AttendanceMemoList from "../components/AttendanceMemoList"; // 追加

const OwnerMessagesPage = () => {
    const { user } = useAuth(); // ログインユーザーを取得

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">オーナーメッセージと勤怠メモ</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* オーナーメッセージ */}
                <div className="border rounded p-4 shadow">
                    {user?.role === "owner" ? (
                        <OwnerMessageEditor />
                    ) : (
                        <OwnerMessageList />
                    )}
                </div>

                {/* 右：勤怠メモ */}
                <div className="border rounded p-4 shadow">
                    <AttendanceMemoList />
                </div>
            </div>
        </div>
    );
};

export default OwnerMessagesPage;
