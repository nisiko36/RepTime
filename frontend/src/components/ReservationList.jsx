import React from "react";

// ★ 時間だけを切り出すフォーマッタ
const formatTime = (dateTime) => {
    if (!dateTime) return "-";
    return new Date(dateTime).toLocaleTimeString("ja-JP", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Asia/Tokyo",
    });
};

const ReservationList = ({ reservations, loading, deleteReservation, onEdit }) => {
    if (loading) return <p>Loading...</p>;

    // 昇順に並び替え（start_atの早い順）
    const sortedReservations = reservations
        .slice() // 元配列を破壊しないため、コピーしてから sort
        .sort((a, b) => new Date(a.start_at) - new Date(b.start_at));

    return (
        <div>
            {sortedReservations.map((reservation) => {
                // ★ 顧客オブジェクトを分けて扱う
                const customer = reservation.customer || {};

                // LINEの名前があれば優先的に表示
                const displayName = customer.line_display_name
                    ? customer.line_display_name
                    : customer.name || `ID: ${customer.id || "不明"}`;

                // 例: "3回来店" 表示（visit_countがnullの場合は0と表示）
                const visitCountText = `${customer.visit_count ?? 0}回来店`;

                // リピート or 新規
                const repeatOrNew = reservation.is_repeat ? "リピート" : "新規";

                // 予約 or 飛び込み
                const bookingType = reservation.is_walk_in ? "飛び込み" : "予約";

                // 人数
                const partySizeText = `${reservation.party_size || 1}名`;

                // 時間表示
                const startTime = formatTime(reservation.start_at);
                const endTime = formatTime(reservation.end_at);

                return (
                    <div
                        key={reservation.id}
                        className="border p-2 mb-2 flex justify-between items-start"
                    >
                        <div className="text-sm leading-relaxed">
                            {/* 顧客情報 */}
                            <p>
                                <strong>ID/名前: </strong>
                                {displayName} / {visitCountText}
                            </p>
                            {/* リピート or 新規 */}
                            <p>
                                <strong>顧客区分: </strong>
                                {repeatOrNew}
                            </p>
                            {/* 予約 or 飛び込み */}
                            <p>
                                <strong>来店方法: </strong>
                                {bookingType}
                            </p>
                            {/* 人数 */}
                            <p>
                                <strong>人数: </strong>
                                {partySizeText}
                            </p>
                            {/* 時間 */}
                            <p>
                                <strong>時間: </strong>
                                {startTime} - {endTime}
                            </p>
                            {/* 席番号 */}
                            {reservation.seat_numbers?.length > 0 && (
                                <p>
                                    <strong>席: </strong>
                                    {reservation.seat_numbers.join(", ")}
                                </p>
                            )}
                        </div>

                        <div className="flex gap-2 ml-4">
                            <button
                                className="bg-green-500 text-white px-2 py-1"
                                onClick={() => onEdit(reservation)}
                            >
                                編集
                            </button>
                            <button
                                className="bg-red-500 text-white px-2 py-1"
                                onClick={() => deleteReservation(reservation.id)}
                            >
                                削除
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default ReservationList;
