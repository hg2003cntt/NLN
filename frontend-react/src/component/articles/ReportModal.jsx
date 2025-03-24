import { useState } from "react";

const ReportModal = ({ isOpen, onClose, onSubmit }) => {
  const [reason, setReason] = useState("");

  const reasons = [
    "Nội dung phản cảm",
    "Spam",
    "Thông tin sai lệch",
    "Lời lẽ xúc phạm",
    "Khác (ghi rõ)",
  ];

  const handleSubmit = () => {
    if (!reason.trim()) {
      alert("Vui lòng chọn lý do báo cáo!");
      return;
    }
    onSubmit(reason);
    setReason(""); // Reset sau khi gửi
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Báo cáo vi phạm</h3>
        <select value={reason} onChange={(e) => setReason(e.target.value)}>
          <option value="">-- Chọn lý do --</option>
          {reasons.map((r, index) => (
            <option key={index} value={r}>
              {r}
            </option>
          ))}
        </select>
        <div className="modal-buttons">
          <button onClick={handleSubmit}>Gửi báo cáo</button>
          <button onClick={onClose}>Hủy</button>
        </div>
      </div>
    </div>
  );
};

export default ReportModal;
