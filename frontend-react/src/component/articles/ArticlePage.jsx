import React, { useEffect, useState } from "react";
import ApiService from "../../service/apiService";
import { useNavigate, useLocation } from "react-router-dom";

const ArticlePage = () => {
    const [articles, setArticles] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();


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
            } catch (error) {
                console.error("Lỗi khi lấy danh sách bài viết:", error);
            }
        };

        fetchArticles();
    }, [location.search]);

    const handleArticleClick = (id) => {
        navigate(`/article/${id}`);
    };

    return (
        <div className="article-container">
            <h2>Bài viết</h2>
            {articles.length === 0 ? (
                <p>Không có bài viết nào.</p>
            ) : (
                <div className="article-grid">
                    {articles.map((article) => (
                        <div key={article.id} className="article-card" onClick={() => handleArticleClick(article.id)}>
                            <img src={article.image || "/default-image.jpg"} alt={article.title} className="article-image" />
                            <div className="article-content">
                                <h3 className="article-title">{article.title}</h3>
                                <p className="article-description">{article.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ArticlePage;
