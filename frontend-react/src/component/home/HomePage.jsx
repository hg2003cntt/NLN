import React from "react"; 
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "animate.css/animate.min.css"; // Hiệu ứng

import img1 from "../img/cer1.png";
import img2 from "../img/cer2.png";
import img3 from "../img/cer3.png";

// Nút điều hướng slider
const NextArrow = ({ onClick }) => (
  <div className="absolute top-1/2 right-4 -translate-y-1/2 bg-gray-800 text-white p-3 rounded-full cursor-pointer hover:bg-gray-700 transition-all z-10" onClick={onClick}>
    <FaChevronRight size={24} />
  </div>
);

const PrevArrow = ({ onClick }) => (
  <div className="absolute top-1/2 left-4 -translate-y-1/2 bg-gray-800 text-white p-3 rounded-full cursor-pointer hover:bg-gray-700 transition-all z-10" onClick={onClick}>
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
    <div className="flex flex-row flex-wrap items-start justify-center w-full max-w-[1200px] mx-auto gap-6">      {/* Cột trái: Giới thiệu */}
      <div className="w-full w-1/2 p-6 animate__animated animate__fadeInLeft">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
          Chào mừng bạn đến với <span className="text-blue-600">dịch vụ tư vấn tâm lý</span>
        </h1>
        <p className="text-lg text-gray-600 mt-3">
          Hãy đặt lịch hẹn với chuyên gia ngay hôm nay!
        </p>

        <div className="mt-6 bg-white p-6 rounded-lg shadow-md text-gray-800 text-left">
          <h2 className="text-2xl md:text-3xl font-bold text-blue-600">Giới thiệu Bác sĩ Huỳnh Minh Tâm</h2>
          <p className="mt-4 text-lg leading-relaxed">
            <strong>Bác sĩ Huỳnh Minh Tâm</strong> là chuyên gia tư vấn tâm lý với nhiều năm kinh nghiệm.
          </p>
          <p className="mt-4 text-lg leading-relaxed">
            Anh đã hoàn thành <span className="text-blue-600 font-semibold">Chứng chỉ Liệu pháp Tâm lý</span> và <span className="text-blue-600 font-semibold">Chứng chỉ Tâm lý Trẻ em</span>.
          </p>
          <button className="mt-6 w-full md:w-48 py-3 bg-green-600 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-green-700 transition-all duration-300 mx-auto block">
            Đặt lịch ngay
          </button>
        </div>
      </div>

      {/* Cột phải: Slider chứng chỉ */}
      <div className="w-full md:w-1/2 flex justify-center bg-white p-4 rounded-xl shadow-lg border border-gray-200 animate__animated animate__fadeInRight">
        <div className="max-w-[500px] max-h-[300px] w-full">
          <Slider {...settings}>
            {images.map((src, index) => (
              <div key={index} className="flex items-center justify-center">
                <img src={src} alt={`Slide ${index + 1}`} className="w-full h-auto object-contain rounded-lg" />
              </div>
            ))}
          </Slider>
        </div>
      </div>
      
    </div>
  );
};

export default HomePage;
