import React, { useState, useEffect, useRef } from "react";
import ReactQuill from "react-quill";
import apiService from "../../service/apiService";
import "react-quill/dist/quill.snow.css";
import { useNavigate } from "react-router-dom";

const ArticleForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    image: "",
    topicId: "",
    content: "",
    author: "",
  });

  const [topics, setTopics] = useState([]);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null); // Ref để reset file input
  const quillRef = useRef(null); // Ref trực tiếp cho ReactQuill

  // Thay thế DOMNodeInserted bằng MutationObserver
  useEffect(() => {
    const targetNode = document.getElementById("react-quill-container");
    if (!targetNode) {
      console.error("Không tìm thấy phần tử cần theo dõi!");
      return;
    }

    const config = { childList: true, subtree: true };

    const callback = (mutationsList) => {
      mutationsList.forEach((mutation) => {
        if (mutation.type === "childList") {
          console.log("Node con đã được thêm hoặc xóa.");
        }
      });
    };

    const observer = new MutationObserver(callback);
    observer.observe(targetNode, config);

    return () => observer.disconnect(); // Dọn dẹp observer khi component bị unmount
  }, []);

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
    if (typeof e === "string") {
      setFormData((prevState) => ({
        ...prevState,
        content: e, // Nội dung từ ReactQuill
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
      if (preview) URL.revokeObjectURL(preview);

      const objectURL = URL.createObjectURL(selectedFile);
      setPreview(objectURL);

      const reader = new FileReader();
      reader.readAsDataURL(selectedFile);
      reader.onloadend = () => {
        setFormData((prevState) => ({
          ...prevState,
          image: reader.result,
        }));
      };
    }
  };

  const handleRemoveImage = () => {
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setFormData((prevState) => ({
      ...prevState,
      image: "",
    }));

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { title, topicId, content, author } = formData;

    if (!title || !topicId || !content || !author) {
      alert("Vui lòng không bỏ trống thông tin!");
      return;
    }

    console.log("Dữ liệu gửi đi:", formData);

    try {
      const createdPost = await apiService.postArticle(formData);
      alert("Thêm bài viết thành công!");
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
          <div id="react-quill-container">
            <ReactQuill
              ref={quillRef} // Gán ref trực tiếp để tránh cảnh báo findDOMNode
              value={formData.content}
              onChange={handleChange}
              theme="snow"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>Ảnh</label>
          <input
            type="file"
            ref={fileInputRef}
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
