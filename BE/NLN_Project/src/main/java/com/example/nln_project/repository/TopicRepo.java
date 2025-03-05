package com.example.nln_project.repository;

import com.example.nln_project.model.Post;
import com.example.nln_project.model.Topic;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface TopicRepo extends MongoRepository<Topic, String> {
    Boolean existsByName(String name);

    void findById(int id);
}
