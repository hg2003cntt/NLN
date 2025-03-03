import axios from "axios";

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


    /** ARTICLES */

    static async getTopics() {
        const response = await axios.get(`${this.BASE_URL}/api/topics/getAlltopics`, {
            headers: this.getHeader()
        });
        return response.data;
    }

    static async postArticle(articleData) {
        const response = await axios.post(`${this.BASE_URL}/api/posts/createPost`, articleData, {
            headers: this.getHeader()
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
    

    static async addCommentToArticle(articleId, commentData) {
        const response = await axios.post(`${this.BASE_URL}/articles/${articleId}/comments`, commentData, {
            headers: this.getHeader(),
        });
        return response.data;
    }

     /** CONSULTATION - API ĐĂNG KÝ TƯ VẤN */
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
        return role === 'ADMIN'
    }

    static isUser() {
        const role = localStorage.getItem('roles')
        return role === 'USER'
    }
}
