import axios from "axios";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime); // Hỗ trợ hiển thị thời gian tương đối (VD: "2 giờ trước")

export default class ApiService {

    static BASE_URL = "http://localhost:8080"


    static getHeader() {
        const token = localStorage.getItem("token");
        return {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        };
    }

    /** AUTH */
     static async registerUser(registrationData) {
         try {
             const response = await axios.post(`${this.BASE_URL}/api/auth/signup`, registrationData, {
                 headers: {
                     "Content-Type": "application/json",
                 },
             });
             return response.data; // Đăng ký thành công
         } catch (error) {
             if (error.response && error.response.data) {
                 // Lấy dữ liệu phản hồi lỗi từ server
                 const errorData = error.response.data;

                 // Kiểm tra nếu errorData là object và có thuộc tính message
                 const errorMessage = typeof errorData === "string"
                     ? errorData
                     : errorData.message || JSON.stringify(errorData);

                 // Xử lý lỗi cụ thể từ backend
                 if (errorMessage.toLowerCase().includes("username is already taken")) {
                     throw new Error("Tên người dùng đã tồn tại, vui lòng chọn tên khác.");
                 }
                 if (errorMessage.toLowerCase().includes("email is already in use")) {
                     throw new Error("Email này đã được đăng ký, vui lòng sử dụng email khác.");
                 }
             }

             // Nếu không có thông tin lỗi chi tiết từ backend
             throw new Error("Đăng ký thất bại, vui lòng thử lại.");
         }
     }



    static async loginUser(loginDetails) {
        const response = await axios.post(`${this.BASE_URL}/api/auth/login`, loginDetails);
        return response.data;
    }

    /** USERS */
    static async getAllUsers() {
        const response = await axios.get(`${this.BASE_URL}/users/all`, {
            headers: this.getHeader(),
        });
        return response.data;
    }

    static async getUserProfile() {
            try {
                const response = await axios.get(`${this.BASE_URL}/api/auth/me`, {
                    headers: this.getHeader(),
                    withCredentials: true,
                });
                return response.data;
            } catch (error) {
                console.error("Lỗi lấy thông tin user:", error.response?.data || error.message);
                throw error;
            }
        }
        static async uploadUserAvatar(data) {
            const response = await axios.post(
                `${this.BASE_URL}/api/user/upload-avatar`,
                data,
                {
                    headers: this.getHeader(),
                }
            );
            return response.data;
        }
        static async updateUserProfile(data) {
            const response = await axios.put(
                `${this.BASE_URL}/api/user/update-profile`,
                data,
                {
                    headers: this.getHeader(),
                }
            );
            return response.data;
        }
        static async updateUserPassword(data) {
                    const response = await axios.put(
                        `${this.BASE_URL}/api/user/update-password`,
                        data,
                        {
                            headers: this.getHeader(),
                        }
                    );
                    return response.data;
                }


    static async getUser(userId) {
        const response = await axios.get(`${this.BASE_URL}/users/get-by-id/${userId}`, {
            headers: this.getHeader(),
        });
        return response.data;
    }

    static async getUserBookings(userId) {
        const response = await axios.get(`${this.BASE_URL}/users/get-user-bookings/${userId}`, {
            headers: this.getHeader(),
        });
        return response.data;
    }

    static async deleteUser(userId) {
        const response = await axios.delete(`${this.BASE_URL}/users/delete/${userId}`, {
            headers: this.getHeader(),
        });
        return response.data;
    }


   /*topic*/

    static async getTopics() {
        const response = await axios.get(`${this.BASE_URL}/api/topics/getAlltopics`, {
            headers: this.getHeader()
        });
        return response.data;
    }

    static async getTopicStatistics() {
        const response = await axios.get(`${this.BASE_URL}/api/topics/statistics`, {
            headers: this.getHeader()
        });
        return response.data;
    }

    static async getTopicById(topicId) {
        try {
            const response = await axios.get(`${this.BASE_URL}/api/topics/getTopicById/${topicId}`, {
                headers: this.getHeader(),
            });
            return response.data;
        } catch (error) {
            console.error("Lỗi khi lấy chủ đề theo id:", error);
            throw error;
        }
    }

    static async createTopic(topic) {
        try {
            const response = await axios.post(
                `${this.BASE_URL}/api/topics/createTopic`,
                topic,
                { headers: this.getHeader() }
            );
            return response.data;
        } catch (error) {
            console.error("Lỗi khi tạo chủ đề:", error.response?.data || error.message);
            throw error;
        }
    }

