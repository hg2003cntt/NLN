package com.example.nln_project.controller;

import com.example.nln_project.model.Post;
import com.example.nln_project.repository.PostRepo;
import com.example.nln_project.security.services.AccountDetailsImpl;
import com.example.nln_project.security.services.PostService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/posts")
public class PostController {

    @Autowired
    private PostService postService;

    @Autowired
    private PostRepo postRepo;


    @PostMapping("/createPost")
    public ResponseEntity createPost(@Valid @RequestBody Post post) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        AccountDetailsImpl userDetails = (AccountDetailsImpl) authentication.getPrincipal();
        post.setUserID(userDetails.getId());
        try{
            Post createdPost = postService.savePost(post);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdPost);
        }catch(Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @GetMapping("/getPostById/{postID}")
    public ResponseEntity<Post> getPostById(@PathVariable String postID) {
        try{
            return ResponseEntity.status(HttpStatus.OK).body(postRepo.findById(postID).get());
        }catch(Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }


    @DeleteMapping("/deletePost/{id}")
    public void deletePost(@PathVariable String id) {
        postRepo.deleteById(id);
    }

    @PutMapping("/updatePost")
    public void updateStudent(@RequestBody Post post) {
        //fetch the object using Id
        Post data = postRepo.findById(post.getId()).orElse(null);
        //check if null and update
        if (data != null) {
            data.setTitle(post.getTitle());
            data.setContent(post.getContent());
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

    @PostMapping("/like/{id}")
    public ResponseEntity<Post> likePost(@PathVariable String id) {
        Optional<Post> optionalPost = postRepo.findById(id);
        if (optionalPost.isPresent()) {
            Post post = optionalPost.get();
            post.setLikeCount(post.getLikeCount() + 1);
            postRepo.save(post);
            return ResponseEntity.ok(post);
        }
        return ResponseEntity.notFound().build();
    }

}
