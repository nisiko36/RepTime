import { useState, useEffect } from "react";
import apiClient from "../api/apiClient";

const useAttendanceMemos = () => {
    const [memos, setMemos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMemos();
    }, []);

    const fetchMemos = async () => {
        try {
            const response = await apiClient.get("/attendance_memos");
            const sorted = response.data.sort(
                (a, b) => new Date(b.created_at) - new Date(a.created_at)
            );
            setMemos(sorted);
        } catch (error) {
            console.error("メモの取得に失敗:", error);
        } finally {
            setLoading(false);
        }
    };

    const deleteMemo = async (id) => {
        try {
            await apiClient.delete(`/attendance_memos/${id}`);
            fetchMemos(); // 削除後にリストを更新
        } catch (error) {
            console.error("削除に失敗しました:", error);
        }
    };

    return { memos, loading, deleteMemo };
};

export default useAttendanceMemos;
