import React, { useState, useEffect, useRef } from "react";
import ReactQuill from "react-quill";
import apiService from "../../service/apiService";
import "react-quill/dist/quill.snow.css";
import { useNavigate } from "react-router-dom";

const ArticleForm = () => {
  const navigate = useNavigate(); 
  const [formData, setFormData] = useState({
    title: "",
    image: "", // Lưu base64 vào đây
    topicId: "",
    content: "",
    author: "",
  });

  const [topics, setTopics] = useState([]);
  const [preview, setPreview] = useState(null); // Lưu URL để preview
  const fileInputRef = useRef(null); // Dùng useRef để reset input file

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const data = await apiService.getTopics();
        setTopics(data);
      } catch (error) {
        console.error("Lỗi khi lấy topics:", error);
      }
    };
    fetchTopics();
  }, []);

  const handleChange = (e) => {
    // Kiểm tra nếu e là một chuỗi thì đây là nội dung từ ReactQuill
    if (typeof e === "string") {
      setFormData((prevState) => ({
        ...prevState,
        content: e, // Lưu nội dung vào state
      }));
    } else {
      const { name, value } = e.target;
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };
  

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Xoá URL cũ nếu có
      if (preview) URL.revokeObjectURL(preview);

      // Tạo URL preview tạm thời
      const objectURL = URL.createObjectURL(selectedFile);
      setPreview(objectURL);

      // Chuyển ảnh thành base64 để lưu vào database
      const reader = new FileReader();
      reader.readAsDataURL(selectedFile);
      reader.onloadend = () => {
        setFormData((prevState) => ({
          ...prevState,
          image: reader.result, // Lưu base64 vào state
        }));
      };
    }
  };

  const handleRemoveImage = () => {
    if (preview) URL.revokeObjectURL(preview); // Giải phóng bộ nhớ
    setPreview(null);
    setFormData((prevState) => ({
      ...prevState,
      image: "", // Xóa base64 trong state
    }));

    // Reset input file
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { title, topicId, content, author, image } = formData;

    if (!title || !topicId || !content || !author) {
      alert("Vui lòng không bỏ trống thông tin!");
      return;
    }

    console.log("Dữ liệu gửi đi:", formData);

    try {
      const createdPost = await apiService.postArticle(formData);
      alert("Thêm bài viết thành công!");

      // // Reset form
      // setFormData({ title: "", image: "", topicId: "", content: "", author: "" });
      // setPreview(null);
      // if (fileInputRef.current) {
      //   fileInputRef.current.value = "";
      
      setTimeout(() => navigate(`/article/${createdPost.id}`));
      
    } catch (error) {
      alert("Lỗi xảy ra khi đăng bài!");
    }
  };

  return (
    <div className="edit-article-container">
      <h2>Tạo bài viết</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Tiêu đề bài viết</label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Chủ đề</label>
          <select name="topicId" value={formData.topicId} onChange={handleChange} required>
            <option value="">Select a topic</option>
            {topics.map((topic) => (
              <option key={topic.topicID} value={topic.topicID}>
                {topic.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Nội dung</label>
          <ReactQuill value={formData.content} onChange={handleChange} theme="snow" required />
        </div>

        <div className="form-group">
          <label>Ảnh</label>
          <input
            type="file"
            ref={fileInputRef} // Gán ref để reset input file
            name="image"
            onChange={handleFileChange}
            accept="image/*"
          />
          {preview && (
            <div className="image-preview-container">
              <img src={preview} alt="Image Preview" className="image-preview" />
              <button type="button" className="remove-image-btn" onClick={handleRemoveImage}>
                Xóa ảnh
              </button>
            </div>
          )}
        </div>

        <div className="form-group">
          <label>Tác giả</label>
          <input type="text" name="author" value={formData.author} onChange={handleChange} required />
        </div>

        <button type="submit">Đăng bài</button>
      </form>
    </div>
  );
};

export default ArticleForm;
