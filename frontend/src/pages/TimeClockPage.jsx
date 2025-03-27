import TimeClockForm from "../components/TimeClockForm";
import AttendanceHistory from "../components/AttendanceHistory";

function TimeClockPage() {
    // 仮のログインユーザー情報（本番はContextやSessionから取得）

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-6">勤怠管理</h1>
            {/* 打刻フォーム */}
            <TimeClockForm />
            {/* 勤怠履歴一覧 */}
            <AttendanceHistory />
        </div>
    );
}

export default TimeClockPage;
