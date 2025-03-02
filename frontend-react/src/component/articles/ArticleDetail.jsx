import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import apiService from "../../service/apiService";
import {
  FaHeart,
  FaComment,
  FaEllipsisV,
  FaTrash,
  FaEdit,
} from "react-icons/fa"; // Import icon

const ArticleDetail = () => {
  const { id } = useParams(); // Lấy ID bài viết từ URL
  const [article, setArticle] = useState(null);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false); // Trạng thái menu dấu 3 chấm

  useEffect(() => {
    const fetchArticleAndUser = async () => {
      try {
        const [data, user] = await Promise.all([
          apiService.getPostById(id),
          apiService.getUserProfile(),
        ]);
        setArticle(data);
        setUser(user);
        setLoading(false);
        console.log("data:", data);
        console.log("user:", user);
      } catch (error) {
        console.error("Lỗi khi lấy bài viết:", error);
        setLoading(false);
      }
    };
    fetchArticleAndUser();
  }, [id]);

  const handleLike = async () => {
    try {
      const updatedArticle = await apiService.likeArticle(article.id);
      setArticle(updatedArticle); // Cập nhật bài viết
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
  const handleDeletePost = async () => {
    const confirmDelete = window.confirm(
      "Bạn có chắc chắn muốn xóa bài viết này?"
    );
    if (!confirmDelete) return;

    try {
      await apiService.deleteArticle(article.id);
      alert("Bài viết đã bị xóa.");
      navigate(`/articles`); // Quay về trang chính sau khi xóa
    } catch (error) {
      console.error("Lỗi khi xóa bài viết:", error);
    }
  };

  const handleEditPost = () => {
    navigate(`/edit/${article.id}`);
  };

  if (loading) return <p>Đang tải...</p>;
  if (!article) return <p>Không tìm thấy bài viết.</p>;

  return (
    <div className="article-detail">
      <div className="article-header">
        <h1>{article.title}</h1>
        {(user?.id === article.userId ||
          user?.roles.some((role) => role.name === "ROLE_ADMIN")) && (
          <div className="menu-container">
            <button
              className="menu-button"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <FaEllipsisV />
            </button>
            {menuOpen && (
              <div className="menu-dropdown">
                {user?.roles.some((role) => role.name === "ROLE_USER") && (
                  <button onClick={handleEditPost}>
                    <FaEdit /> Chỉnh sửa
                  </button>
                )}
                <button onClick={handleDeletePost}>
                  <FaTrash /> Xóa bài viết
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <p className="article-meta">
        Đăng bởi <strong>{article.author}</strong> vào{" "}
        {new Date(article.createdAt).toLocaleDateString("vi-VN")}
      </p>
      {article.image && (
        <img
          src={article.image}
          alt="Bài viết"
          className="article-image-detail"
        />
      )}
      <div
        className="article-content-detail"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />

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
        <button className="submit-cmt" type="submit">
          Gửi
        </button>
      </form>
    </div>
  );
};

export default ArticleDetail;
