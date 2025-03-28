// 時刻部分だけを抽出（ISO形式 → "17:00"）
const extractTime = (isoString) => {
    if (!isoString) return "-";
    const timePart = isoString.split("T")[1];
    return timePart ? timePart.slice(0, 5) : "-";
};

// シフト一覧をフォーマット済みのテキストに整形
export const formatShiftsForMessage = (shifts = []) => {
    if (shifts.length === 0) {
        return "この日に出勤するスタッフは登録されていません。";
    }
    const header = "【本日の出勤者と担当ポジション】\n";

    const lines = shifts.map((shift) => {
        const name = shift.user?.name || `ID:${shift.user_id}`;
        const inTime = extractTime(shift.check_in);
        const outTime = extractTime(shift.check_out);

        // 今後 (ポジション情報) を shift.position 等から取得できるように括弧をキープ
        return `${name}(  )\t${inTime}-${outTime}`;
    });

    return header + lines.join("\n");
};
