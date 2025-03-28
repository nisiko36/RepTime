import TimeClockForm from "../components/TimeClockForm";
import AttendanceMemoForm from "../components/AttendanceMemoForm"
import AttendanceHistory from "../components/AttendanceHistory";
import useAuth from "../hooks/useAuth";

function TimeClockPage() {
    const { user } = useAuth();

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-6">勤怠管理</h1>
            {/* 打刻フォーム */}
            <TimeClockForm />
            {/* 勤怠メモ */}
            <AttendanceMemoForm user={user} />
            {/* 勤怠履歴一覧 */}
            <AttendanceHistory />
        </div>
    );
}

export default TimeClockPage;
