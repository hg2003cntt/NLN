import React from "react";
import Slider from "react-slick";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import img1 from "../img/cer1.png";
import img2 from "../img/cer2.png";
import img3 from "../img/cer3.png";

const NextArrow = ({ onClick }) => (
  <div className="custom-arrow next-arrow" onClick={onClick}>
    <FaChevronRight />
  </div>
);

const PrevArrow = ({ onClick }) => (
  <div className="custom-arrow prev-arrow" onClick={onClick}>
    <FaChevronLeft />
  </div>
);

const HomePage = () => {
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  return (
    <div className="container">
      {/* Giới thiệu */}
      <section className="section intro-box">
        <h1>
          Chào mừng bạn đến với <span>dịch vụ tư vấn tâm lý</span>
        </h1>
        <p>Hãy đặt lịch hẹn với chuyên gia ngay hôm nay!</p>
        <h4>Giới thiệu Bác sĩ Huỳnh Minh Tâm</h4>
        <p>
          <strong>Bác sĩ Huỳnh Minh Tâm</strong> là chuyên gia tư vấn tâm lý với
          nhiều năm kinh nghiệm.
        </p>
        <ul>
          <li>
            <strong>Chứng chỉ Nâng cao về Liệu pháp Tâm lý Phân tâm học</strong>
          </li>
          <li>
            <strong>Chứng chỉ Tâm lý Trẻ em</strong>
          </li>
          <li>
            <strong>Chứng chỉ Hành nghề Tâm lý Tích cực</strong>
          </li>
        </ul>
        <p>
          Bác sĩ cam kết đồng hành cùng khách hàng trên hành trình tìm lại sự cân
          bằng trong cuộc sống.
        </p>
        <button
          className="btn-success"
          onClick={() => window.dispatchEvent(new CustomEvent("openConsultationModal"))}
        >
          Đặt lịch ngay
        </button>
      </section>

      {/* Chứng chỉ */}
      <section className="section slider-wrapper">
        <Slider {...sliderSettings}>
          {[img1, img2, img3].map((img, index) => (
            <div key={index}>
              <img src={img} alt={`Chứng chỉ ${index + 1}`} className="img-fluid" />
            </div>
          ))}
        </Slider>
      </section>

      {/* Vì sao chọn chúng tôi */}
      <section className="section">
        <h2>Tại sao chọn Psychology Care?</h2>
        <div className="why-us">
          <div className="why-card">
            <h4>Chuyên gia giàu kinh nghiệm</h4>
            <p>Đội ngũ chuyên gia có chứng chỉ hành nghề và hơn 10 năm trong lĩnh vực.</p>
          </div>
          <div className="why-card">
            <h4>Bảo mật tuyệt đối</h4>
            <p>Cam kết giữ kín thông tin của khách hàng trong mọi tình huống.</p>
          </div>
          <div className="why-card">
            <h4>Tiện lợi và linh hoạt</h4>
            <p>Tư vấn trực tuyến và trực tiếp, đặt lịch dễ dàng mọi lúc.</p>
          </div>
        </div>
      </section>

      {/* Quy trình tư vấn */}
      <section className="section">
        <h2>Quy trình tư vấn</h2>
        <div className="steps">
          <div className="step-item">
            <p>Đăng ký thông tin và lựa chọn chuyên gia phù hợp.</p>
          </div>
          <div className="step-item">
            <p>Tiến hành tư vấn theo khung giờ đã hẹn.</p>
          </div>
          <div className="step-item">
            <p>Nhận báo cáo và gợi ý chăm sóc tinh thần sau tư vấn.</p>
          </div>
        </div>
      </section>

      {/* Cảm nhận khách hàng */}
      <section className="section">
        <h2>Khách hàng nói gì?</h2>
        <div className="testimonials">
          <div className="testimonial-card">
            <p>“Tôi cảm thấy nhẹ lòng hơn sau khi chia sẻ với chuyên gia.”</p>
            <div className="name">– Ngọc Linh</div>
          </div>
          <div className="testimonial-card">
            <p>“Tư vấn rất tận tình và đúng trọng tâm.”</p>
            <div className="name">– Minh Hoàng</div>
          </div>
          <div className="testimonial-card">
            <p>“Không ngờ online lại hiệu quả đến vậy.”</p>
            <div className="name">– Thùy Dương</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
