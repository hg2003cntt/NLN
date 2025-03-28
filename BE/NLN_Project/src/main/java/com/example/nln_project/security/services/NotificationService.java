package com.example.nln_project.security.services;

import com.example.nln_project.model.Account;
import com.example.nln_project.model.Notification;
import com.example.nln_project.repository.AccountRepo;
import com.example.nln_project.repository.NotificationRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Date;


@Service
public class NotificationService {
    @Autowired
    private NotificationRepo notificationRepo;

    @Autowired
    private AccountRepo accountRepo;

    // Gửi thông báo khi có bài viết mới
    public void notifyNewPost(String postId, String senderId, List<String> followerIds, String title) {
        for (String userId : followerIds) {
            Notification notification = new Notification(
                userId,
                senderId,   
                postId,
                null,
                title
            );
            notificationRepo.save(notification);
        }
    }

    // Gửi thông báo khi có bình luận mới
    public void notifyNewComment(String postId, String commentId, String senderId, String receiverId, String commentContent) {
        if (!senderId.equals(receiverId)) { // Không gửi thông báo nếu bình luận của chính chủ bài viết
            Notification notification = new Notification(
                receiverId,
                senderId,
                postId,
                commentId,
                commentContent
            );
            notification.setCommentId(commentId); // ✅ Thêm commentId vào thông báo

            notificationRepo.save(notification);
        }
    }

    // Gửi thông báo khi có phản hồi bình luận
    public void notifyReplyComment(String postId, String commentId, String senderId, String receiverId, String replyContent) {
        if (!senderId.equals(receiverId)) { // Không gửi thông báo nếu trả lời chính mình
            Notification notification = new Notification(
                receiverId,
                senderId,
                postId,
                commentId,
                replyContent
            );
            notificationRepo.save(notification);
        }
    }

    // Gửi thông báo khi bài viết được thích
    public void notifyLikePost(String postId, String senderId, String receiverId, String commentId, String content) {
        if (!senderId.equals(receiverId)) { // Không gửi thông báo nếu tự like bài viết của mình
            Notification notification = new Notification(
                    receiverId,
                    senderId,
                    postId,
                    commentId,
                    content
            );
            notification.setCreatedAt(new Date(System.currentTimeMillis())); // Chuyển long thành Date
            notificationRepo.save(notification);
        }
    }
    

    public void notifyReportedUser(String postId, String cmtId, String reportedUserId) {
        // Nếu vi phạm, gửi thông báo cho người bị báo cáo
        String noti = "";
        if (cmtId != null) {
            noti = "Bình luận ";
        }else noti = "Bài viết " ;
        noti += "của bạn bị xóa do vi phạm tiêu chuẩn cộng đồng. Vi phạm 3 lần sẽ bị khóa tài khoản. Đây là lần vi phạm thứ: ";


        Account account = accountRepo.findById(reportedUserId).get();
        try{
            int violationCount = account.getViolationCount()+1;
            if (violationCount==3) account.setStatus("Bị khóa");
            System.out.println("lần vi phạm:"+violationCount);
            account.setViolationCount(violationCount);
            accountRepo.save(account);
            noti+=violationCount;
            System.out.println(noti);
        }catch (Exception e){
            System.out.println(e);
        }

        Notification notification = new Notification(
                reportedUserId,
                null,
                postId,
                cmtId,
                noti
        );
        notificationRepo.save(notification);
    }

    // Đánh dấu thông báo là đã đọc
    public void markAsRead(String notificationId) {
        Notification notification = notificationRepo.findById(notificationId).orElse(null);
        if (notification != null) {
            notification.setRead(true);
            notificationRepo.save(notification);
        }
    }

    // Lấy thông báo chưa đọc của người dùng
    public List<Notification> getUnreadNotifications(String userId) {
        System.out.print(notificationRepo.findByUserIdAndIsReadFalse(userId));
        return notificationRepo.findByUserIdAndIsReadFalse(userId);
    }

    // Lấy tất cả thông báo của người dùng
    public List<Notification> getAllNotifications(String userId) {
        return notificationRepo.findByUserIdOrderByCreatedAtDesc(userId);
    }
}
