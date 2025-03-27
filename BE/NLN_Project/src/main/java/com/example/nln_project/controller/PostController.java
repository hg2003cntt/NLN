package com.example.nln_project.controller;

import com.example.nln_project.model.Like;
import com.example.nln_project.model.Account;
import com.example.nln_project.model.Comment;
import com.example.nln_project.model.Post;
import com.example.nln_project.model.Notification;

import com.example.nln_project.repository.AccountRepo;
import com.example.nln_project.repository.CommentRepo;
import com.example.nln_project.repository.LikeRepo;
import com.example.nln_project.repository.NotificationRepo;
import com.example.nln_project.repository.PostRepo;

import com.example.nln_project.security.services.AccountDetailsImpl;
import com.example.nln_project.security.services.PostService;
import com.example.nln_project.security.services.NotificationService;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Map;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

//@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RestController
@RequestMapping("/api/posts")
public class PostController {

    @Autowired
    private PostService postService;

    @Autowired
    private PostRepo postRepo;

    @Autowired
    private LikeRepo likeRepo;

    @Autowired
    private CommentRepo commentRepo;

    @Autowired
    private AccountRepo accountRepo;

    @Autowired
    private NotificationService notificationService;


    @PostMapping("/createPost")
    public ResponseEntity createPost(@Valid @RequestBody Post post) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        AccountDetailsImpl userDetails = (AccountDetailsImpl) authentication.getPrincipal();
        post.setUserId(userDetails.getId());
        try{
            Post createdPost = postService.savePost(post);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdPost);
        }catch(Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @GetMapping("/getPostById/{postID}")
    public ResponseEntity<Post> getPostById(@PathVariable String postID) {
        try {
            Optional<Post> optionalPost = postRepo.findById(postID);
            if (optionalPost.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }

            Post post = optionalPost.get();
            
            // ✅ Cập nhật số lượng bình luận trước khi trả về
            long commentCount = postService.countComments(postID);
            post.setCmtCount((int) commentCount);
            
            return ResponseEntity.ok(post);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }


    @DeleteMapping("/deletePost/{id}")
    public ResponseEntity<?> deletePost(@PathVariable String id) {
        if (!postRepo.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Bài viết không tồn tại");
        }

        postRepo.deleteById(id);
        likeRepo.deleteByPostId(id);
        commentRepo.deleteByPostId(id);

        return ResponseEntity.ok("Bài viết đã được xóa thành công");
    }

    @PutMapping("/updatePost")
    public void updatePost(@RequestBody Post post) {
        //fetch the object using Id
        Post data = postRepo.findById(post.getId()).orElse(null);
        //check if null and update
        if (data != null) {
            data.setTitle(post.getTitle());
            data.setContent(post.getContent());
            data.setTopicId(post.getTopicId());
            data.setAuthor(post.getAuthor());
            data.setImage(post.getImage());
            postRepo.save(data);
        }
    }
    @GetMapping("/getAllPosts")
    public ResponseEntity<List<Post>> getAllPosts() {
        try{
            return ResponseEntity.status(HttpStatus.OK).body(postService.getAllPosts());
        }catch(Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/getPostsByTopic/{topicId}")
    public ResponseEntity<List<Post>> getPostByTopic(@PathVariable String topicId) {
        try{
            List<Post> posts = postRepo.findByTopicId(topicId);
            return ResponseEntity.status(HttpStatus.OK).body(posts);
        }catch(Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/search")
    public ResponseEntity<List<Post>> searchPosts(
            @RequestParam(required = false) String topic,
            @RequestParam(required = false) String search) {
        try {
            List<Post> posts;
            if (topic != null && search != null) {
                posts = postService.findByTopicIdAndTitleContainingIgnoreCase(topic, search);
            } else if (topic != null) {
                posts = postService.findByTopicId(topic);
            } else if (search != null) {
                posts = postService.findByTitleContainingIgnoreCase(search);
            } else {
                posts = postService.getAllPosts();
            }
            return ResponseEntity.ok(posts);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PostMapping("/{postId}/like")
    public ResponseEntity<Post> toggleLike(@PathVariable String postId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        AccountDetailsImpl userDetails = (AccountDetailsImpl) authentication.getPrincipal();
        String userId = userDetails.getId();
        String name = userDetails.getName();

        Optional<Like> existingLike = likeRepo.findByUserIdAndPostId(userId, postId);
        
        Post post = postRepo.findById(postId).orElseThrow();
        String postOwnerId = post.getUserId(); // Chủ bài viết

        if (existingLike.isPresent()) {
            likeRepo.deleteByUserIdAndPostId(userId, postId); // Bỏ like
        } else {
            likeRepo.save(new Like(userId, postId)); // Thêm like mới
            
            // ✅ Gửi thông báo cho chủ bài viết
            notificationService.notifyLikePost(
                postId, 
                postOwnerId,
                userId, 
                null, // Không có commentId
                name + " đã thích bài viết của bạn!"
            );
        }

        // Cập nhật số like trong bài viết
        int likeCount = likeRepo.countByPostId(postId);
        post.setLikeCount(likeCount);
        postRepo.save(post);

        return ResponseEntity.ok(post);
    }



    @PostMapping("/{postId}/comments")
    public ResponseEntity<Comment> addComment(@PathVariable String postId, @Valid @RequestBody Comment comment) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        AccountDetailsImpl userDetails = (AccountDetailsImpl) authentication.getPrincipal();

        String userId = userDetails.getId();
        String name = userDetails.getName();
        
        // Lấy avatar từ Account
        Account account = accountRepo.findById(userId).orElse(null);
        String avatar = (account != null) ? account.getAvatar() : null;

        comment.setUserId(userId);
        comment.setName(name);
        comment.setAvatar(avatar);
        comment.setPostId(postId);
        comment.setCreatedAt(System.currentTimeMillis());

        Comment savedComment = commentRepo.save(comment);

        // Cập nhật số lượng bình luận của bài viết
        long updatedCount = postService.countComments(postId);
        Post post = postRepo.findById(postId).orElseThrow();
        post.setCmtCount((int) updatedCount);
        postRepo.save(post);

        notificationService.notifyNewComment(postId, comment.getId(), userDetails.getId(), post.getUserId(), name + " đã bình luận bài viết của bạn!" );


        return ResponseEntity.ok(savedComment);
    }

    @GetMapping("/{postId}/comments")
    public ResponseEntity<List<Comment>> getComments(@PathVariable String postId) {
        List<Comment> comments = commentRepo.findByPostId(postId);
        Map<String, Comment> commentMap = new HashMap<>();

        // Lấy tất cả các comment và map theo ID
        for (Comment comment : comments) {

            Account user = accountRepo.findById(comment.getUserId()).orElse(null);
            comment.setName(user != null ? user.getName() : "Ẩn danh");
            comment.setAvatar(user != null ? user.getAvatar() : null);


            commentMap.put(comment.getId(), comment);
        }

        // Sắp xếp phản hồi vào danh sách replies của bình luận cha
        List<Comment> rootComments = new ArrayList<>();
        for (Comment comment : comments) {
            if (comment.getParentId() == null || comment.getParentId().isEmpty()) {
                rootComments.add(comment);
            } else {
                Comment parent = commentMap.get(comment.getParentId());
                if (parent != null) {
                    parent.getReplies().add(comment);
                }
            }
        }

        return ResponseEntity.ok(rootComments);
    }

    @DeleteMapping("/comments/{commentId}")
    public ResponseEntity<String> deleteComment(@PathVariable String commentId) {
        Optional<Comment> commentOpt = commentRepo.findById(commentId);
        if (commentOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Bình luận không tồn tại");
        }

        Comment comment = commentOpt.get();
        String postId = comment.getPostId();

        // Xóa tất cả bình luận con
        deleteCommentAndReplies(commentId);

        // ✅ Cập nhật tổng số bình luận của bài viết
        Post post = postRepo.findById(postId).orElseThrow();
        post.setCmtCount((int) postService.countComments(postId));
        postRepo.save(post);

        return ResponseEntity.ok("Bình luận đã được xóa");
    }

    // Hàm đệ quy để xóa bình luận và tất cả phản hồi của nó
    private void deleteCommentAndReplies(String commentId) {
        List<Comment> replies = commentRepo.findByParentId(commentId);
        for (Comment reply : replies) {
            deleteCommentAndReplies(reply.getId()); // Gọi đệ quy để xóa phản hồi con
        }
        commentRepo.deleteById(commentId);
    }

    @GetMapping("/getPostsByUser")
    public ResponseEntity<List<Post>> getPostsByUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        AccountDetailsImpl userDetails = (AccountDetailsImpl) authentication.getPrincipal();
        String userId = userDetails.getId();

        try {
            List<Post> posts = postService.getPostsByUserId(userId);
            return ResponseEntity.ok(posts);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }


    @PostMapping("/{postId}/reply")
    public ResponseEntity<Comment> replyToComment(@PathVariable String postId, @RequestBody Comment reply) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        AccountDetailsImpl userDetails = (AccountDetailsImpl) authentication.getPrincipal();

        reply.setUserId(userDetails.getId());
        reply.setName(userDetails.getName());
        reply.setPostId(postId);
        reply.setCreatedAt(System.currentTimeMillis());

        // Kiểm tra nếu có parentId thì đảm bảo comment cha tồn tại
        if (reply.getParentId() != null && !reply.getParentId().isEmpty()) {
            Optional<Comment> parentComment = commentRepo.findById(reply.getParentId());
            if (parentComment.isEmpty()) {
                return ResponseEntity.badRequest().body(null);
            }
        }

        // ✅ Lưu comment trước để có ID
        Comment savedReply = commentRepo.save(reply);

        // ✅ Gửi thông báo sau khi lưu thành công
        if (reply.getParentId() != null && !reply.getParentId().isEmpty()) {
            Optional<Comment> parentComment = commentRepo.findById(reply.getParentId());
            if (parentComment.isPresent()) {
                notificationService.notifyReplyComment(
                    postId,
                    savedReply.getId(),  // Đã có ID sau khi lưu
                    userDetails.getId(),
                    parentComment.get().getUserId(),
                    userDetails.getName()+ " đã phản hồi bạn!"
                );
            }
        }

        // ✅ Cập nhật tổng số bình luận cho bài viết
        Post post = postRepo.findById(postId).orElseThrow();
        post.setCmtCount((int) postService.countComments(postId));
        postRepo.save(post);

        return ResponseEntity.ok(savedReply);
    }


    @GetMapping("/notification/unread")
    public ResponseEntity<List<Map<String, Object>>> getUnreadNotifications() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        AccountDetailsImpl userDetails = (AccountDetailsImpl) authentication.getPrincipal();
        String userId = userDetails.getId();

        List<Notification> notifications = notificationService.getUnreadNotifications(userId);

        // Trả về danh sách thông báo kèm link
        List<Map<String, Object>> response = notifications.stream().map(notification -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", notification.getId());
            map.put("userId", notification.getUserId());
            map.put("senderId", notification.getSenderId());
            map.put("postId", notification.getPostId());
            map.put("commentId", notification.getCommentId());
            map.put("message", notification.getMessage());
            map.put("read", notification.isRead());
            map.put("createdAt", notification.getCreatedAt());
            map.put("link", notification.getLink()); // Trả về link từ Model
    
            return map;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/notification")
    public ResponseEntity<List<Notification>> getAllNotifications() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        AccountDetailsImpl userDetails = (AccountDetailsImpl) authentication.getPrincipal();
        String userId = userDetails.getId();

        List<Notification> notifications = notificationService.getAllNotifications(userId);
        return ResponseEntity.ok(notifications);
    }

    @PutMapping("/{notificationId}/read")
    @PostMapping("/{notificationId}/read")
    public ResponseEntity<String> markNotificationAsRead(@PathVariable String notificationId) {
        notificationService.markAsRead(notificationId);
        return ResponseEntity.ok("Thông báo đã được đánh dấu là đã đọc");
    }

}
