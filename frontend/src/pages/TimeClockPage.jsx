import TimeClockForm from "../components/TimeClockForm";
import BookingWithMemoList from "../components/BookingWithMemoList";


function TimeClockPage() {
    return (
        <div>
            <div className="p-8">
                <h1 className="text-2xl font-bold mb-4">勤怠管理</h1>
                <TimeClockForm />
            </div>

            {/* <div className="p-8">
                <h1 className="text-2xl font-bold mb-4">予約メモ</h1>
                <BookingWithMemoList />
            </div> */}

        </div>
    );
}

export default TimeClockPage;
