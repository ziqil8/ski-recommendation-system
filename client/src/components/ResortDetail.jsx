import {
  faBookmark as faBookmarkSolid,
  faCableCar,
  faCheck,
  faLocationDot,
  faMountain,
  faPaperPlane,
  faPersonSkiing,
  faSackDollar,
  faSnowflake,
  faStar,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Box,
  Card,
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
import { faBookmark as faBookmarkRegular } from "@fortawesome/free-regular-svg-icons";
import { toast } from "react-toastify";
import resort_img_1 from "../assets/resort_img_1.jpg";
import resort_img_2 from "../assets/resort_img_2.jpg";
import resort_img_3 from "../assets/resort_img_3.jpg";
import resort_img_4 from "../assets/resort_img_4.jpg";
import resort_img_5 from "../assets/resort_img_5.jpg";
import { useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import CommentItem from "./CommentItem";
import ResortService from "../services/resort.service";
import AuthService from "../services/auth.service";
import { UserContext } from "../store/userContext";
import LessonItem from "./LessonItem";
import LessonService from "../services/lesson.service";

const resortImages = [
  resort_img_1,
  resort_img_2,
  resort_img_3,
  resort_img_4,
  resort_img_5,
];

const FAKE_DATA = [
  {
    LessonID: 0,
    EquipmentType: "snowboard",
    Level: "difficult",
    LessonType: "group",
    Price: 151,
    MaxStudent: 5,
    RegisteredUsers: 2,
  },
  {
    LessonID: 1,
    EquipmentType: "ski",
    Level: "beginner",
    LessonType: "individual",
    Price: 230,
    MaxStudent: 1,
    RegisteredUsers: 0,
  },
];

const ResortDetail = () => {
  const { resortID } = useParams();
  const navigate = useNavigate();
  const { user, setMyResorts, myResortsSet } = useContext(UserContext);
  const [resortDetail, setResortDetail] = useState(null);
  const [commentList, setCommentList] = useState([]);
  const [lessonList, setLessonList] = useState(FAKE_DATA);
  const [rating, setRating] = useState(3);
  const [comment, setComment] = useState("");

  const currentUser = user || AuthService.getCurrentUser();
  const handleEditComment = async (newContent, newRating, commentID, idx) => {
    try {
      const res = await ResortService.editComment(
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
      const res = await ResortService.deleteComment(
        comment.ResortCommentID,
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
      const res = await ResortService.addComment(
        currentUser.UserID,
        resortID,
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

  const fetchComments = async () => {
    try {
      const res = await ResortService.getCommentByResortID(resortID);
      const comments = res.data;
      setCommentList(comments);
    } catch (error) {
      toast.error("Failed to get comments.", { hideProgressBar: true });
      console.log(error);
    }
  };

  const fetchLessons = async () => {
    try {
      const res = await LessonService.getLessonByResortID(resortID);
      const lessons = res.data;
      setLessonList(lessons);
    } catch (error) {
      toast.error("Failed to get lessons.", { hideProgressBar: true });
      console.log(error);
    }
  };

  const fetchResortDetail = async () => {
    try {
      const res = await ResortService.getResortByID(resortID);
      if (res.status === 200) {
        const total_slopes =
          res.data["BeginnerSlope"] +
          res.data["IntermediateSlope"] +
          res.data["DifficultSlope"];
        if (total_slopes === 0) {
          res.data["Difficulty"] = "Unknown";
        } else {
          if (res.data["BeginnerSlope"] / total_slopes > 0.5) {
            res.data["Difficulty"] = "Beginner";
          } else if (res.data["DifficultSlope"] / total_slopes > 0.2) {
            res.data["Difficulty"] = "Hard";
          } else {
            res.data["Difficulty"] = "Intermediate";
          }
        }
        setResortDetail(res.data);
      }
      if (res.status >= 400) {
        toast.error("Failed to get resort detail.");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to get resort detail.");
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleAddComment();
    }
  };

  const addFavorites = async () => {
    if (!user || !user.UserID) {
      navigate("/login");
    }
    try {
      await ResortService.addFavorites(user.UserID, resortDetail.ResortID);
      myResortsSet.add(resortDetail.ResortID);
      setMyResorts((prev) => [...prev, { ...resortDetail }]);
      toast.success("Added the resort to my favorites successfully.");
    } catch (error) {
      toast.error("Failed to add the resort to my favorites.");
      console.log(error);
    }
  };

  const removeFavorites = async () => {
    if (!user || !user.UserID) {
      navigate("/login");
    }
    try {
      await ResortService.deleteFavorites(user.UserID, resortDetail.ResortID);
      myResortsSet.delete(resortDetail.ResortID);
      setMyResorts((prev) =>
        prev.filter((item) => item.resort_id !== resortDetail.ResortID)
      );
      toast.success("Removed the resort from my favorites successfully.");
    } catch (error) {
      toast.error("Failed to remove the resort from my favorites.");
      console.log(error);
    }
  };

  const toggleFavorites = () => {
    if (!myResortsSet.has(resortDetail.ResortID)) {
      addFavorites();
    } else {
      removeFavorites();
    }
  };

  useEffect(() => {
    fetchResortDetail();
    fetchComments();
    fetchLessons();
  }, []);

  return (
    <>
      {resortDetail && (
        <>
          <Card sx={{ display: "flex" }}>
            <Box
              sx={{
                width: "60%",
                bgcolor: "background.paper",
                padding: "1.5rem",
              }}
            >
              <div className=" h-[20rem] flex items-center justify-center overflow-hidden">
                <img
                  src={resortImages[resortDetail["ResortID"] % 5]}
                  alt="Resort"
                />
              </div>
            </Box>
            <Box
              sx={{
                width: "100%",
                bgcolor: "background.paper",
                padding: "1.5rem",
              }}
            >
              <div className="flex justify-between">
                <div className="text-3xl">
                  <p>{resortDetail.ResortName}</p>
                </div>
                <button className="text-2xl" onClick={toggleFavorites}>
                  <FontAwesomeIcon
                    icon={
                      myResortsSet.has(resortDetail.ResortID)
                        ? faBookmarkSolid
                        : faBookmarkRegular
                    }
                    className={`${
                      myResortsSet.has(resortDetail.ResortID)
                        ? "text-yellow-500"
                        : ""
                    }`}
                  />
                </button>
              </div>
              <div className="mt-3 mb-1">
                <FontAwesomeIcon icon={faStar} className="text-yellow-500" />{" "}
                {resortDetail.AverageRating.toFixed(1)} / 5.0
              </div>
              <div>{resortDetail.Difficulty} level</div>

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
                    <ListItemText primary={resortDetail.CountryName} />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <FontAwesomeIcon icon={faSackDollar} />
                    </ListItemIcon>
                    <ListItemText
                      primary={`$${resortDetail.DayPassPrice} / Adult`}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <FontAwesomeIcon icon={faMountain} />
                    </ListItemIcon>
                    <ListItemText
                      primary={`Highest point: ${resortDetail.HighestPoint} ft. / Lowest point: ${resortDetail.LowestPoint} ft.`}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <FontAwesomeIcon icon={faPersonSkiing} />
                    </ListItemIcon>
                    <ListItemText
                      primary={`Total slopes: ${
                        resortDetail.BeginnerSlope +
                        resortDetail.IntermediateSlope +
                        resortDetail.DifficultSlope
                      }`}
                      secondary={`Beginner level: ${resortDetail.BeginnerSlope} / Intermediate level: ${resortDetail.IntermediateSlope} / Difficult level: ${resortDetail.DifficultSlope}`}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <FontAwesomeIcon icon={faCableCar} />
                    </ListItemIcon>
                    <ListItemText
                      primary={`Total lifts: ${
                        resortDetail.SurfaceLift +
                        resortDetail.ChairLift +
                        resortDetail.GondolaLift
                      }`}
                      secondary={`Surface lifts: ${resortDetail.SurfaceLift} / Chair lifts: ${resortDetail.ChairLift} / Gondola lifts: ${resortDetail.GondolaLift}`}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <FontAwesomeIcon icon={faSnowflake} />
                    </ListItemIcon>
                    <ListItemText
                      primary={`Snow cannons: ${resortDetail.SnowCannons}`}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      {resortDetail.SnowParks ? (
                        <FontAwesomeIcon
                          icon={faCheck}
                          className="text-green-500"
                        />
                      ) : (
                        <FontAwesomeIcon
                          icon={faXmark}
                          className="text-red-500"
                        />
                      )}
                    </ListItemIcon>
                    <ListItemText primary={"Snow park"} />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      {resortDetail.NightSki ? (
                        <FontAwesomeIcon
                          icon={faCheck}
                          className="text-green-500"
                        />
                      ) : (
                        <FontAwesomeIcon
                          icon={faXmark}
                          className="text-red-500"
                        />
                      )}
                    </ListItemIcon>
                    <ListItemText primary={"Night ski"} />
                  </ListItem>
                </List>
              </Box>
            </Box>
          </Card>
          <Grid2 container spacing={2} className="mt-6">
            <Grid2 size={{ xs: 6, md: 6 }}>
              <Card>
                <Box
                  sx={{
                    width: "100%",
                    bgcolor: "background.paper",
                    padding: "1.5rem",
                  }}
                >
                  <div className="text-xl">Ratings and Comments</div>
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
                        key={item.ResortCommentID}
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
            <Grid2 size={{ xs: 6, md: 6 }}>
              <Card>
                <Box
                  sx={{
                    width: "100%",
                    bgcolor: "background.paper",
                    padding: "1.5rem",
                  }}
                >
                  <div className="text-xl">Lessons</div>
                  <List
                    sx={{
                      width: "100%",
                      bgcolor: "background.paper",
                      marginTop: "1rem",
                    }}
                  >
                    {lessonList.length === 0 && (
                      <Box className="p-6">
                        <Typography>No lessons</Typography>
                      </Box>
                    )}
                    {lessonList.map((item) => (
                      <LessonItem key={item.LessonID} lesson={item} />
                    ))}
                  </List>
                </Box>
              </Card>
            </Grid2>
          </Grid2>
        </>
      )}
    </>
  );
};

export default ResortDetail;
