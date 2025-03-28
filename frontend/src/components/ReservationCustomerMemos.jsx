import React, { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import apiClient from "../api/apiClient";

function ReservationCustomerMemos({ date }) {
    const { user } = useAuth();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    // ISO文字列から "YYYY-MM-DD" を取得（例: 2025-03-28）
    const formattedDate = new Date(date).toISOString().slice(0, 10);

    useEffect(() => {
        if (!user) return;

        const fetchData = async () => {
            try {
                const res = await apiClient.get(`/reservations/by_date?date=${formattedDate}`);
                const reservations = res.data;

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
    }, [user, formattedDate]);

    if (loading) return <p>メモ読み込み中...</p>;

    return (
        <div className="p-4 border rounded shadow bg-gray-800 mt-4">
            <h2 className="text-xl font-bold mb-4">顧客メモ（{formattedDate}）</h2>
            {data.length === 0 ? (
                <p>この日の予約にメモはありません。</p>
            ) : (
                <ul className="space-y-4">
                    {data.map((reservation, idx) => (
                        <li key={idx} className="border-b pb-2">
                            <p className="font-semibold">
                                {new Date(reservation.reservationTime).toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" })} / {reservation.customerName}
                            </p>
                            {reservation.personalMemos.length > 0 && (
                                <div className="text-sm mt-1">
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

export default ReservationCustomerMemos;
