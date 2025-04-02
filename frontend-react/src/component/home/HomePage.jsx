import React from "react"; 
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

// Custom Arrow Components
const NextArrow = ({ onClick }) => (
  <div 
    className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-gray-800 text-white p-3 rounded-full cursor-pointer hover:bg-gray-700 transition-all z-10"
    onClick={onClick}
  >
    <FaChevronRight size={24} />
  </div>
);

const PrevArrow = ({ onClick }) => (
  <div 
    className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-gray-800 text-white p-3 rounded-full cursor-pointer hover:bg-gray-700 transition-all z-10"
    onClick={onClick}
  >
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      {/* Tiêu đề */}
      <div className="text-center py-8">
        <h1 className="text-4xl font-extrabold text-gray-800">
          Chào mừng bạn đến với dịch vụ tư vấn tâm lý
        </h1>
        <p className="text-lg text-gray-600 mt-3">
          Hãy đặt lịch hẹn với chuyên gia ngay hôm nay!
        </p>
      </div>
    
      {/* Slider ảnh */}
      <div className="relative w-full max-w-3xl mx-auto bg-white p-4 rounded-xl shadow-lg border border-gray-200">
        <Slider {...settings}>
          {[
            "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/24701-nature-natural-beauty.jpg/1200px-24701-nature-natural-beauty.jpg?20160607144903",
            "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Devils_Punchbowl_State_Natural_Area.jpg/1199px-Devils_Punchbowl_State_Natural_Area.jpg?20240322161219",
            "https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Natural_Bridges_Cove_-_Boardman_State_Park%2C_Oregon.jpg/1200px-Natural_Bridges_Cove_-_Boardman_State_Park%2C_Oregon.jpg"
          ].map((src, index) => (
            <div key={index} className="relative flex items-center justify-center">
              <img
                src={src}
                alt={`Slide ${index + 1}`}
                className="max-w-full max-h-[500px] object-contain rounded-lg mx-auto"
              />
            </div>
          ))}
        </Slider>
      </div>

      {/* Nút Đặt lịch */}
      <div className="mt-8">
        <button className="w-48 py-4 bg-blue-600 text-white text-lg font-semibold rounded-full shadow-md hover:bg-blue-700 transition-all duration-300">
          Đặt lịch ngay
        </button>
      </div>
      
    </div>
  );
};

export default HomePage;
