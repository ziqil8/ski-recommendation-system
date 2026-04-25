import {
  faCheck,
  faPen,
  faTrash,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Avatar,
  Box,
  Button,
  Divider,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Modal,
  Rating,
  Typography,
} from "@mui/material";
import avatar_img from "../assets/avatar.svg";
import PropTypes from "prop-types";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../store/userContext";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 700,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const CommentItem = ({ comment, handleDelete, handleEdit, idx }) => {
  const { user } = useContext(UserContext);
  const [rating, setRating] = useState(comment.Rating);
  const [content, setContent] = useState(comment.CommentText);
  const [editedRating, setEditedRating] = useState(comment.Rating);
  const [editedContent, setEditedContent] = useState(comment.CommentText);
  const [isEditing, setIsEditing] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const handleSetEdit = () => {
    setIsEditing(true);
  };

  const handleRatingChange = (e) => {
    let newRating = e.target.value;
    if (newRating < 1) {
      newRating = 1;
    } else if (newRating > 5) {
      newRating = 5;
    }
    setEditedRating(newRating);
  };

  const handleContentChange = (e) => {
    setEditedContent(e.target.value);
  };

  const handleSave = () => {
    handleEdit(
      editedContent,
      editedRating,
      comment.ResortCommentID || comment.InstructorCommentID,
      idx
    );
    setRating(editedRating);
    setContent(editedContent);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedRating(rating);
    setEditedContent(content);
    setIsEditing(false);
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleDeleteComment = () => {
    handleDelete();
    setOpenModal(false);
  };

  useEffect(() => {
    setRating(comment.Rating);
    setContent(comment.CommentText);
  }, [comment]);

  return (
    <>
      <ListItem
        alignItems="flex-start"
        sx={{ width: "100%" }}
        secondaryAction={
          <>
            {user && user.UsersName === comment.UsersName && (
              <>
                {isEditing ? (
                  <>
                    <IconButton
                      edge="end"
                      aria-label="save"
                      onClick={handleSave}
                      size="small"
                    >
                      <FontAwesomeIcon icon={faCheck} />
                    </IconButton>
                    <IconButton
                      edge="end"
                      aria-label="cancel"
                      onClick={handleCancel}
                      size="small"
                    >
                      <FontAwesomeIcon icon={faXmark} />
                    </IconButton>
                  </>
                ) : (
                  <>
                    <IconButton
                      edge="end"
                      aria-label="edit"
                      onClick={handleSetEdit}
                      size="small"
                    >
                      <FontAwesomeIcon icon={faPen} />
                    </IconButton>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={handleOpenModal}
                      size="small"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </IconButton>
                  </>
                )}
              </>
            )}
          </>
        }
      >
        <ListItemAvatar>
          <Avatar alt="Remy Sharp" src={avatar_img} />
        </ListItemAvatar>
        <ListItemText
          primary={comment.UsersName}
          secondary={
            <>
              <Rating
                name="simple-controlled"
                value={isEditing ? editedRating : rating}
                readOnly={!isEditing}
                onChange={handleRatingChange}
              />
              {isEditing ? (
                <input
                  className="w-full"
                  value={editedContent}
                  defaultValue={content}
                  autoFocus
                  onChange={handleContentChange}
                />
              ) : (
                <>
                  <br />
                  {content}
                </>
              )}
            </>
          }
          sx={{ width: "50rem" }}
        />
      </ListItem>
      <Divider variant="inset" component="li" />
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Are you sure you want to delete the comment?
          </Typography>
          <div className="w-full flex justify-end gap-4">
            <Button
              edge="end"
              aria-label="edit"
              onClick={handleDeleteComment}
              size="small"
            >
              Delete
            </Button>
            <Button
              edge="end"
              aria-label="delete"
              onClick={handleCloseModal}
              size="small"
            >
              <div>Cancel</div>
            </Button>
          </div>
        </Box>
      </Modal>
    </>
  );
};

CommentItem.propTypes = {
  comment: PropTypes.shape({
    UsersName: PropTypes.string,
    Rating: PropTypes.number,
    CommentText: PropTypes.string,
    ResortCommentID: PropTypes.number,
    InstructorCommentID: PropTypes.number,
    ResortID: PropTypes.number,
  }),
  handleDelete: PropTypes.func,
  handleEdit: PropTypes.func,
  idx: PropTypes.number,
};

export default CommentItem;
