import { Outlet, Link } from "react-router-dom";

const Layout = () => {
    return (
        <div className="flex flex-col h-screen">
            {/* ヘッダー */}
            <header className="bg-blue-600 text-white px-6 py-4 shadow">
                <h1 className="text-2xl font-semibold">RepTime</h1>
            </header>

            {/* ヘッダー下の全体レイアウト */}
            <div className="flex flex-1">
                {/* サイドバー */}
                <aside className="w-64 bg-gray-800 text-white p-6">
                    <h2 className="text-xl font-bold mb-6">メニュー</h2>
                    <nav className="flex flex-col space-y-4">
                        <Link to="/" className="hover:underline">ホーム</Link>
                        <Link to="/reservations" className="hover:underline">予約状況</Link>
                        <Link to="/users" className="hover:underline">従業員</Link>
                        <Link to="/time-clock" className="hover:underline">勤怠打刻</Link>
                        <Link to="/owner-messages" className="hover:underline">オーナー伝言板</Link>
                        <Link to="/shifts" className="hover:underline">シフト希望</Link>
                        <Link to="/login" className="hover:underline text-red-400">ログアウト</Link>
                    </nav>
                </aside>

                {/* メインコンテンツ */}
                <main className="flex-1 p-6 overflow-auto bg-brack">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout;
