import { useState } from "react";
import useUsers from "../hooks/useUsers";

function UsersPage() {
    const { users, loading, createUser, updateUser, deleteUser } = useUsers();
    const [newUser, setNewUser] = useState({ name: "", email: "", role: "staff" });

    const handleCreate = () => {
        createUser(newUser);
        setNewUser({ name: "", email: "", role: "staff" });
    };

    return (
        <div className="p-4">
        <h1 className="text-xl font-bold">ユーザー一覧</h1>

        {loading ? <p>Loading...</p> : (
            <ul className="mt-4">
            {users.map((user) => (
                <li key={user.id} className="p-2 border-b flex justify-between">
                {user.name} - {user.email} ({user.role})
                <div>
                    <button className="bg-green-500 text-white px-2 py-1 mx-2" onClick={() => updateUser(user.id, { name: "更新済みユーザー" })}>更新</button>
                    <button className="bg-red-500 text-white px-2 py-1" onClick={() => deleteUser(user.id)}>削除</button>
                </div>
                </li>
            ))}
            </ul>
        )}

        <h2 className="text-lg font-bold mt-6">新規ユーザー</h2>
        <div className="mt-2 flex">
            <input
                type="text"
                placeholder="名前"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                className="border p-2 mx-2"
            />
            <input
                type="email"
                placeholder="メール"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                className="border p-2 mx-2"
            />
            <button className="bg-blue-500 text-white px-4 py-2" onClick={handleCreate}>作成</button>
        </div>
        </div>
    );
}

export default UsersPage;
