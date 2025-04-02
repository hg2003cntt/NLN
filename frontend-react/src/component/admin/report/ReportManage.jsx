import React, { useEffect, useState } from "react";
import ApiService from "../../../service/apiService";
import { NavLink, useNavigate } from "react-router-dom";

const ReportManage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 8;

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      try {
        const data = await ApiService.getAllReports(currentPage, pageSize);
        setReports(data.content || []);
        setTotalPages(data.totalPages || 1);
      } catch (error) {
        console.error("Lỗi khi tải danh sách báo cáo:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [currentPage]);
  const generateLink = (contentId, contentType) => {
    let link = ""; // Khởi tạo biến link

    // Kiểm tra loại nội dung và tạo liên kết tương ứng
    if (contentType === "Bình luận") {
      link = `/article/${contentId.split("_")[0]}#comment-${
        contentId.split("_")[1]
      }`;
    } else if (contentType === "Bài viết") {
      link = `/article/${contentId}`;
    } else {
      link = "/home"; // Trường hợp không hợp lệ trả về trang chủ
    }
    console.log("link:", link);
    return link;
  };

  const handleStatusChange = async (contentId, newStatus) => {
     try {
          console.log("id:",contentId,"status:",newStatus);
          await ApiService.updateReportStatus(contentId, newStatus);
          setReports((prev) =>
            prev.map((c) => (c.contentId === contentId ? { ...c, status: newStatus } : c))
          );
        } catch (error) {
          console.error("Lỗi khi cập nhật trạng thái:", error);
          alert("Cập nhật trạng thái thất bại!");
        }
  };
  return (
    <div className="report-container">
      <h1 className="title">Quản lý báo cáo vi phạm</h1>

      {loading ? (
        <p className="loading">Đang tải...</p>
      ) : (
        <>
          <div className="table-container">
            <table className="report-table">
              <thead>
                <tr>
                  <th>STT</th>
                  <th>ID Người Bị Báo Cáo</th>
                  <th>ID Nội Dung</th>
                  <th>Loại Nội Dung</th>
                  <th>Số Lần Báo Cáo</th>
                  <th>Lý Do Phổ Biến Nhất</th>
                  <th>Ngày Báo Cáo Gần Nhất</th>
                  <th>Chi Tiết</th>
                  <th>Trạng Thái</th>
                </tr>
              </thead>
              <tbody>
                {reports.length > 0 ? (
                  reports.map((item, index) => (
                    <tr key={item.id}>
                      <td>{currentPage * pageSize + index + 1}</td>
                      <td>{item.reportedUserId}</td>
                      <td>{item.contentId}</td>
                      <td>{item.contentType}</td>
                      <td>{item.reportCount}</td>
                      <td>{item.mostCommonReason}</td>
                      <td>{item.latestReportedAt}</td>
                      <td>
                        <NavLink
                          className="view-button"
                          to={generateLink(item.contentId, item.contentType)} // Dùng 'to' thay vì 'onClick'
                        >
                          Xem chi tiết
                        </NavLink>
                      </td>
                      <td>
                        <select
                          className="status-dropdown"
                          value={item.status}
                          onChange={(e) =>
                            handleStatusChange(item.contentId, e.target.value)
                          }
                        >
                          <option value="Chưa duyệt">Chờ duyệt</option>
                          <option value="Đã giải quyết">Đã giải quyết</option>
                          <option value="Từ chối">Từ chối</option>
                        </select>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className="empty-row">
                    <td colSpan="8">Không có dữ liệu</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="pagination">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
              disabled={currentPage === 0}
            >
              {"<"} Trước
            </button>
            <span>
              Trang {currentPage + 1} / {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) =>
                  prev < totalPages - 1 ? prev + 1 : prev
                )
              }
              disabled={currentPage >= totalPages - 1}
            >
              Sau {">"}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ReportManage;
