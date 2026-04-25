import {
  faGlobe,
  faLocationDot,
  faPaperPlane,
  faSackDollar,
  faStar,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Grid2,
  IconButton,
  InputBase,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Rating,
  Typography,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CommentItem from "./CommentItem";
import { UserContext } from "../store/userContext";
import AuthService from "../services/auth.service";
import { toast } from "react-toastify";
import avatar_img from "../assets/avatar.svg";
import lessonService from "../services/lesson.service";

const equipmentTypeMap = {
  snowboard: "Snowboard",
  ski: "Ski",
};

const levelMap = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  difficult: "Difficult",
};

const lessonTypeMap = {
  group: "Group",
  individual: "Individual",
};

const LessonDetail = () => {
  const { lessonID } = useParams();
  const { user, myLessonsSet } = useContext(UserContext);
  const [lessonDetail, setLessonDetail] = useState(null);
  const [commentList, setCommentList] = useState([]);
  const [rating, setRating] = useState(3);
  const [comment, setComment] = useState("");
  const [registeredCount, setRegisteredCount] = useState(0);
  const [registered, setRegistered] = useState(myLessonsSet.has(lessonID));

  const currentUser = user || AuthService.getCurrentUser();
  const handleEditComment = async (newContent, newRating, commentID, idx) => {
    try {
      const res = await lessonService.editComment(
        newContent,
        newRating,
        commentID,
        currentUser.UserID
      );
      if (res.status >= 400) {
        toast.error("Failed to edit comment.", { hideProgressBar: true });
      } else {
        const newCommentList = [...commentList];
        newCommentList[idx].Rating = Number(newRating);
        newCommentList[idx].CommentText = newContent;
        setCommentList(newCommentList);
        toast.success("Edit the comment successfully.", {
          hideProgressBar: true,
        });
      }
    } catch (error) {
      toast.error("Failed to edit comment.", { hideProgressBar: true });
      console.log(error);
    }
  };

  const handleDeleteComment = async (comment, idx) => {
    try {
      const res = await lessonService.deleteComment(
        comment.InstructorCommentID,
        currentUser.UserID
      );
      if (res.status >= 400) {
        toast.error("Failed to delete comment.", { hideProgressBar: true });
      } else {
        const newCommentList = [...commentList];
        newCommentList.splice(idx, 1);
        setCommentList(newCommentList);
        toast.success("Delete the comment successfully.", {
          hideProgressBar: true,
        });
      }
    } catch (error) {
      toast.error("Failed to delete comment.", { hideProgressBar: true });
      console.log(error);
    }
  };

  const handleInputChange = (e) => {
    setComment(e.target.value);
  };

  const handleAddComment = async () => {
    try {
      const res = await lessonService.addComment(
        currentUser.UserID,
        lessonDetail.InstructorID,
        rating,
        comment
      );
      if (res.status >= 400) {
        toast.error("Failed to comment.", { hideProgressBar: true });
      } else {
        const newComment = res.data;
        newComment["UsersName"] = currentUser.UsersName;
        setCommentList((prev) => [...prev, newComment]);
        setComment("");
        setRating(3);
        toast.success("Add a new comment successfully.", {
          hideProgressBar: true,
        });
      }
    } catch (error) {
      toast.error("Failed to comment.", { hideProgressBar: true });
      console.log(error);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleAddComment();
    }
  };

  const handleRegisterLesson = async () => {
    try {
      await lessonService.registerLesson(currentUser.UserID, lessonID);
      setRegisteredCount((prev) => prev + 1);
      setRegistered((prev) => !prev);
      myLessonsSet.add(lessonDetail.LessonID);
      toast.success("Registered the lesson successfully.", {
        hideProgressBar: true,
      });
    } catch (error) {
      console.log(error);
      toast.error("Failed to register lesson.", { hideProgressBar: true });
    }
  };

  const handleUnregisterLesson = async () => {
    try {
      await lessonService.unregisterLesson(currentUser.UserID, lessonID);
      setRegisteredCount((prev) => prev - 1);
      setRegistered((prev) => !prev);
      myLessonsSet.delete(lessonDetail.lessonID);
      toast.success("Unregistered the lesson successfully.", {
        hideProgressBar: true,
      });
    } catch (error) {
      console.log(error);
      toast.error("Failed to register lesson.", { hideProgressBar: true });
    }
  };

  const fetchLessonDetail = async () => {
    try {
      const res = await lessonService.getLessonByLessonID(lessonID);
      setLessonDetail(res.data);
      setRegisteredCount(res.data.RegisteredUsers);
    } catch (error) {
      console.log(error);
      toast.error("Failed to get lesson detail.", { hideProgressBar: true });
    }
  };

  const fetchInstructorComments = async () => {
    try {
      const res = await lessonService.getCommentByLessonID(lessonID);
      setCommentList(res.data);
    } catch (error) {
      console.log(error);
      toast.error("Failed to get instructor comments.", {
        hideProgressBar: true,
      });
    }
  };

  useEffect(() => {
    fetchLessonDetail();
    fetchInstructorComments();
  }, []);

  return (
    <>
      {lessonDetail && (
        <>
          <Card sx={{ display: "flex" }}>
            <Box
              sx={{
                width: "100%",
                bgcolor: "background.paper",
                padding: "1.5rem",
              }}
            >
              <div className="flex justify-between">
                <div className="text-3xl">
                  <p>
                    {equipmentTypeMap[lessonDetail.EquipmentType]} /{" "}
                    {levelMap[lessonDetail.Level]}
                  </p>
                </div>
                <div>
                  <span className="mr-4">
                    Registered Users: {registeredCount} /{" "}
                    {lessonDetail.MaxStudent}
                  </span>
                  {registered ? (
                    <Button
                      className="text-2xl"
                      onClick={handleUnregisterLesson}
                    >
                      Unregister
                    </Button>
                  ) : (
                    <Button className="text-2xl" onClick={handleRegisterLesson}>
                      Register
                    </Button>
                  )}
                </div>
              </div>

              <Box
                sx={{
                  width: "100%",
                  bgcolor: "background.paper",
                }}
              >
                <List component="nav" aria-label="main mailbox folders">
                  <ListItem>
                    <ListItemIcon>
                      <FontAwesomeIcon icon={faLocationDot} />
                    </ListItemIcon>
                    <ListItemText primary={lessonDetail.ResortName} />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <FontAwesomeIcon icon={faSackDollar} />
                    </ListItemIcon>
                    <ListItemText primary={`$${lessonDetail.Price}`} />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <FontAwesomeIcon icon={faUsers} />
                    </ListItemIcon>
                    <ListItemText
                      primary={lessonTypeMap[lessonDetail.LessonType]}
                    />
                  </ListItem>
                </List>
              </Box>
            </Box>
          </Card>
          <Grid2 container spacing={2} className="mt-6">
            <Grid2 size={{ xs: 6, md: 6 }}>
              <Card sx={{ display: "flex", padding: "1rem" }}>
                <CardMedia
                  component="img"
                  sx={{ width: 151 }}
                  image={avatar_img}
                  alt="avatar"
                />
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <CardContent sx={{ flex: "1 0 auto" }}>
                    <Typography component="div" variant="h5">
                      Instructor
                    </Typography>
                    <Typography
                      variant="subtitle1"
                      component="div"
                      sx={{ color: "text.secondary" }}
                    >
                      Name: {lessonDetail.InstructorName}
                    </Typography>
                    <div className="mt-3 mb-1">
                      <FontAwesomeIcon
                        icon={faStar}
                        className="text-yellow-500"
                      />{" "}
                      {lessonDetail.AverageRating.toFixed(1)} / 5.0
                    </div>
                    <List component="nav" aria-label="main mailbox folders">
                      <ListItem>
                        <ListItemText
                          primary={`Year of Experience: ${lessonDetail.YearsOfExperience}`}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <FontAwesomeIcon icon={faGlobe} />
                        </ListItemIcon>
                        <ListItemText primary={lessonDetail.Language} />
                      </ListItem>
                    </List>
                  </CardContent>
                </Box>
              </Card>
            </Grid2>
            <Grid2 size={{ xs: 6, md: 6 }}>
              <Card>
                <Box
                  sx={{
                    width: "100%",
                    bgcolor: "background.paper",
                    padding: "1.5rem",
                  }}
                >
                  <div className="text-xl">
                    Ratings and Comments for the Instructor
                  </div>
                  <List
                    sx={{
                      width: "100%",
                      bgcolor: "background.paper",
                      marginTop: "1rem",
                    }}
                  >
                    {commentList.length === 0 && (
                      <Box className="p-6">
                        <Typography>No comments</Typography>
                      </Box>
                    )}
                    {commentList.map((item, idx) => (
                      <CommentItem
                        key={item.InstructorCommentID}
                        comment={item}
                        handleDelete={() => handleDeleteComment(item, idx)}
                        handleEdit={handleEditComment}
                        idx={idx}
                      />
                    ))}
                  </List>
                  <Box
                    sx={{
                      p: "2px 4px",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      width: "100%",
                      marginTop: "1rem",
                    }}
                  >
                    <Paper
                      component="form"
                      sx={{
                        p: "2px 4px",
                        display: "flex",
                        alignItems: "center",
                        width: "100%",
                        marginTop: "1rem",
                      }}
                    >
                      <Rating
                        name="simple-controlled"
                        value={rating}
                        onChange={(event, newValue) => {
                          setRating(newValue);
                        }}
                        size="large"
                      />
                      <InputBase
                        className="p-2 ml-2 w-full"
                        placeholder="Leave a comment..."
                        onChange={handleInputChange}
                        value={comment}
                        onKeyDown={handleKeyPress}
                      />
                      <IconButton
                        type="button"
                        sx={{ p: "10px" }}
                        aria-label="search"
                        onClick={handleAddComment}
                      >
                        <FontAwesomeIcon icon={faPaperPlane} />
                      </IconButton>
                    </Paper>
                  </Box>
                </Box>
              </Card>
            </Grid2>
          </Grid2>
        </>
      )}
    </>
  );
};

export default LessonDetail;
