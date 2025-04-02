import React, { useEffect, useState } from "react";
import ApiService from "../../service/apiService";
import { useNavigate, useLocation } from "react-router-dom";
import defaultImage from "../articles/default-image.jpg";

const ArticlePage = () => {
    const [articles, setArticles] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(true);
    const isAuthenticated = ApiService.isAuthenticated();


    useEffect(() => {
        const fetchArticles = async () => {
            const params = new URLSearchParams(location.search);
            const topic = params.get("topic");
            const searchKeyword = params.get("search");

            try {
                let response;
                if (topic || searchKeyword) {
                    response = await ApiService.searchPosts(topic, searchKeyword);
                } else {
                    response = await ApiService.getAllPosts();
                }
                setArticles(response);
                setLoading(false);
            } catch (error) {
                console.error("Lỗi khi lấy danh sách bài viết:", error);
            }
        };

        fetchArticles();
      
    }, [location.search]);

    const handleArticleClick = (id) => {
        if (!isAuthenticated) {
            navigate("/login", { state: { from: `/article/${id}` } });
            return;
        }
        navigate(`/article/${id}`);
    };
    while (loading) return <p>Đang tải...</p>;
    if (articles.length===0) return <p>Không tìm thấy bài viết.</p>;
    return (
        <div className="article-container">
            <h2>Bài viết</h2>
            
                <div className="article-grid">
                    {articles.map((article) => (
                        <div key={article.id} className="article-card" onClick={() => handleArticleClick(article.id)}>
                            <img src={article.image || defaultImage} alt={article.title} className="article-image" />
                            <div className="article-content">
                                <h3 className="article-title">{article.title}</h3>
                                <p className="article-description">{article.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            
        </div>
    );
};

export default ArticlePage;
