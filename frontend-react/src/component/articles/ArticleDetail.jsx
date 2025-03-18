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
  const [topic, setTopic] = useState("");
  const [comment, setComments] = useState([]);
  const [newComment, setNewComment] = useState(""); // Tạo state riêng cho input
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false); // Trạng thái menu dấu 3 chấm

  const [replyingTo, setReplyingTo] = useState(null); // ID của comment đang được trả lời
  const [replies, setReplies] = useState({}); // Lưu trữ phản hồi của từng bình luận


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
        
        if (data.topicId) {
          const topicData = await apiService.getTopicById(data.topicId);
          setTopic(topicData.name); // Giả sử API trả về { name: "Tâm lý học" }
        }
        console.log("data:", data);
        console.log("user:", user);
      } catch (error) {
        console.error("Lỗi khi lấy bài viết:", error);
        setLoading(false);
      }
    };
    fetchArticleAndUser();

    const fetchComments = async () => {
      try {
          const response = await apiService.getCommentsByPost(id);
          console.log("Danh sách bình luận:", response);
          setComments(response || []); // Đảm bảo setComment là mảng
      } catch (error) {
          console.error("Lỗi khi lấy comment:", error);
          setComments([]); // Nếu lỗi, gán mảng rỗng để tránh lỗi .map()
      }
    };
    fetchComments();
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
    if (!newComment.trim()) return; // Kiểm tra nếu input rỗng thì không gửi
  
    try {
        const newCmt = await apiService.addComment(id, { content: newComment });

        const user = JSON.parse(localStorage.getItem("user")); // Lấy thông tin user từ localStorage
        const authorName = user?.name || "Bạn"; // Nếu có username thì dùng, nếu không thì để là "Bạn"
      
        const formattedComment = {
            ...newCmt,
            authorName, // Hiển thị ngay tên người bình luận
            formattedTime: "Vừa xong" // Hiển thị ngay thời gian bình luận
        };

        setComments((prevComments) => [formattedComment, ...prevComments]); // Thêm bình luận mới vào danh sách
        setArticle((prev) => ({ ...prev, cmtCount: prev.cmtCount + 1 })); // Tăng số lượng bình luận
        setNewComment(""); // Reset input sau khi gửi
    } catch (error) {
        console.error("Lỗi khi thêm bình luận:", error);
    }
};

  const handleDeleteComment = async (commentId) => {
    const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa bình luận này?");
    if (!confirmDelete) return;

    try {
      await apiService.deleteComment(commentId);
      setComments(comment.filter((c) => c.id !== commentId));
      setArticle((prev) => ({ ...prev, cmtCount: prev.cmtCount - 1 }));
    } catch (error) {
      console.error("Lỗi khi xóa bình luận:", error);
    }
  };

  const handleReplySubmit = async (e, postId, parentId) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
        const payload = { content: newComment, parentId }; // Đảm bảo parentId được gửi
        const newReply = await apiService.replyToComment(postId, payload);

        const user = JSON.parse(localStorage.getItem("user"));
        const authorName = user?.name || "Bạn";

        const formattedReply = {
            ...newReply,
            authorName,
            formattedTime: "Vừa xong"
        };

        setReplies((prev) => ({
            ...prev,
            [parentId]: [...(prev[parentId] || []), formattedReply]
        }));

        setNewComment("");
        setReplyingTo(null);
    } catch (error) {
        console.error("Lỗi khi thêm phản hồi:", error);
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
    navigate(`/editArticle/${article.id}`);
  };

  if (loading) return <p>Đang tải...</p>;
  if (!article) return <p>Không tìm thấy bài viết.</p>;

  return (
    <div className="article-detail">
      <button
        className="create-post-btn"
        onClick={() => navigate("/add-article")}
      >
        + Tạo bài viết
      </button>
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
                {user?.id === article.userId && (
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
        <strong>Chủ đề:</strong> {topic} | Đăng bởi{" "}
        <strong>{article.author}</strong> vào{" "}
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
      </div>

      <h3 >{article.cmtCount}<FaComment />Bình luận</h3>
      <ul>
        {comment.map((c) => (
          <li key={c.id} className="comment-item">
            <div className="comment-content">
              <div>
                <strong>{c.authorName}:</strong> {c.content}
                <div className="comment-meta">
                  <small>{c.formattedTime}</small>
                </div>
              </div>
            </div>

            {/* Các nút hành động (Phản hồi, Xóa) */}
            <div className="comment-actions">
              <button onClick={() => setReplyingTo(c.id)} className="reply-btn">
                Phản hồi
              </button>
              {(user?.id === c.userId || user?.roles?.includes("ROLE_ADMIN")) && (
                <button onClick={() => handleDeleteComment(c.id)} className="delete-btn">
                  Xóa
                </button>
              )}
            </div>

            {/* Form nhập phản hồi */}
            {replyingTo === c.id && (
              <form onSubmit={(e) => handleReplySubmit(e, c.id)} className="reply-section">
                <input
                  type="text"
                  placeholder="Viết phản hồi..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
                <button type="submit">Gửi</button>
              </form>
            )}

            {/* Danh sách phản hồi */}
            {replies[c.id] && replies[c.id].length > 0 && (
              <ul className="reply-list">
                {replies[c.id].map((reply) => (
                  <li key={reply.id} className="reply-item">
                    <strong>{reply.authorName}:</strong> {reply.content}
                    <small>{reply.formattedTime}</small>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>

    {/* Ô nhập bình luận */}
      <form onSubmit={handleCommentSubmit} className="comment-section">
        <input
          type="text"
          placeholder="Viết bình luận..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button className="submit-cmt" type="submit">
          Gửi
        </button>
      </form>
    </div>
  );
};

export default ArticleDetail;
