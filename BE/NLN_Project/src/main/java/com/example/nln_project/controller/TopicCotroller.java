package com.example.nln_project.controller;

import com.example.nln_project.model.Topic;
import com.example.nln_project.payload.response.MessageResponse;
import com.example.nln_project.repository.PostRepo;
import com.example.nln_project.repository.TopicRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/topics")
public class TopicCotroller {
    @Autowired
    TopicRepo topicRepo;

    @Autowired
    PostRepo postRepo;

//    @GetMapping("/topics")
//    public List<Topic> getAllTopics() {
//        return topicRepo.findAll();  // Trả về danh sách chủ đề
//    }
    @GetMapping("/getAlltopics")
    public List<Map<String, String>> getAllTopics() {
        return topicRepo.findAll().stream()
                .map(topic -> Map.of("topicID", topic.getId(), "name", topic.getName()))
                .collect(Collectors.toList());
}


    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/createTopic")
    public ResponseEntity<?>createTopic(@RequestBody Topic topic) {
        if (!topicRepo.existsByName(topic.getName())) {
        return new ResponseEntity<>(topicRepo.save(topic), HttpStatus.CREATED);
        }else return ResponseEntity.badRequest().body(new MessageResponse("Topic already exists"));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/deleteTopic/{id}")
    public ResponseEntity<?> deleteTopic(@PathVariable String id) {
        // Kiểm tra xem topic có tồn tại không
        if (!topicRepo.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        // Xóa tất cả các bài viết có topicId tương ứng
        postRepo.deleteByTopicId(id);

        // Xóa topic
        topicRepo.deleteById(id);

        return ResponseEntity.ok("Topic and related posts deleted successfully");
    }

}
