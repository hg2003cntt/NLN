package com.example.nln_project.security.services;

import com.example.nln_project.model.Post;
import com.example.nln_project.model.Comment;

import com.example.nln_project.repository.PostRepo;
import com.example.nln_project.repository.CommentRepo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class PostServiceImpl implements PostService {
    @Autowired
    private PostRepo postRepo;

    @Autowired  
    private CommentRepo commentRepo;


    public Post savePost(Post post){
        post.setLikeCount(0);
        post.setCmtCount(0);
        post.setCreatedAt(new Date());

        return postRepo.save(post);
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
