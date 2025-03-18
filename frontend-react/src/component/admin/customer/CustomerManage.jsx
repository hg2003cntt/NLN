import React, { useState, useEffect } from "react";
import ApiService from "../../../service/apiService";
import { Table, Button, Modal, Input, Pagination, message } from "antd";

const CustomerManagement = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [newPhone, setNewPhone] = useState("");
    const [searchPhone, setSearchPhone] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        setLoading(true);
        try {
            const data = await ApiService.getAllConsultationRequests();
            setCustomers(data);
        } catch (error) {
            console.error("Lỗi lấy danh sách khách hàng:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async () => {
        if (!searchPhone.trim()) {
            fetchCustomers();
            return;
        }
        setLoading(true);
        try {
            const result = await ApiService.searchCustomerByPhone(searchPhone.trim());
            setCustomers(result);
            setCurrentPage(1);
        } catch (error) {
            message.error("Không tìm thấy khách hàng!");
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (customer) => {
        setSelectedCustomer(customer);
        setNewPhone(customer.phone);
    };

    const handleSave = async () => {
        if (!newPhone.trim()) {
            message.warning("Số điện thoại không được để trống!");
            return;
        }

        try {
            await ApiService.updateCustomerPhone(selectedCustomer.id, { phone: newPhone });
            message.success("Cập nhật số điện thoại thành công!");
            fetchCustomers();
            setSelectedCustomer(null);
        } catch (error) {
            message.error("Lỗi cập nhật số điện thoại!");
        }
    };

    const paginatedCustomers = customers.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    const columns = [
        {
            title: "STT",
            key: "stt",
            render: (text, record, index) => index + 1, // Tăng từ 1
        },
        { title: "Họ và Tên", dataIndex: "fullName", key: "fullName" },
        { title: "Số Điện Thoại", dataIndex: "phoneNumber", key: "phoneNumber"
        },
        { title: "Ngày Sinh", dataIndex: "dateOfBirth", key: "dateOfBirth" },
        {
            title: "Cập Nhật",
            key: "action",
            render: (_, record) => (
                <Button type="primary" onClick={() => handleEdit(record)}>
                    Chỉnh Sửa
                </Button>
            ),
        },
    ];

    return (
        <div>
            <h2>Danh Sách Khách Hàng Đăng Ký Tư Vấn</h2>

            <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
                <Input
                    placeholder="Nhập số điện thoại..."
                    value={searchPhone}
                    onChange={(e) => setSearchPhone(e.target.value)}
                />
                <Button type="primary" onClick={handleSearch}>
                    Tìm kiếm
                </Button>
            </div>

            <Table
                columns={columns}
                dataSource={paginatedCustomers}
                loading={loading}
                rowKey="id"
                pagination={false}
            />

            <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={customers.length}
                onChange={(page) => setCurrentPage(page)}
                showSizeChanger
                onShowSizeChange={(current, size) => setPageSize(size)}
                style={{ marginTop: 20, textAlign: "right" }}
            />

            <Modal
                title="Chỉnh sửa số điện thoại"
                open={!!selectedCustomer}
                onCancel={() => setSelectedCustomer(null)}
                onOk={handleSave}
            >
                <Input
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="Nhập số điện thoại mới"
                />
            </Modal>
        </div>
    );
};

export default CustomerManagement;
