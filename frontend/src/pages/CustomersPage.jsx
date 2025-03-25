import React, { useState } from "react";
import useCustomers from "../hooks/useCustomers";
import CustomerModal from "../components/CustomerModal";

const CustomersPage = () => {
    const {
        customers,
        loading,
        selectedCustomer,
        fetchCustomerById,
        updateCustomer,
    } = useCustomers();

    const [modalOpen, setModalOpen] = useState(false);
    const [selectedCustomerId, setSelectedCustomerId] = useState(null);


    const handleCustomerClick = async (customerId) => {
        await fetchCustomerById(customerId);
        setSelectedCustomerId(customerId);
        setModalOpen(true);
    };
    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedCustomerId(null);
    };

    return (
        <div className="w-full max-w-none p-4">
        <h1 className="text-xl font-bold">顧客一覧</h1>

        {loading ? (
            <p>読み込み中...</p>
        ) : (
            <ul className="mt-4 space-y-2">
            {customers.map((customer) => (
                <li
                    key={customer.id}
                    className="p-2 border rounded hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleCustomerClick(customer.id)}
                >
                {customer.name}（来店数: {customer.visit_count}）
                </li>
            ))}
            </ul>
        )}

        {modalOpen && selectedCustomer && selectedCustomerId && (
            <CustomerModal
                customer={selectedCustomer}
                onUpdate={updateCustomer}
                onClose={handleCloseModal}
            />
        )}
        </div>
    );
};

export default CustomersPage;
