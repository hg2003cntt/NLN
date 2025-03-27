package com.example.nln_project.security.services;

import com.example.nln_project.model.Comment;
import com.example.nln_project.model.Post;

import java.util.List;
import java.util.Map;


public interface PostService {
    Post savePost(Post post);
    long countComments(String postId);
    List<Post> getAllPosts();
    List<Post> getPostsByUserId(String userId);


    List<Post> findByTopicId(String topicId);

    List<Post> findByTitleContainingIgnoreCase(String title);

    List<Post> findByTopicIdAndTitleContainingIgnoreCase(String topicId, String title);

    List<Post> getTopInteractedPosts(int limit);

    List<Map<String, Object>> getTopWriters(int limit);

    List<Map<String, Object>> getTopCommenters(int limit);

}
