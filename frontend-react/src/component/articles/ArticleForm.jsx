import React, { useState, forwardRef } from 'react';
import ReactQuill from 'react-quill';
import apiService from "../../service/apiService";
import 'react-quill/dist/quill.snow.css'; // Import CSS cho Quill

const ArticleForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    image: null,
    topicId: '',
    content: '',
    author: '',
  });
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const topics = ['Technology', 'Health', 'Education', 'Entertainment', 'Lifestyle'];

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
      setFormData((prevState) => ({
        ...prevState,
        image: selectedFile,
      }));
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

    const { title, image, topicId, content, author } = formData;

    if (!title || !image || !topicId || !content || !author) {
      setError('Please fill in all fields');
      setTimeout(() => setError(''), 5000);
      return;
    }

    try {
      // Giả sử bạn sẽ gửi dữ liệu lên API
      const formDataToSend = new FormData();
      formDataToSend.append('title', title);
      formDataToSend.append('image', image);
      formDataToSend.append('topic', topicId);
      formDataToSend.append('content', content);
      formDataToSend.append('penName', author);

      // Giả lập gửi dữ liệu (API Service)
       const result = await apiService.postArticle(formDataToSend);
      setSuccess('Blog added successfully!');
      setTimeout(() => {
        setSuccess('');
        // Navigate to blogs list
      }, 3000);
    } catch (error) {
      setError('An error occurred while submitting the blog');
      setTimeout(() => setError(''), 5000);
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
            name="topic"
            value={formData.topic}
            onChange={handleChange}
            required
          >
            <option value="">Select a topic</option>
            {topics.map((topic, index) => (
              <option key={index} value={topic}>
                {topic}
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
          <label>Image</label>
          <input
            type="file"
            name="image"
            onChange={handleFileChange}
            accept="image/*"
            //required
          />
          {preview && <img src={preview} alt="Image Preview" className="image-preview" />}
        </div>

        <div className="form-group">
          <label>Pen Name</label>
          <input
            type="text"
            name="penName"
            value={formData.penName}
            onChange={handleChange}
            required
          />
        </div>

        <button name="submit-blog" type="submit">Submit Blog</button>
      </form>
    </div>
  );
};

export default ArticleForm;
