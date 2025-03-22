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
  const [liked, setLiked] = useState(false);

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
  }, [commentCount,id]);

  const handleLike = async () => {
    try {
      const updatedArticle = await apiService.likeArticle(article.id);
      setArticle(updatedArticle); // Cập nhật bài viết
      
    setLiked(!liked); // Đảo trạng thái thích / bỏ thích
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
      setCommentCount((prevCount) => prevCount + 1); // Cập nhật số lượng bình luận
      setNewComment("");
    } catch (error) {
      console.error("Lỗi khi thêm bình luận:", error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    const confirmDelete = window.confirm(
      "Bạn có chắc chắn muốn xóa bình luận này?"
    );
    if (!confirmDelete) return;
    console.log("id cmt:", commentId);

    try {
      await apiService.deleteComment(commentId);
      setComments(comment.filter((c) => c.id !== commentId));
      setCommentCount((prevCount) => Math.max(0, prevCount - 1)); // Cập nhật số lượng bình luận
    } catch (error) {
      console.error("Lỗi khi xóa bình luận:", error);
    }
  };

  const handleReplySubmit = async (e, postId, parentId) => {
    e.preventDefault();
    if (!replyText[parentId]?.trim()) return;

    try {
      const newReply = await apiService.replyToComment(
        postId,
        parentId,
        replyText[parentId]
      );

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
          c.id === parentId
            ? { ...c, replies: [...c.replies, formattedReply] }
            : c
        )
      );
      setCommentCount((prev) => prev + 1);
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
  const renderComments = (comments, level = 0, parentExists = false) => {
    return (
      <ul className="comment-list">
        {comments.map((comment, index) => {
          const hasSiblings = comments.length > 1;
          return (
            <li
              key={comment.id}
              className={`comment-item ${parentExists ? "has-parent" : ""}`}
            >
              <div className="comment-container">
                {/* Dấu phân cấp: Hiển thị | nếu có từ 2 bình luận cùng cấp */}
                {parentExists && (
                  <div
                    className={`vertical-line ${
                      hasSiblings ? "visible" : "hidden"
                    }`}
                    style={{ marginLeft: `${level * 10}px` }} // Điều chỉnh khoảng cách theo cấp
                  ></div>
                )}

                {/* Đường ngang kết nối cha-con */}
                {parentExists && <div className="horizontal-line"></div>}

                <div className="comment-header">
                  <img
                    src={comment.avatar || "/default-avatar.png"}
                    alt="avatar"
                    className="comment-avatar"
                  />
                  <div>
                    <strong>{comment.name}</strong>
                    <p>{comment.content}</p>
                    <small>
                      {new Date(comment.createdAt).toLocaleString("vi-VN")}
                    </small>
                  </div>
                </div>

                <div className="comment-actions">
                  <button
                    classname="btn-reply"
                    onClick={() => setReplyingTo(comment.id)}
                  >
                    Phản hồi
                  </button>
                  {(user?.id === comment.userId ||
                    user?.roles.some((role) => role.name === "ROLE_ADMIN")) && (
                    <button onClick={() => handleDeleteComment(comment.id)}>
                      Xóa
                    </button>
                  )}
                </div>

                {replyingTo === comment.id && (
                  <form
                    className="comment-section"
                    onSubmit={(e) =>
                      handleReplySubmit(e, article.id, comment.id)
                    }
                  >
                    <input
                      type="text"
                      placeholder="Viết phản hồi..."
                      value={replyText[comment.id] || ""}
                      onChange={(e) =>
                        setReplyText((prev) => ({
                          ...prev,
                          [comment.id]: e.target.value,
                        }))
                      }
                    />
                    <button className="btn-submit" type="submit">
                      Gửi
                    </button>
                  </form>
                )}

                {/* Render replies */}
                {comment.replies && comment.replies.length > 0 && (
                  <div
                    className={`replies ${
                      comment.replies.length > 1 ? "has-multiple" : ""
                    }`}
                  >
                    {renderComments(comment.replies, level + 1, true)}
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    );
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
          <FaHeart color={liked ? "pink" : "red"} /> {liked ? "Đã thích" : "Thích"}
          </button>
          <div className="article-like"><h3>
          {article.likeCount} lượt thích
          </h3>
          </div>

        <h3 className="article-cmt">
          {commentCount}
          <FaComment />
          Bình luận
        </h3>
        
      </div>
      {renderComments(comment)}
      {/* Ô nhập bình luận */}
      <form onSubmit={handleCommentSubmit} className="comment-section">
        <input
          type="text"
          placeholder="Viết bình luận..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button className="btn-submit" type="submit">
          Gửi
        </button>
      </form>
    </div>
  );
};

export default ArticleDetail;
