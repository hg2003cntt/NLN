import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import apiService from "../../service/apiService";
import "react-quill/dist/quill.snow.css"; // Import CSS cho Quill

const ArticleForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    image: "", // Luôn gửi chuỗi rỗng
    topicId: "",
    content: "",
    author: "",
  });
  const [topics, setTopics] = useState([]);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleQuillChange = (value) => {
    setFormData((prevState) => ({
      ...prevState,
      content: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { title, topicId, content, author } = formData;

    if (!title || !topicId || !content || !author) {
      setError("Please fill in all fields");
      setTimeout(() => setError(""), 5000);
      return;
    }

    try {
      const newPost = { ...formData, image: "" }; // Luôn gửi chuỗi rỗng cho image
      await apiService.postArticle(newPost);

      setSuccess("Blog added successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      setError("An error occurred while submitting the blog");
      setTimeout(() => setError(""), 5000);
    }
  };

  return (
    <div className="edit-article-container">
      <h2>Create New Blog</h2>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Topic</label>
          <select
            name="topicId"
            value={formData.topicId}
            onChange={handleChange}
            required
          >
            <option value="">Select a topic</option>
            {topics.map((topic) => (
              <option key={topic.topicID} value={topic.topicID}>
                {topic.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Content</label>
          <ReactQuill
            value={formData.content}
            onChange={handleQuillChange}
            theme="snow"
            required
          />
        </div>

        <div className="form-group">
          <label>Image (Not uploaded, only previewed)</label>
          <input
            type="file"
            name="image"
            onChange={handleFileChange}
            accept="image/*"
          />
          {preview && <img src={preview} alt="Image Preview" className="image-preview" />}
        </div>

        <div className="form-group">
          <label>Author</label>
          <input
            type="text"
            name="author"
            value={formData.author}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit">Submit Blog</button>
      </form>
    </div>
  );
};

export default ArticleForm;
