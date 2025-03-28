import React, { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import apiClient from "../api/apiClient";

// 日本時間の "YYYY-MM-DD" を返す関数
const getTodayDateString = () => {
    const today = new Date();
    return today.toLocaleDateString("ja-JP", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    }).replace(/\//g, "-");
};

function ReservationCustomerMemosToday() {
    const { user } = useAuth();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const today = getTodayDateString();

    useEffect(() => {
        if (!user) return;

        const fetchData = async () => {
            try {
                const res = await apiClient.get(`/reservations/by_date?date=${today}`);
                const reservations = res.data;

                // 各予約からメモを取得（並列で取得）
                const memoPromises = reservations.map(async (reservation) => {
                    if (!reservation.customer_id) return null;

                    const memoRes = await apiClient.get(`/customer_memos?customer_id=${reservation.customer_id}`);
                    const allMemos = memoRes.data;

                    const personalMemos = allMemos.filter(m => m.user_id === user.id);
                    const sharedMemos = allMemos.filter(m => m.is_shared);

                    return {
                        reservationTime: reservation.start_at,
                        customerName: reservation.customer?.name || `ID: ${reservation.customer_id}`,
                        personalMemos,
                        sharedMemos
                    };
                });

                const results = await Promise.all(memoPromises);
                // メモがない予約は除外
                const filtered = results.filter(
                    (r) => r && (r.personalMemos.length > 0 || r.sharedMemos.length > 0)
                );
                setData(filtered);

            } catch (error) {
                console.error("Error fetching customer memos:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user]);

    // const formatTime = (iso) => iso?.split("T")[1]?.slice(0, 5) || "-";

    if (loading) return <p>読み込み中...</p>;

    return (
        <div className="p-4 border rounded shadow bg-gray-800 mt-4">
            <h2 className="text-xl font-bold mb-4">本日の顧客メモ</h2>
            {data.length === 0 ? (
                <p>本日の予約にメモはありません。</p>
            ) : (
                <ul className="space-y-4">
                    {data.map((reservation, idx) => (
                        <li key={idx} className="border-b pb-2">
                            <p className="font-semibold">
                            {new Date(reservation.reservationTime).toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" })} / {reservation.customerName}
                            </p>
                            {reservation.personalMemos.length > 0 && (
                                <div className="text-sm text mt-1">
                                    <p className="font-medium">あなたのメモ:</p>
                                    <ul className="list-disc pl-4">
                                        {reservation.personalMemos.map((m, i) => (
                                            <li key={i}>{m.content}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            {reservation.sharedMemos.length > 0 && (
                                <div className="text-sm mt-1">
                                    <p className="font-medium">共有メモ:</p>
                                    <ul className="list-disc pl-4">
                                        {reservation.sharedMemos.map((m, i) => (
                                            <li key={i}>{m.content}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default ReservationCustomerMemosToday;
