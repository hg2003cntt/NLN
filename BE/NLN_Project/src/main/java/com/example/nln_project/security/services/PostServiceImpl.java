package com.example.nln_project.security.services;

import com.example.nln_project.model.Post;
import com.example.nln_project.repository.PostRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class PostServiceImpl implements PostService {
    @Autowired
    private PostRepo postRepo;

    public Post savePost(Post post){
        post.setLikeCount(0);
        post.setCmtCount(0);
        post.setCreatedAt(new Date());

        return postRepo.save(post);
    }
    public List<Post> getAllPosts(){
        return postRepo.findAll();
    }
}
