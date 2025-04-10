import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import apiService from "../../service/apiService";
import ReportModal from "./ReportModal";
import {
  FaHeart,
  FaComment,
  FaEllipsisV,
  FaTrash,
  FaEdit,
  FaFlag,
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
  const location = useLocation();
  const [reporting, setReporting] = useState(null); // Lưu thông tin đang báo cáo (bài viết hoặc bình luận)

  useEffect(() => {
    const handleScrollToHash = () => {
      if (!location.hash || loading) return; // Nếu đang loading hoặc không có hash thì thoát

      console.log("📜 Chuẩn bị cuộn trang đến:", location.hash);

      setTimeout(() => {
        const hash = location.hash.slice(1); // Bỏ dấu #
        let baseId = hash;
        let commentId = null;

        if (hash.includes("#comment-")) {
          [baseId, commentId] = hash.split("#comment-");
        }

        // Chờ phần tử xuất hiện trên DOM
        const waitForElement = (id, callback) => {
          const element = document.getElementById(id);
          if (element) {
            callback(element);
          } else {
            const observer = new MutationObserver(() => {
              const element = document.getElementById(id);
              if (element) {
                observer.disconnect();
                callback(element);
              }
            });

            observer.observe(document.body, { childList: true, subtree: true });
          }
        };

        // Cuộn đến phần tử chính
        waitForElement(baseId, (element) => {
          element.scrollIntoView({ behavior: "smooth", block: "center" });

          if (element.classList.contains("comment-item")) {
            element.classList.add("comment-focus");
            setTimeout(() => element.classList.remove("comment-focus"), 5000);
          }
        });

        // Cuộn đến bình luận nếu có
        if (commentId) {
          waitForElement(commentId, (commentElement) => {
            commentElement.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
          });
        }
      }, 200); // Delay để chắc chắn DOM đã render
    };

    if (!loading) {
      handleScrollToHash();
    }

    // Lắng nghe sự kiện thay đổi hash trên URL
    window.addEventListener("hashchange", handleScrollToHash);

    return () => {
      window.removeEventListener("hashchange", handleScrollToHash);
    };
  }, [location.hash, loading]); // Chỉ chạy lại khi hash hoặc loading thay đổi

  useEffect(() => {
    const fetchArticleAndUser = async () => {
      // setLoading(true);
      try {
        const [data, user, isliked] = await Promise.all([
          apiService.getPostById(id),
          apiService.getUserProfile(),
          apiService.checkLiked(id),
        ]);
        setArticle(data);
        setLiked(isliked);
        setUser(user);
        setCommentCount(data.cmtCount || 0); // Cập nhật số lượng bình luận từ backend

        if (data.topicId) {
          const topicData = await apiService.getTopicById(data.topicId);
          setTopic(topicData.name); // Giả sử API trả về { name: "Tâm lý học" }
        }
        console.log("data:", data);
        console.log("user:", user);

      } catch (error) {
        console.error("Lỗi khi lấy bài viết:", error);
      } finally {
        setLoading(false); 
        console.log("Kết thúc tải dữ liệu.",loading); // Chắc chắn rằng setLoading sẽ chạy sau khi data đã được lấy hoặc xảy ra lỗi
      }
    };
    fetchArticleAndUser();
    fetchComments();
    setLoading(false);
    console.log("loading:",loading);
  }, [id]);

  const fetchComments = async () => {
    try {
      const response = await apiService.getCommentsByPost(id);
      console.log("Danh sách bình luận:", response);
      // console.log("id:",id,"cmtcount:",commentCount);
      setComments(response || []); // Đảm bảo setComment là mảng
      
    } catch (error) {
      console.error("Lỗi khi lấy comment:", error);
      setComments([]); // Nếu lỗi, gán mảng rỗng để tránh lỗi .map()
    }finally {
      setLoading(false);
      console.log("loading cmt:",loading);
    }
  };

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
      await apiService.addComment(id, { content: newComment });
      setCommentCount((prevCount) => prevCount + 1); // Cập nhật số lượng bình luận
      setNewComment("");
      fetchComments();
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
      // setComments(comment.filter((c) => c.id !== commentId));
      setCommentCount((prevCount) => Math.max(0, prevCount - 1)); // Cập nhật số lượng bình luận
      fetchComments();
      alert("Bình luận đã bị xóa.");
    } catch (error) {
      console.error("Lỗi khi xóa bình luận:", error);
    }
  };

  const openReportModal = (
    contentType,
    articleId,
    commentId,
    reportedUserId
  ) => {
    // Tạo chuỗi kết hợp ID bài viết và ID bình luận (nếu có)
    const contentId = commentId ? `${articleId}_${commentId}` : `${articleId}`;
    setReporting({ contentType, contentId, reportedUserId });
  };

  const closeReportModal = () => {
    setReporting(null);
  };

  const handleReportSubmit = async (reason) => {
    if (!reporting) return;
    console.log("report:", reporting);
    try {
      const reportData = {
        reporterId: user.id,
        reportedUserId: reporting.reportedUserId,
        contentId: reporting.contentId,
        contentType: reporting.contentType,
        reason,
        reportedAt: new Date().toISOString(),
        status: "Chưa duyệt",
      };

      await apiService.createReport(reportData);
      alert("Báo cáo đã được gửi!");
    } catch (error) {
      console.error("Lỗi khi gửi báo cáo:", error);
      alert("Gửi báo cáo thất bại, vui lòng thử lại.");
    }
    setReporting(""); // Reset form
    closeReportModal();
  };

  const handleReplySubmit = async (e, postId, parentId) => {
    e.preventDefault();
    if (!replyText[parentId]?.trim()) return;

    try {
      await apiService.replyToComment(postId, parentId, replyText[parentId]);
      setCommentCount((prevCount) => prevCount + 1);
      // Reset ô nhập phản hồi cho comment này
      setReplyText((prev) => ({ ...prev, [parentId]: "" }));
      setReplyingTo(null);
      fetchComments();
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
              id={`comment-${comment.id}`} // Thêm ID để hỗ trợ cuộn
              className={`comment-item ${parentExists ? "has-parent" : ""}`}
            >
              <div className="comment-container">
                {parentExists && (
                  <div
                    className={`vertical-line ${
                      hasSiblings ? "visible" : "hidden"
                    }`}
                    style={{ marginLeft: `${level * 10}px` }}
                  ></div>
                )}

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
                    className="btn-reply"
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
                  {user?.id !== comment.userId &&
                    user?.roles.some((role) => role.name === "ROLE_USER") && (
                      <button
                        onClick={() =>
                          openReportModal(
                            "Bình luận",
                            article.id,
                            comment.id,
                            article.userId
                          )
                        }
                      >
                        Báo cáo vi phạm
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
  if (!article || loading) return <p>Đang tải bài viết...</p>;

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
        <div className="menu-container">
          <button
            className="menu-button"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <FaEllipsisV />
          </button>
          {menuOpen && (
            <div className="menu-dropdown">
              {/* Kiểm tra quyền của người dùng */}
              {user?.id === article.userId ||
              user?.roles.some((role) => role.name === "ROLE_ADMIN") ? (
                <>
                  {/* Chủ sở hữu bài viết có quyền chỉnh sửa */}
                  {user?.id === article.userId && (
                    <button onClick={handleEditPost}>
                      <FaEdit /> Chỉnh sửa
                    </button>
                  )}

                  {/* Xóa bài viết (cả chủ sở hữu và admin đều có quyền) */}
                  <button onClick={handleDeletePost}>
                    <FaTrash /> Xóa bài viết
                  </button>
                </>
              ) : (
                // Nếu người dùng không thuộc hai trường hợp trên, cho phép báo cáo vi phạm
                <button
                  onClick={() =>
                    openReportModal(
                      "Bài viết",
                      article.id,
                      null,
                      article.userId
                    )
                  }
                >
                  <FaFlag /> Báo cáo vi phạm
                </button>
              )}
            </div>
          )}
        </div>
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
          <FaHeart color={liked ? "pink" : "red"} />{" "}
          {liked ? "Đã thích" : "   Thích"}
        </button>
        <div className="article-like">
          <h3>{article.likeCount} lượt thích</h3>
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
      {/* Hiển thị modal khi cần */}
      <ReportModal
        isOpen={!!reporting}
        onClose={closeReportModal}
        onSubmit={handleReportSubmit}
      />
    </div>
  );
};

export default ArticleDetail;
