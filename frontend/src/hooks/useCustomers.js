import { useEffect, useState } from "react";
import apiClient from "../api/apiClient";

const useCustomers = () => {
    const [customers, setCustomers] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState(null); 
    const [loading, setLoading] = useState(true);
    const [loadingDetail, setLoadingDetail] = useState(false);

    // 初回マウントで一覧を取得
    useEffect(() => {
        fetchCustomers();
    }, []);

    // 一覧取得
    const fetchCustomers = async () => {
        try {
            setLoading(true);
            const response = await apiClient.get("/customers");
            setCustomers(response.data);
        } catch (error) {
            console.error("Error fetching customers:", error);
        } finally {
            setLoading(false);
        }
    };

    // 単一顧客の詳細取得
    const fetchCustomerById = async (customerId) => {
        try {
            setLoadingDetail(true);
            const response = await apiClient.get(`/customers/${customerId}`);
            setSelectedCustomer(response.data);
        } catch (error) {
            console.error("Error fetching customer detail:", error);
        } finally {
            setLoadingDetail(false);
        }
    };

    // 顧客更新（例: 名前の更新など）
    const updateCustomer = async (customerId, updateData) => {
        try {
            await apiClient.put(`/customers/${customerId}`, { customer: updateData });
            await fetchCustomers(); // 一覧再取得
        if (selectedCustomer?.id === customerId) {
            await fetchCustomerById(customerId); // 詳細も更新
        }
        } catch (error) {
            console.error("Error updating customer:", error);
        }
    };

    return {
        customers,
        loading,
        selectedCustomer,
        loadingDetail,
        fetchCustomerById,
        updateCustomer
    };
};

export default useCustomers;
