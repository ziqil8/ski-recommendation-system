import axios from "axios";

const API_URL = "http://127.0.0.1:5000";

class LessonService {
  getLessonByResortID(resortID) {
    return axios.get(API_URL + `/lessons/resorts/${resortID}`);
  }

  getLessonByLessonID(lessonID) {
    return axios.get(API_URL + `/lessons/${lessonID}`);
  }

  getCommentByLessonID(lessonID) {
    return axios.get(API_URL + `/comments/instructors/${lessonID}`);
  }

  addComment(userID, instructorID, rating, comment) {
    const payload = {
      InstructorID: instructorID,
      UserID: userID,
      Rating: rating,
      CommentText: comment,
    };
    return axios.post(API_URL + "/comments/instructors/new", payload, {
      headers: { "Content-Type": "application/json" },
    });
  }

  editComment(newContent, newRating, commentID, userID) {
    const payload = {
      InstructorCommentID: commentID,
      UserID: userID,
      Rating: newRating,
      CommentText: newContent,
    };
    return axios.put(
      API_URL + `/comments/instructors/${commentID}/update`,
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
    return axios.delete(API_URL + `/comments/instructors/${commentID}/delete`, {
      data: payload,
      headers: { "Content-Type": "application/json" },
    });
  }

  registerLesson(userID, lessonID) {
    const payload = {
      UserID: userID,
      LessonID: lessonID,
    };
    return axios.post(API_URL + "/lessons/register", payload, {
      headers: { "Content-Type": "application/json" },
    });
  }

  unregisterLesson(userID, lessonID) {
    const payload = {
      UserID: userID,
      LessonID: lessonID,
    };
    return axios.post(API_URL + "/lessons/cancel", payload, {
      headers: { "Content-Type": "application/json" },
    });
  }
}

export default new LessonService();
