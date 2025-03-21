import React from "react";

const ContactPage = () => {
  return (
    <div className="contact-container">
      <h2 className="contact-title">LIÊN HỆ VỚI CHÚNG TÔI</h2>
      <p className="contact-subtitle"><strong>Hotline:</strong> 08h30 – 22h00 từ Thứ 2 đến Chủ nhật.</p>
      <p className="contact-subtitle">Vào các khung giờ ngoài thời gian trên, bạn vui lòng liên hệ Zalo hoặc Facebook nhé.</p>

      {/* Thông tin liên hệ */}
      <div className="contact-info">
        <div className="contact-box">
          <h3 className="contact-box-title red">Thông tin liên hệ</h3>
          <p><strong>Trụ sở:</strong> Hẻm liên tổ 3-4, phường An Khánh, quận Ninh Kiều, thành phố Cần Thơ</p>
          <p><strong>Hotline:</strong> <span className="highlight">0888399111</span></p>
        </div>
      </div>

      {/* Google Maps */}
      <div className="contact-map">
        <h3 className="contact-box-title">Bản đồ</h3>
        <iframe
          title="Google Map"
          width="600"
          height="450"
          style={{ border: 0, borderRadius: "8px", width: "100%" }}
          loading="lazy"
          allowFullScreen
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3930.1519227269273!2d105.7587695!3d10.0364753!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31a0883e5c4c6c23%3A0x0!2zMTDCsDAyJzExLjMiTiAxMDXCsDQ1JzMxLjYiRQ!5e0!3m2!1svi!2s!4v1648230973890!5m2!1svi!2s"
        ></iframe>
      </div>

      {/* Biểu tượng Zalo & Facebook */}
      <div className="contact-social">
        <a href="https://zalo.me/g/kqxvef991" target="_blank" rel="noopener noreferrer">
          <img src="https://upload.wikimedia.org/wikipedia/commons/9/91/Icon_of_Zalo.svg" alt="Zalo" className="social-icon" />
        </a>
        <a href="https://www.facebook.com/messages/t/635744389611090" target="_blank" rel="noopener noreferrer">
          <img src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg" alt="Facebook Messenger" className="social-icon" />
        </a>
      </div>
    </div>
  );
};

export default ContactPage;
