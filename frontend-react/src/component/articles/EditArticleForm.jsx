import React, { useEffect, useState, useRef } from "react";
import ReactQuill from "react-quill";
import { useParams, useNavigate } from "react-router-dom";
import ApiService from "../../service/apiService";
import "react-quill/dist/quill.snow.css";

const EditArticleForm = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [formData, setFormData] = useState({
        title: "",
        image: "",
        topicId: "",
        content: "",
        author: "",
    });

    const [topics, setTopics] = useState([]);
    const [preview, setPreview] = useState(null);
    const fileInputRef = useRef(null);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const postData = await ApiService.getPostById(id);
                const topicList = await ApiService.getTopics();
                
                setFormData({
                    title: postData.title,
                    image: postData.image,
                    topicId: postData.topicId, // Đảm bảo topicId được set đúng
                    content: postData.content,
                    author: postData.author
                });
                setTopics(topicList);
                setPreview(postData.image);
            } catch (error) {
                console.log("Lỗi khi lấy dữ liệu bài viết và topic", error);
            }
        };
        fetchData();
    }, [id]);
    
    const handleChange = (e) => {
        if (typeof e === "string") {
            setFormData((prevState) => ({ ...prevState, content: e }));
        } else {
            const { name, value } = e.target;
            setFormData((prevState) => ({ ...prevState, [name]: value }));
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
                setFormData((prevState) => ({ ...prevState, image: reader.result }));
            };
        }
    };

    const handleRemoveImage = () => {
        if (preview) URL.revokeObjectURL(preview);
        setPreview(null);
        setFormData((prevState) => ({ ...prevState, image: "" }));

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // Thêm id vào dữ liệu gửi đi
        const updatedData = { ...formData, id };
    
        console.log("Dữ liệu gửi đi:", updatedData); // Kiểm tra lại dữ liệu
    
        try {
            const response = await ApiService.updateArticle(updatedData);
            if(response)
            alert("Bài viết đã được cập nhật!");
            navigate(`/article/${id}`);
        } catch (error) {
            console.error("Lỗi khi cập nhật bài viết:", error.response?.data || error.message);
        }
    };
    

    return (
        <div className="edit-article-container">
            <h2>Edit Blog</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Title</label>
                    <input type="text" name="title" value={formData.title} onChange={handleChange} required />
                </div>

                <div className="form-group">
                    <label>Topic</label>
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
                    <label>Content</label>
                    <ReactQuill value={formData.content} onChange={handleChange} theme="snow" required />
                </div>

                <div className="form-group">
                    <label>Image</label>
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
                                Remove Image
                            </button>
                        </div>
                    )}
                </div>

                <div className="form-group">
                    <label>Author</label>
                    <input type="text" name="author" value={formData.author} onChange={handleChange} required />
                </div>

                <button type="submit">Update Blog</button>
            </form>
        </div>
    );
};

export default EditArticleForm;
