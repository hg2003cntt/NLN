import axios from "axios";

export default class ApiService {

   // static BASE_URL = "http://localhost:30003000"

    static BASE_URL = "http://localhost:8080"


    static getHeader() {
        const token = localStorage.getItem("token");
        return {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        };
    }

    /** AUTH */
    static async registerUser(registration) {
        const response = await axios.post(`${this.BASE_URL}/api/auth/register`, registration);
        return response.data;
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

    // static async postArticle(articleData) {
    //     const response = await axios.post(`${this.BASE_URL}/createPost`, articleData);//, {
    //       //  headers: this.getHeader()
    //    //
    // }
    static async getTopics() {
        const response = await axios.get(`${this.BASE_URL}/api/topics/getAlltopics`, {
            headers: this.getHeader()
        });
        return response.data;
    }

    static async postArticle(articleData) {
        const response = await axios.post(`${this.BASE_URL}/api/posts/createPost`, articleData, {
            headers: {
                "Content-Type": "application/json"
            }
        });
        return response.data;
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
