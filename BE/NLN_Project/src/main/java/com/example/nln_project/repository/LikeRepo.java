package com.example.nln_project.repository;

import com.example.nln_project.model.Like;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface LikeRepo extends MongoRepository<Like, String> {
    Optional<Like> findByUserIdAndPostId(String userId, String postId);
    void deleteByUserIdAndPostId(String userId, String postId);
    int countByPostId(String postId);
    void deleteByPostId(String postId);
}
