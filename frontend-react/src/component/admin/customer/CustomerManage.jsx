import React, { useState, useEffect } from "react";
import ApiService from "../../../service/apiService";
import {
  Table,
  Button,
  Modal,
  Input,
  Pagination,
  message,
  Popconfirm,
  Tag,
} from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";

const CustomerManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    phone: "",
    email: "",
    dateOfBirth: "",
    password: "",
  });
  const [searchPhone, setSearchPhone] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await ApiService.getAllUsers();
      setUsers(data);
    } catch (error) {
      message.error("Lỗi lấy danh sách tài khoản!");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchPhone.trim()) {
      fetchUsers();
      return;
    }
    setLoading(true);
    try {
      const result = await ApiService.searchUserByPhone(searchPhone.trim());
      setUsers(result);
      setCurrentPage(1);
    } catch (error) {
      message.error("Không tìm thấy tài khoản!");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setFormData({
      username: user.username || "",
      name: user.name || "",
      phone: user.phone || "",
      email: user.email || "",
      dateOfBirth: user.dateOfBirth || "",
      password: "",
    });
  };

  const handleSave = async () => {
    if (!formData.phone.trim() || !formData.email.trim()) {
      message.warning("Số điện thoại và email không được để trống!");
      return;
    }

    try {
      await ApiService.updateUserAccount(selectedUser.id, formData);
      message.success("Cập nhật tài khoản thành công!");
      fetchUsers();
      setSelectedUser(null);
    } catch (error) {
      message.error("Lỗi cập nhật tài khoản!");
    }
  };

  const handleDelete = async (id) => {
    try {
      await ApiService.deleteUserAccount(id);
      message.success("Xóa tài khoản thành công!");
      fetchUsers();
    } catch (error) {
      message.error("Lỗi xóa tài khoản!");
    }
  };

  const handleToggleStatus = async (user) => {
    try {
      const newStatus = user.status === "Đang hoạt động" ? "Bị khóa" : "Đang hoạt động";
      await ApiService.updateUserStatus(user.id, newStatus);
      message.success(
        `Đã ${
          newStatus === "Đang hoạt động" ? "mở khóa" : "khóa"
        } tài khoản thành công!`
      );
      fetchUsers();
    } catch (error) {
      message.error("Lỗi cập nhật trạng thái tài khoản!");
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const openCreateUserModal = () => {
    setFormData({
      username: "",
      name: "",
      phone: "",
      email: "",
      dateOfBirth: "",
      password: "",
    });
    setIsCreateModalVisible(true);
  };

  const handleCreateUser = async () => {
    if (
      !formData.username.trim() ||
      !formData.phone.trim() ||
      !formData.email.trim() ||
      !formData.password.trim()
    ) {
      message.warning("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    try {
      await ApiService.createUserAccount(formData);
      message.success("Tạo tài khoản thành công!");
      fetchUsers();
      setIsCreateModalVisible(false);
    } catch (error) {
      message.error("Lỗi tạo tài khoản!");
    }
  };

  const paginatedUsers = users.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const columns = [
    {
      title: "STT",
      key: "stt",
      render: (text, record, index) => (currentPage - 1) * pageSize + index + 1,
    },
    { title: "Username", dataIndex: "username", key: "username" },
    { title: "Họ và Tên", dataIndex: "name", key: "name" },
    { title: "Số Điện Thoại", dataIndex: "phone", key: "phone" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Ngày Sinh", dataIndex: "dateOfBirth", key: "dateOfBirth" },
    {
      title: "Số lần vi phạm",
      dataIndex: "violationCount",
      key: "violationCount",
      render: (count) => <span>{count || 0}</span>,
    },
    {
      title: "Trạng Thái",
      dataIndex: "status",
      key: "status",
      render: (status) =>
        status === "Đang hoạt động" ? (
          <Tag color="green">Đang hoạt động</Tag>
        ) : (
          <Tag color="red">Bị khóa</Tag>
        ),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <EditOutlined
            style={{ color: "blue", cursor: "pointer", fontSize: "18px" }}
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa?"
            onConfirm={() => handleDelete(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <DeleteOutlined
              style={{ color: "red", cursor: "pointer", fontSize: "18px" }}
            />
          </Popconfirm>
          <Popconfirm
            title={`Bạn có chắc chắn muốn ${
              record.status === "Đang hoạt động" ? "Khóa " : "Mở khóa"
            } tài khoản?`}
            onConfirm={() => handleToggleStatus(record)}
            okText="Có"
            cancelText="Không"
          >
            <Button
              type="primary"
              danger={record.status === "Đang hoạt động"}
              size="small"
            >
              {record.status === "Đang hoạt động" ? "Khóa" : "Mở khóa"}
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div>
      <h2>Quản Lý Tài Khoản Người Dùng</h2>

      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <Input
          placeholder="Nhập số điện thoại..."
          value={searchPhone}
          onChange={(e) => setSearchPhone(e.target.value)}
        />
        <Button type="primary" onClick={handleSearch}>
          Tìm kiếm
        </Button>
        <Button
          type="primary"
          onClick={openCreateUserModal}
          icon={<PlusOutlined />}
        >
          Tạo tài khoản
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={paginatedUsers}
        loading={loading}
        rowKey="id"
        pagination={false}
      />

      <Pagination
        current={currentPage}
        pageSize={pageSize}
        total={users.length}
        onChange={(page) => setCurrentPage(page)}
        showSizeChanger
        onShowSizeChange={(current, size) => setPageSize(size)}
        style={{ marginTop: 20, textAlign: "right" }}
      />

      {/* Modal chỉnh sửa */}
      <Modal
        title="Chỉnh sửa tài khoản"
        open={!!selectedUser}
        onCancel={() => setSelectedUser(null)}
        onOk={handleSave}
      >
        <Input
          name="username"
          value={formData.username}
          disabled
          style={{ marginBottom: "10px" }}
        />
        <Input
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Họ và tên"
        />
        <Input
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          placeholder="Số điện thoại"
        />
        <Input
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="Email"
        />
        <Input
          name="dateOfBirth"
          value={formData.dateOfBirth}
          onChange={handleInputChange}
          placeholder="Ngày sinh yyyy-mm-dd"
        />
      </Modal>

      {/* Modal Tạo tài khoản */}
      <Modal
        title="Tạo tài khoản mới"
        open={isCreateModalVisible}
        onCancel={() => setIsCreateModalVisible(false)}
        onOk={handleCreateUser}
      >
        <Input
          name="username"
          value={formData.username}
          onChange={handleInputChange}
          placeholder="Username"
        />
        <Input
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Họ và tên"
          style={{ marginTop: "10px" }}
        />
        <Input
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          placeholder="Số điện thoại"
          style={{ marginTop: "10px" }}
        />
        <Input
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="Email"
          style={{ marginTop: "10px" }}
        />
        <Input
          name="dateOfBirth"
          value={formData.dateOfBirth}
          onChange={handleInputChange}
          placeholder="Ngày sinh"
          style={{ marginTop: "10px" }}
        />
        <Input.Password
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          placeholder="Mật khẩu"
          style={{ marginTop: "10px" }}
        />
      </Modal>
    </div>
  );
};

export default CustomerManagement;
