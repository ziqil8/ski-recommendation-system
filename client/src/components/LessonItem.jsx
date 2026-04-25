import { faSackDollar, faUsers } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Button,
  Divider,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import PropTypes from "prop-types";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../store/userContext";
import { toast } from "react-toastify";
import lessonService from "../services/lesson.service";
import authService from "../services/auth.service";

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

const LessonItem = ({ lesson }) => {
  const { user, myLessonsSet } = useContext(UserContext);
  const [registeredCount, setRegisteredCount] = useState(
    lesson.RegisteredUsers
  );
  const [registered, setRegistered] = useState(
    myLessonsSet.has(lesson.LessonID)
  );
  const currentUser = user || authService.getCurrentUser();

  const handleRegisterLesson = async () => {
    try {
      await lessonService.registerLesson(currentUser.UserID, lesson.LessonID);
      setRegisteredCount((prev) => prev + 1);
      setRegistered((prev) => !prev);
      myLessonsSet.add(lesson.LessonID);
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
      await lessonService.unregisterLesson(currentUser.UserID, lesson.LessonID);
      setRegisteredCount((prev) => prev - 1);
      setRegistered((prev) => !prev);
      myLessonsSet.delete(lesson.LessonID);
      toast.success("Unregistered the lesson successfully.", {
        hideProgressBar: true,
      });
    } catch (error) {
      console.log(error);
      toast.error("Failed to register lesson.", { hideProgressBar: true });
    }
  };
  return (
    <>
      <ListItem
        alignItems="flex-start"
        sx={{ width: "100%" }}
        secondaryAction={
          <>
            <Typography>
              {registeredCount} / {lesson.MaxStudent}
            </Typography>
            {registered ? (
              <Button
                edge="end"
                aria-label="register"
                size="small"
                onClick={handleUnregisterLesson}
              >
                Unregister
              </Button>
            ) : (
              <Button
                edge="end"
                aria-label="register"
                size="small"
                onClick={handleRegisterLesson}
              >
                Register
              </Button>
            )}
          </>
        }
      >
        <ListItemText
          primary={
            <Link
              to={`/lesson/${lesson.LessonID}`}
              className="hover:underline text-blue-500"
            >
              {equipmentTypeMap[lesson.EquipmentType]} /{" "}
              {levelMap[lesson.Level]}
            </Link>
          }
          secondary={
            <>
              <Typography>
                <ListItemIcon>
                  <FontAwesomeIcon icon={faUsers} />
                </ListItemIcon>
                {lessonTypeMap[lesson.LessonType]}
                <br />
                <ListItemIcon>
                  <FontAwesomeIcon icon={faSackDollar} />
                </ListItemIcon>
                ${lesson.Price}
              </Typography>
            </>
          }
          sx={{ width: "50rem" }}
        />
      </ListItem>
      <Divider variant="fullwidth" component="li" />
    </>
  );
};

LessonItem.propTypes = {
  lesson: PropTypes.shape({
    LessonID: PropTypes.string,
    EquipmentType: PropTypes.string,
    Level: PropTypes.string,
    LessonType: PropTypes.string,
    Price: PropTypes.number,
    MaxStudent: PropTypes.number,
    RegisteredUsers: PropTypes.number,
  }),
  idx: PropTypes.number,
};

export default LessonItem;
