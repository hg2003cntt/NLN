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
        const response = await axios.get(`${this.BASE_URL}/users/get-logged-in-profile-info`, {
            headers: this.getHeader(),
        });
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

    /** Thêm getUserInfo để tránh lỗi */
    static async getUserInfo() {
        return this.getUserProfile();
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

    /** CONSULTATION */
    static async submitConsultationRequest(consultationData) {
        const response = await axios.post(`${this.BASE_URL}/consultations`, consultationData, {
            headers: this.getHeader(),
        });
        return response.data;
    }

    /** AUTHENTICATION CHECKER */
    static logout() {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
    }

    static isAuthenticated() {
        const token = localStorage.getItem("token");
        return !!token;
    }

    static isAdmin() {
        const role = localStorage.getItem("role");
        return role === "ADMIN";
    }

    static isUser() {
        const role = localStorage.getItem("role");
        return role === "USER";
    }
}