    static async updateTopic(topicId, updatedData) {
        const response = await axios.put(`${this.BASE_URL}/api/topics/updateTopic/${topicId}`, updatedData, {
            headers: this.getHeader()
        });
        return response.data;
    }
    

    static async deleteTopic(id) {
        try {
            const response = await axios.delete(
                `${this.BASE_URL}/api/topics/deleteTopic/${id}`,
                { headers: this.getHeader() }
            );
            return response.data;
        } catch (error) {
            console.error("Lỗi khi xóa chủ đề:", error.response?.data || error.message);
            throw error;
        }
    }
     /** ARTICLES */

    static async postArticle(articleData) {
        const response = await axios.post(`${this.BASE_URL}/api/posts/createPost`, articleData, {
            headers: this.getHeader(),
        });
        return response.data;
    }

    static async getPostById(postId) {
        try {
            const response = await axios.get(`${this.BASE_URL}/api/posts/getPostById/${postId}`, {
                headers: this.getHeader(),
            });
            return response.data;
        } catch (error) {
            console.error("Lỗi khi lấy bài viết:", error);
            throw error;
        }
    }
    

    static async getPostsByTopic(topicId) {
        try {
            const response = await axios.get(`${this.BASE_URL}/api/posts/getPostsByTopic/${topicId}`, {
                headers: this.getHeader(),
            });
            return response.data;
        } catch (error) {
            console.error("Lỗi khi lấy bài viết theo topic:", error);
            throw error;
        }
    }

    static async searchPosts(topic, keyword) {
        try {
            const params = new URLSearchParams();
            if (topic) params.append("topic", topic);
            if (keyword) params.append("search", keyword);
    
            const response = await axios.get(`${this.BASE_URL}/api/posts/search?${params.toString()}`, {
                headers: this.getHeader(),
            });
    
            return response.data;
        } catch (error) {
            console.error("Lỗi khi tìm kiếm bài viết:", error);
            throw error;
        }
    }
    
    static async getAllPosts() {
        try {
            const response = await axios.get(`${this.BASE_URL}/api/posts/getAllPosts`, {
                headers: this.getHeader(),
            });
            return response.data;
        } catch (error) {
            console.error("Lỗi khi lấy danh sách bài viết:", error);
            throw error;
        }
    }
    static async updateArticle(articleData){
        const response = await axios.put(`${this.BASE_URL}/api/posts/updatePost`,articleData, {
            headers: this.getHeader(),
            withCredentials: true,
        });
        return response.data;
    }
    
    static async deleteArticle(id) {
        try {
            const response = await axios.delete(`${this.BASE_URL}/api/posts/deletePost/${id}`, {
                headers: this.getHeader(),
               // withCredentials: true,
            });
            return response.data; // Nhận phản hồi từ API
        } catch (error) {
            console.error("Lỗi khi xóa bài viết:", error.response?.data || error.message);
            throw error;
        }
    }
    

    static async likeArticle(articleId) {
        try {
            console.log("id: ", articleId);
            const response = await axios.post(
                `${this.BASE_URL}/api/posts/${articleId}/like`,
                null,  // Không có body nên để null
                {
                    headers: this.getHeader(),
                }
            );
            return response.data;
        } catch (error) {
            console.error("Lỗi khi cập nhật lượt like:", error);
            throw error;
        }
    }
    
    /** COMMENTS */
    static async addComment(articleId, commentData) {
        try {
            const response = await axios.post(
                `${this.BASE_URL}/api/posts/${articleId}/comments`,
                commentData,
                {
                    headers: this.getHeader(),
                }
            );
            return response.data;
        } catch (error) {
            console.error("Lỗi khi thêm comment:", error.response?.data || error.message);
            throw error;
        }
    }

    static async getCommentsByPost(articleId) {
        try {
            const response = await axios.get(
                `${this.BASE_URL}/api/posts/${articleId}/comments`,
                { headers: this.getHeader() }
            );
    
            return response.data.map(comment => ({
                ...comment,
                authorName: comment.user?.name || "Ẩn danh",
                formattedTime: dayjs(comment.createdAt).fromNow(),
                replies: comment.replies?.map(reply => ({
                    ...reply,
                    authorName: reply.user?.name || "Ẩn danh",
                    formattedTime: dayjs(reply.createdAt).fromNow(),
                })) || [],
            }));
        } catch (error) {
            console.error("Lỗi khi lấy danh sách comment:", error.response?.data || error.message);
            throw error;
        }
    }
    
