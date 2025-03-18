import { useEffect, useState } from "react";
import apiClient from "../api/apiClient";

const useCustomerMemos = (customerId) => {
    const [memos, setMemos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (customerId) {
            fetchCustomerMemos();
        }
    }, [customerId]);

    const fetchCustomerMemos = async () => {
        try {
            const response = await apiClient.get(`/customer_memos?customer_id=${customerId}`);
            setMemos(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching customer memos:", error);
            setLoading(false);
        }
    };

    const createCustomerMemo = async (memoData) => {
        console.log(["memoData",memoData])
        try {
            await apiClient.post("/customer_memos", {
                customer_memo: memoData
            });
            fetchCustomerMemos(); // 顧客メモ一覧をリフレッシュ
        } catch (error) {
            console.error("Error creating customer memo:", error);
        }
    };

    const updateCustomerMemo = async (id, memoData) => {
        try {
            await apiClient.put(`/customer_memos/${id}`, { customer_memo: memoData });
            fetchCustomerMemos();
        } catch (error) {
        console.error("Error updating customer memo:", error);
        }
    };

    const deleteCustomerMemo = async (id) => {
        try {
            await apiClient.delete(`/customer_memos/${id}`);
            fetchCustomerMemos();
        } catch (error) {
            console.error("Error deleting customer memo:", error);
        }
    };

    return { memos, loading, createCustomerMemo, updateCustomerMemo, deleteCustomerMemo };
};

export default useCustomerMemos;
