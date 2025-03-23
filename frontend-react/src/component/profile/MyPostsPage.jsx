import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ApiService from "../../service/apiService";
import { MdArrowBack } from "react-icons/md"; // Icon back
import defaultImage from "../articles/default-image.jpg"

const MyPostsPage = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await ApiService.getUserPosts(); // Gọi API lấy bài viết của user
                setPosts(response);
            } catch (err) {
                setError("Không thể tải danh sách bài viết");
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    if (loading) return <p className="myposts-loading">Đang tải danh sách bài viết...</p>;
    if (error) return <p className="myposts-error">{error}</p>;

    return (
        <div className="myposts-container">
            <h2 className="myposts-title">Bài viết của tôi</h2>

            {posts.length === 0 ? (
                <div className="myposts-empty">
                    <p>Bạn chưa có bài viết nào. Hãy quay lại sau!</p>
                </div>
            ) : (
                <div className="myposts-list">
                    {posts.map((post) => (
                        <Link to={`/article/${post.id}`} key={post.id} className="myposts-card">
                            <img src={post.image || defaultImage} alt="Post" className="myposts-image" />
                            <div className="myposts-content">
                                <h3 className="myposts-title">{post.title}</h3>
                                <p className="myposts-author">Tác giả: {post.author}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            <div className="myposts-back">
                <Link to="/profile" className="myposts-back-btn">
                    <MdArrowBack size={20} /> Quay lại
                </Link>
            </div>
        </div>
    );
};

export default MyPostsPage;
