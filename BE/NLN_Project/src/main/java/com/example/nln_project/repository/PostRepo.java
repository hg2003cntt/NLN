package com.example.nln_project.repository;

import com.example.nln_project.model.Post;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface PostRepo extends MongoRepository<Post, String> {
    void deleteByTopicId(String topicId);
    Integer countPostsByTopicId(String topicId);
    List<Post> findByTopicId(String topicId);
}
