import { Link } from "react-router-dom";
import OwnerMessageToday from "../components/OwnerMessageToday";
import SeatTimelineToday from "../components/SeatTimelineToday";
import TimeClockForm from "../components/TimeClockForm";
import ReservationCustomerMemosToday from "../components/ReservationCustomerMemosToday";

function HomePage() {

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Home</h1>

            {/* 横並び配置 */}
            <div className="flex gap-6">
                <section className="w-1/2">
                    <h2 className="text-lg font-semibold mb-2">本日のオーナーメッセージ</h2>
                    <OwnerMessageToday />
                </section>

                <section className="w-1/2">
                    <h2 className="text-lg font-semibold mb-2">本日の予約状況</h2>
                    <SeatTimelineToday />
                </section>
            </div>

            <div className="flex gap-6">
                {/* 勤怠フォーム */}
                <section className="w-1/2 mt-6">
                    <h2 className="text-lg font-semibold mb-2">勤怠打刻</h2>
                    <TimeClockForm />
                </section>
                {/* 顧客メモ表示 */}
                <section className="mt-6">
                    <h2 className="text-lg font-semibold mb-2">本日の顧客メモ</h2>
                    {/* <ReservationCustomerMemos date={today} /> */}
                    <ReservationCustomerMemosToday />

                </section>
            </div>
        </div>
    );
}

export default HomePage;
