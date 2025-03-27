package com.example.nln_project.security.services;

import com.example.nln_project.model.Account;
import com.example.nln_project.model.Post;
import com.example.nln_project.model.Comment;

import com.example.nln_project.repository.AccountRepo;
import com.example.nln_project.repository.PostRepo;
import com.example.nln_project.repository.CommentRepo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.security.core.Authentication;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.bson.Document;


import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class PostServiceImpl implements PostService {
    @Autowired
    private PostRepo postRepo;

    @Autowired  
    private CommentRepo commentRepo;

    @Autowired
    private NotificationService notificationService; // Thêm NotificationService

    @Autowired
    private AccountRepo accountRepo;

    @Autowired
    private MongoTemplate mongoTemplate;



    public Post savePost(Post post) {
        post.setLikeCount(0);
        post.setCmtCount(0);
        post.setCreatedAt(new Date());
    
        // Lưu bài viết trước khi sử dụng ID
        Post savedPost = postRepo.save(post);
    
        // Lấy thông tin người đăng bài
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        AccountDetailsImpl userDetails = (AccountDetailsImpl) authentication.getPrincipal();
        String userName = userDetails.getName(); // Lấy tên người đăng bài
    
        // Gửi thông báo cho admin
        String adminId = "67b352bc5de5c8380e5bded1"; // Thay bằng ID thực tế của admin
        notificationService.notifyNewPost(
            savedPost.getId(),     // ✅ Dùng `savedPost` đã lưu
            savedPost.getUserId(), // ✅ Lấy ID từ `savedPost`
            List.of(adminId),  
            userName + " đã đăng một bài viết mới!"
        );
    
        return savedPost;
    }
    

    public long countComments(String postId) {
        // Chỉ lấy bình luận cha (parentId == null)
        List<Comment> parentComments = commentRepo.findByPostId(postId)
                .stream()
                .filter(comment -> comment.getParentId() == null || comment.getParentId().isEmpty())
                .toList();

        long totalComments = parentComments.size(); //  Chỉ đếm bình luận cha

        //  Đếm bình luận con chỉ từ cha
        for (Comment parent : parentComments) {
            totalComments += countReplies(parent);
        }

        //  Lưu số lượng bình luận vào Post
        Post post = postRepo.findById(postId).get();
        post.setCmtCount(totalComments);
        postRepo.save(post);

        return totalComments;
    }
    
    // ✅ Đếm cả bình luận cha lẫn con đúng cách
    private long countReplies(Comment comment) {
        if (comment == null) return 0;
    
        List<Comment> replies = commentRepo.findByParentId(comment.getId());
        long count = replies.size(); // Đếm số bình luận con trực tiếp

        for (Comment reply : replies) {
            count += countReplies(reply); // Đếm thêm bình luận con cấp tiếp theo
        }
    
        return count;
    }
    @Override
    public List<Post> getTopInteractedPosts(int limit) {
        List<Post> allPosts = postRepo.findAll();

        return allPosts.stream()
                .sorted((a, b) -> Long.compare(
                        b.getLikeCount() + b.getCmtCount(),
                        a.getLikeCount() + a.getCmtCount()
                ))
                .limit(limit)
                .toList();
    }

    @Override
    public List<Map<String, Object>> getTopWriters(int limit) {
        Aggregation aggregation = Aggregation.newAggregation(
                Aggregation.group("userId").count().as("postCount"),
                Aggregation.sort(Sort.by(Sort.Direction.DESC, "postCount")),
                Aggregation.limit(limit)
        );

        AggregationResults<Document> results = mongoTemplate.aggregate(
                aggregation, "posts", Document.class
        );

        return results.getMappedResults().stream().map(doc -> {
            String userId = (String) doc.get("_id");
            long count = ((Number) doc.get("postCount")).longValue();

            Account acc = accountRepo.findById(userId).orElse(null);

            Map<String, Object> map = new HashMap<>();
            map.put("userId", userId);
            map.put("name", acc != null ? acc.getName() : "Không xác định");
            map.put("postCount", count);
            return map;
        }).collect(Collectors.toList());
    }
    @Override
    public List<Map<String, Object>> getTopCommenters(int limit) {
        Aggregation aggregation = Aggregation.newAggregation(
                Aggregation.group("userId").count().as("commentCount"),
                Aggregation.sort(Sort.by(Sort.Direction.DESC, "commentCount")),
                Aggregation.limit(limit)
        );

        AggregationResults<org.bson.Document> results = mongoTemplate.aggregate(
                aggregation, "comments", org.bson.Document.class
        );

        return results.getMappedResults().stream().map(doc -> {
            String userId = (String) doc.get("_id");
            long count = ((Number) doc.get("commentCount")).longValue();

            Account acc = accountRepo.findById(userId).orElse(null);

            Map<String, Object> map = new HashMap<>();
            map.put("userId", userId);
            map.put("name", acc != null ? acc.getName() : "Không xác định");
            map.put("commentCount", count);
            return map;
        }).collect(Collectors.toList());
    }








    public List<Post> getAllPosts(){
        return postRepo.findAll();
    }

    @Override
    public List<Post> getPostsByUserId(String userId) {
        return postRepo.findByUserId(userId);
    }
    public List<Post> findByTopicId(String topicId) {
        return postRepo.findByTopicId(topicId);
    }

    public List<Post> findByTitleContainingIgnoreCase(String title) {
        return postRepo.findByTitleContainingIgnoreCase(title);
    }

    public List<Post> findByTopicIdAndTitleContainingIgnoreCase(String topicId, String title) {
        return postRepo.findByTopicIdAndTitleContainingIgnoreCase(topicId, title);
    }


}
