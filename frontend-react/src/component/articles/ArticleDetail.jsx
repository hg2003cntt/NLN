import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import apiService from "../../service/apiService";
import { FaHeart, FaComment } from "react-icons/fa"; // Import icon thích và comment

const ArticleDetail = () => {
  const { id } = useParams(); // Lấy ID bài viết từ URL
  const [article, setArticle] = useState(null);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const data = await apiService.getPostById(id);
        setArticle(data);
        setLoading(false);
      } catch (error) {
        console.error("Lỗi khi lấy bài viết:", error);
        setLoading(false);
      }
    };
    fetchArticle();
  }, [id]);

  const handleLike = async () => {
    try {
      const updatedArticle = await apiService.likeArticle(id);
      setArticle(updatedArticle); // Cập nhật trạng thái bài viết
    } catch (error) {
      console.error("Lỗi khi thích bài viết:", error);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    try {
      const newComment = await apiService.addComment(id, { content: comment });
      setArticle((prev) => ({
        ...prev,
        cmtCount: prev.cmtCount + 1, // Tăng số lượng bình luận hiển thị
      }));
      setComment(""); // Reset ô nhập bình luận
    } catch (error) {
      console.error("Lỗi khi thêm bình luận:", error);
    }
  };

  if (loading) return <p>Đang tải...</p>;
  if (!article) return <p>Không tìm thấy bài viết.</p>;

  return (
    <div className="article-detail">
      <h1>{article.title}</h1>
      <p className="article-meta">
        Đăng bởi <strong>{article.author}</strong> vào{" "}
        {new Date(article.createdAt).toLocaleDateString("vi-VN")}
      </p>
      {article.image && <img src={article.image} alt="Bài viết" className="article-image"/>}
      <div className="article-content" dangerouslySetInnerHTML={{ __html: article.content }} />

      {/* Hiển thị lượt thích và bình luận */}
      <div className="article-actions">
        <button onClick={handleLike} className="like-button">
          <FaHeart color="red" /> {article.likeCount} Thích
        </button>
        <span className="comment-count">
          <FaComment /> {article.cmtCount} Bình luận
        </span>
      </div>

      {/* Ô nhập bình luận */}
      <form onSubmit={handleCommentSubmit} className="comment-section">
        <input
          type="text"
          placeholder="Viết bình luận..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <button className="submit-cmt" type="submit">Gửi</button>
      </form>
    </div>
  );
};

export default ArticleDetail;