    /** Xóa bình luận */
    static async deleteComment(commentId) {
        try {
            const response = await axios.delete(
                `${this.BASE_URL}/api/posts/comments/${commentId}`, // Xóa dấu `}` thừa
                {
                    headers: this.getHeader(),
                }
            );
            return response.data;
        } catch (error) {
            console.error("Lỗi khi xóa comment:", error.response?.data || error.message);
            throw error;
        }
    }

    static async replyToComment(articleId, parentId, replyContent) {
        try {
            const payload = { content: replyContent };
            if (parentId !== undefined) payload.parentId = parentId; // Chỉ thêm nếu có
    
            const response = await axios.post(
                `${this.BASE_URL}/api/posts/${articleId}/reply`,
                payload,
                { headers: this.getHeader() }
            );
            return response.data;
        } catch (error) {
            console.error("Lỗi khi gửi phản hồi:", error.response?.data || error.message);
            throw error;
        }
    }
    
    

    static async getCommentsWithReplies(articleId) {
        try {
            const response = await axios.get(
                `${this.BASE_URL}/api/posts/${articleId}/commentsWithReplies`,
                { headers: this.getHeader() }
            );
            return response.data.map(comment => ({
                ...comment,
                formattedTime: dayjs(comment.createdAt).fromNow(),
                replies: comment.replies?.map(reply => ({
                    ...reply,
                    formattedTime: dayjs(reply.createdAt).fromNow(),
                })) || [],
            }));
        } catch (error) {
            console.error("Lỗi khi lấy danh sách bình luận kèm phản hồi:", error.response?.data || error.message);
            throw error;
        }
    }

    static async deleteReply(commentId) {
        try {
            const response = await axios.delete(
                `${this.BASE_URL}/api/posts/comments/${commentId}`,
                { headers: this.getHeader() }
            );
            return response.data;
        } catch (error) {
            console.error("Lỗi khi xóa phản hồi:", error.response?.data || error.message);
            throw error;
        }
    }
    
    
    

        static async submitConsultationRequest(consultationData) {
            try {
                const formattedData = {
                    ...consultationData,
                    dateOfBirth: consultationData.dateOfBirth.split("T")[0], // Định dạng `YYYY-MM-DD`
                };

                const response = await axios.post(
                    `${this.BASE_URL}/consultations/register`,
                    formattedData,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`, // Gửi token
                            "Content-Type": "application/json",
                        },
                        withCredentials: true,  // Hỗ trợ xác thực
                    }
                );

                return response.data;
            } catch (error) {
                console.error("Lỗi khi gửi yêu cầu tư vấn:", error.response?.data || error.message);
                throw error;
            }
        }



        /** CONSULTATION - API LẤY DANH SÁCH TƯ VẤN */
        static async getUserConsultations() {
            const response = await axios.get(`${this.BASE_URL}/api/consultations/myrequests`, {
                headers: this.getHeader(),
                withCredentials: true,
            });
            return response.data;
        }

        static async getAllConsultationRequests() {
            try {
                const response = await axios.get(`${this.BASE_URL}/consultations/getAllRequests`, {
                    headers: this.getHeader(),
                });
                return response.data;
            } catch (error) {
                console.error("Lỗi khi lấy danh sách yêu cầu tư vấn:", error.response?.data || error.message);
                throw error;
            }
        }

        static async updateConsultationStatus(id, newStatus) {
            try {
                const response = await axios.put(
                    `${this.BASE_URL}/consultations/${id}/status`,
                    { status: newStatus },
                    { headers: this.getHeader() }
                );
                return response.data;
            } catch (error) {
                console.error("Lỗi khi cập nhật trạng thái tư vấn:", error.response?.data || error.message);
                throw error;
            }
        }
        

        /** CUSTOMER MANAGEMENT */

        static async searchCustomerByPhone(phone) {
            const response = await axios.get(`${this.BASE_URL}/consultations/admin/search?phone=${phone}`, {
                headers: this.getHeader(),
            });
            return response.data;
        }

        static async updateCustomerPhone(id, newPhone) {
            const response = await axios.put(`${this.BASE_URL}/consultations/${id}/update-phone`,
                newPhone, 
                { headers: this.getHeader() }
            );
            return response.data;
        }
        

    /** AUTHENTICATION CHECKER */
    static logout() {
        localStorage.removeItem('token')
        localStorage.removeItem('roles')
    }

    static isAuthenticated() {
        const token = localStorage.getItem("token");
        return !!token;
    }

    static isAdmin() {
        const role = localStorage.getItem('roles')
        return role === 'ROLE_ADMIN'
    }

    static isUser() {
        const role = localStorage.getItem('roles')
        return role === 'ROLE_USER'
    }
}
