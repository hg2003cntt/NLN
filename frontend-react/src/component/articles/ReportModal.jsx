import { useState } from "react";

const ReportModal = ({ isOpen, onClose, onSubmit }) => {
  const [reason, setReason] = useState("");
  const [customReason, setCustomReason] = useState("");

  const reasons = [
    "Nội dung phản cảm",
    "Spam",
    "Thông tin sai lệch",
    "Lời lẽ xúc phạm",
    "Khác (ghi rõ)",
  ];

  const handleSubmit = () => {
    let finalReason = reason === "Khác (ghi rõ)" ? customReason.trim() : reason;

    if (!finalReason) {
      alert("Vui lòng chọn hoặc nhập lý do báo cáo!");
      return;
    }

    onSubmit(finalReason);
    setReason(""); // Reset sau khi gửi
    setCustomReason("");
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

        {reason === "Khác (ghi rõ)" && (
          <input
            type="text"
            placeholder="Nhập lý do cụ thể"
            value={customReason}
            onChange={(e) => setCustomReason(e.target.value)}
          />
        )}

        <div className="modal-buttons">
          <button onClick={handleSubmit}>Gửi báo cáo</button>
          <button onClick={onClose}>Hủy</button>
        </div>
      </div>
    </div>
  );
};

export default ReportModal;
