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
  const [replyText, setReplyText] = useState({});
  const [commentCount, setCommentCount] = useState(0);



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
        setCommentCount(data.cmtCount || 0); // Cập nhật số lượng bình luận từ backend

        
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
    if (!newComment.trim()) return;

    try {
      const newCmt = await apiService.addComment(id, { content: newComment });

      const user = JSON.parse(localStorage.getItem("user"));

      const formattedComment = {
        ...newCmt,
        authorName: user?.name || "Bạn",
        avatar: user?.avatar || "/default-avatar.png",
        formattedTime: "Vừa xong",
        replies: [],
      };

      setComments((prevComments) => [formattedComment, ...prevComments]);
      setCommentCount(commentCount); // Cập nhật số lượng bình luận
      setNewComment("");
    } catch (error) {
      console.error("Lỗi khi thêm bình luận:", error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa bình luận này?");
    if (!confirmDelete) return;
    console.log("id cmt:",commentId)

    try {
      await apiService.deleteComment(commentId);
      setComments(comment.filter((c) => c.id !== commentId));
      setCommentCount(commentCount); // Cập nhật số lượng bình luận
    } catch (error) {
      console.error("Lỗi khi xóa bình luận:", error);
    }
  };

  const handleReplySubmit = async (e, postId, parentId) => {
    e.preventDefault();
    if (!replyText[parentId]?.trim()) return;

    try {
      const newReply = await apiService.replyToComment(postId, parentId, replyText[parentId]);

      const user = JSON.parse(localStorage.getItem("user"));

      const formattedReply = {
        ...newReply,
        authorName: user?.name || "Bạn",
        avatar: user?.avatar || "/default-avatar.png",
        formattedTime: "Vừa xong",
      };

      // Cập nhật danh sách bình luận
      setComments((prev) =>
        prev.map((c) =>
          c.id === parentId ? { ...c, replies: [...c.replies, formattedReply] } : c
        )
      );

      // Reset ô nhập phản hồi cho comment này
      setReplyText((prev) => ({ ...prev, [parentId]: "" }));
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

      <h3 >{commentCount}<FaComment />Bình luận</h3>
      <ul>
        {comment.map((c) => (
          <li key={c.id} className="comment-item">
            <img src={c.avatar} alt="avatar" className="comment-avatar" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '50%' }} />
            <div className="comment-content">
              <strong>{c.authorName}:</strong> {c.content}
              <div className="comment-meta">
                <small>{c.formattedTime}</small>
              </div>
            </div>

            <div className="comment-actions">
              <button onClick={() => setReplyingTo(c.id)} className="reply-btn">
                Phản hồi
              </button>
              {(user?.id === c.userId || user?.roles.includes("ROLE_ADMIN")) && (
                <button onClick={() => handleDeleteComment(c.id)} className="delete-btn">
                  Xóa
                </button>
              )}
            </div>

            {replyingTo === c.id && (
              <form onSubmit={(e) => handleReplySubmit(e, article.id, c.id)} className="reply-section">
                <input
                  type="text"
                  placeholder="Viết phản hồi..."
                  value={replyText[c.id] || ""}
                  onChange={(e) => setReplyText((prev) => ({ ...prev, [c.id]: e.target.value }))}
                />
                <button type="submit">Gửi</button>
              </form>
            )}

            <ul className="reply-list">
              {c.replies.map((reply) => (
                <li key={reply.id} className="reply-item">
                  <img src={reply.avatar} alt="avatar" className="reply-avatar" />
                  <strong>{reply.authorName}:</strong> {reply.content}
                  <small>{reply.formattedTime}</small>
                </li>
              ))}
            </ul>
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
