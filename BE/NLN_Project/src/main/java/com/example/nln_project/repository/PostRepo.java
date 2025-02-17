package com.example.nln_project.repository;

import com.example.nln_project.model.Post;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface PostRepo extends MongoRepository<Post, String> {
    void deleteByTopicId(String topicId);
}
