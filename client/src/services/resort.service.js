import axios from "axios";

const API_URL = "http://127.0.0.1:5000";

class ResortService {
  getCommentByResortID(resortID) {
    return axios.get(API_URL + `/comments/resorts/${resortID}`);
  }

  addComment(userID, resortID, rating, comment) {
    const payload = {
      ResortID: resortID,
      UserID: userID,
      Rating: rating,
      CommentText: comment,
    };
    return axios.post(API_URL + "/comments/resorts/new", payload, {
      headers: { "Content-Type": "application/json" },
    });
  }

  editComment(newContent, newRating, commentID, userID) {
    const payload = {
      ResortCommentID: commentID,
      UserID: userID,
      Rating: newRating,
      CommentText: newContent,
    };
    return axios.put(
      API_URL + `/comments/resorts/${commentID}/update`,
      payload,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  deleteComment(commentID, userID) {
    const payload = {
      UserID: userID,
    };
    return axios.delete(API_URL + `/comments/resorts/${commentID}/delete`, {
      data: payload,
      headers: { "Content-Type": "application/json" },
    });
  }

  getAllResorts() {
    return axios.get(API_URL + `/resorts/all`);
  }

  getResortByID(resortID) {
    return axios.get(API_URL + `/resorts/${resortID}`);
  }

  getFavoriteResorts(userID) {
    return axios.get(API_URL + `/resorts/favorites/${userID}`);
  }

  getRegisteredLessons(userID) {
    return axios.get(API_URL + `/lessons/registered/${userID}`);
  }

  addFavorites(userID, resortID) {
    const payload = {
      resort_id: resortID,
      user_id: userID,
    };
    return axios.post(API_URL + "/resorts/favorites/add", payload, {
      headers: { "Content-Type": "application/json" },
    });
  }

  deleteFavorites(userID, resortID) {
    const payload = {
      resort_id: resortID,
      user_id: userID,
    };

    return axios.delete(API_URL + "/resorts/favorites/delete", {
      data: payload,
      headers: { "Content-Type": "application/json" },
    });
  }

  getPopularResortsForBeginners() {
    return axios.get(API_URL + "/resorts/popular/beginner");
  }

  getPopularResortsForIntermediate() {
    return axios.get(API_URL + "/resorts/popular/beginner");
  }

  getPopularResortsForPros() {
    return axios.get(API_URL + "/resorts/popular/beginner");
  }
}

export default new ResortService();
