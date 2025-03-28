import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import img1 from "../img/cer1.png";
import img2 from "../img/cer2.png";
import img3 from "../img/cer3.png";

const NextArrow = ({ onClick }) => (
  <div className="custom-arrow next-arrow" onClick={onClick}>
    <FaChevronRight size={24} />
  </div>
);

const PrevArrow = ({ onClick }) => (
  <div className="custom-arrow prev-arrow" onClick={onClick}>
    <FaChevronLeft size={24} />
  </div>
);

const HomePage = () => {
  const settings = {
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

  const images = [img1, img2, img3];

  return (
    <div className="homepage-container">
      <div className="homepage-row">
        {/* Cột trái */}
        <div className="homepage-left">
          <h1 className="display-5 fw-bold text-dark">
            Chào mừng bạn đến với{" "}
            <span className="text-primary">dịch vụ tư vấn tâm lý</span>
          </h1>
          <p className="lead text-secondary mt-3">
            Hãy đặt lịch hẹn với chuyên gia ngay hôm nay!
          </p>

          <div class="intro-box">
            <h4 class="h4 fw-semibold mb-3 text-primary">
              Giới thiệu Bác sĩ Huỳnh Minh Tâm
            </h4>
            <p>
              <strong>Bác sĩ Huỳnh Minh Tâm</strong> là chuyên gia tư vấn tâm lý
              với nhiều năm kinh nghiệm trong lĩnh vực tâm lý trị liệu và phát
              triển cá nhân. Anh đã hoàn thành{" "}
              <strong>
                Chứng chỉ Nâng cao về Liệu pháp Tâm lý Phân tâm học
              </strong>{" "}
              tại Viện Nghiên cứu Tâm lý Tiên tiến, chứng minh sự am hiểu sâu
              sắc về các phương pháp điều trị tâm lý chuyên sâu.
            </p>
            <p>
              Ngoài ra, bác sĩ còn đạt <strong>Chứng chỉ Tâm lý Trẻ em</strong>{" "}
              sau khóa đào tạo chuyên sâu kéo dài 3 tháng, giúp anh có thêm kiến
              thức vững chắc trong việc hỗ trợ trẻ nhỏ và thanh thiếu niên vượt
              qua những khó khăn tâm lý.
            </p>
            <p>
              Bên cạnh đó, bác sĩ Huỳnh Minh Tâm cũng sở hữu{" "}
              <strong>Chứng chỉ Hành nghề Tâm lý Tích cực</strong>, một phương
              pháp tiếp cận hiện đại giúp cải thiện sức khỏe tinh thần và nâng
              cao chất lượng cuộc sống.
            </p>
            <p>
              Với chuyên môn vững vàng và tâm huyết với nghề, bác sĩ Huỳnh Minh
              Tâm cam kết đồng hành cùng khách hàng trên hành trình tìm lại sự
              cân bằng và hạnh phúc trong cuộc sống.
            </p>
            <button
              class="btn-success px-4 py-2 mt-3"
              onClick={() =>
                window.dispatchEvent(new CustomEvent("openConsultationModal"))
              }
            >
              Đặt lịch ngay
            </button>
          </div>
        </div>

        {/* Cột phải */}
        <div className="homepage-right">
          <div className="slider-wrapper">
            <Slider {...settings}>
              {images.map((src, index) => (
                <div key={index} className="slider-item">
                  <img
                    src={src}
                    alt={`Slide ${index + 1}`}
                    className="img-fluid rounded"
                  />
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
