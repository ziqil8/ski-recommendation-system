import axios from "axios";

const API_URL = "http://127.0.0.1:5000";

class AuthService {
  getCurrentUser() {
    return JSON.parse(localStorage.getItem("user"));
  }

  handleLogin(email, password) {
    const payload = {
      email,
      password,
    };
    return axios.post(API_URL + "/users/login", payload, {
      headers: { "Content-Type": "application/json" },
    });
  }

  handleRegister(username, email, password) {
    const payload = {
      username,
      email,
      password,
    };
    return axios.post(API_URL + "/users/register", payload, {
      headers: { "Content-Type": "application/json" },
    });
  }
}

export default new AuthService();
