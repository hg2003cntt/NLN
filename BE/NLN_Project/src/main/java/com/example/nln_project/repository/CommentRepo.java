package com.example.nln_project.repository;

import com.example.nln_project.model.Comment;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface CommentRepo extends MongoRepository<Comment, String> {
    List<Comment> findByPostId(String postId);
    void deleteByPostId(String postId);
}
