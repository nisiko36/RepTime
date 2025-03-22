import React, { useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";

const UserEditModal = ({ user, onSave, onClose }) => {
  const [editUser, setEditUser] = useState({ ...user });
  const { user: currentUser } = useAuth();

  useEffect(() => {
    setEditUser({ ...user });
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditUser({ ...editUser, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(editUser);
  };

  if (!currentUser || currentUser.role !== "owner") return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded shadow-lg w-96 relative">
        <button
          onClick={onClose}
          className="absolute right-2 top-2 text-gray-500 hover:text-gray-800"
        >
          ✕
        </button>

        <h2 className="text-xl font-bold mb-4">ユーザー情報の編集</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 編集可能な項目のみ表示 */}

          {/* 役割 */}
          <div>
            <label className="block text-sm font-medium">役割</label>
            <select
              name="role"
              value={editUser.role}
              onChange={handleChange}
              className="border p-2 w-full"
            >
              <option value="staff">staff</option>
              <option value="owner">owner</option>
            </select>
          </div>

          {/* ランク */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium">ホールランク</label>
              <select
                name="rank_hall"
                value={editUser.rank_hall || 1}
                onChange={handleChange}
                className="border p-2 w-full"
              >
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
              </select>
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium">キッチンランク</label>
              <select
                name="rank_kitchen"
                value={editUser.rank_kitchen || 1}
                onChange={handleChange}
                className="border p-2 w-full"
              >
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
              </select>
            </div>
          </div>

          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded w-full">
            保存
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserEditModal;
