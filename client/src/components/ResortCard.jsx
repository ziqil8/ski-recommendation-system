import {
  faBookmark as faBookmarkSolid,
  faLocationDot,
  faSackDollar,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Box,
  Card,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { faBookmark as faBookmarkRegular } from "@fortawesome/free-regular-svg-icons";
import { toast } from "react-toastify";
import resort_img_1 from "../assets/resort_img_1.jpg";
import resort_img_2 from "../assets/resort_img_2.jpg";
import resort_img_3 from "../assets/resort_img_3.jpg";
import resort_img_4 from "../assets/resort_img_4.jpg";
import resort_img_5 from "../assets/resort_img_5.jpg";
import PropTypes from "prop-types";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../store/userContext";
import ResortService from "../services/resort.service";

const resortImages = [
  resort_img_1,
  resort_img_2,
  resort_img_3,
  resort_img_4,
  resort_img_5,
];

const ResortCard = (props) => {
  const navigate = useNavigate();
  const { user, myResortsSet, setMyResorts } = useContext(UserContext);
  const { resortInfo } = props;

  const addFavorites = async () => {
    if (!user || !user.UserID) {
      navigate("/login");
    }
    try {
      await ResortService.addFavorites(user.UserID, resortInfo.resort_id);
      myResortsSet.add(resortInfo.resort_id);
      setMyResorts((prev) => [...prev, { ...resortInfo }]);
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
      await ResortService.deleteFavorites(user.UserID, resortInfo.resort_id);
      myResortsSet.delete(resortInfo.resort_id);
      setMyResorts((prev) =>
        prev.filter((item) => item.resort_id !== resortInfo.resort_id)
      );
      toast.success("Removed the resort from my favorites successfully.");
    } catch (error) {
      toast.error("Failed to remove the resort from my favorites.");
      console.log(error);
    }
  };

  const toggleFavorites = () => {
    if (!myResortsSet.has(resortInfo.resort_id)) {
      addFavorites();
    } else {
      removeFavorites();
    }
  };

  return (
    <Card sx={{ display: "flex" }}>
      <img
        src={resortImages[resortInfo.resort_id % 5]}
        className="w-[20rem] h-[20rem] min-w-[20rem] min-h-[20rem] overflow-hidden"
      />
      <Box
        sx={{
          width: "100%",
          bgcolor: "background.paper",
          padding: "1.5rem",
        }}
      >
        <div className="flex justify-between">
          <div className="text-2xl">
            <Link
              to={`/resort/${resortInfo.resort_id}`}
              className="hover:underline text-blue-500"
            >
              {resortInfo.resortName}
            </Link>
          </div>
          <button className="text-2xl" onClick={toggleFavorites}>
            <FontAwesomeIcon
              icon={
                myResortsSet.has(resortInfo.resort_id)
                  ? faBookmarkSolid
                  : faBookmarkRegular
              }
              className={`${
                myResortsSet.has(resortInfo.resort_id) ? "text-yellow-500" : ""
              }`}
            />
          </button>
        </div>
        <div className="mt-3 mb-1">
          <FontAwesomeIcon icon={faStar} className="text-yellow-500" />{" "}
          {resortInfo.rating.toFixed(1)} / 5.0
        </div>
        <div>{resortInfo.difficulty} level</div>

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
              <ListItemText primary={resortInfo.location} />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <FontAwesomeIcon icon={faSackDollar} />
              </ListItemIcon>
              <ListItemText primary={`$${resortInfo.price} / Adult`} />
            </ListItem>
          </List>
        </Box>
      </Box>
    </Card>
  );
};

ResortCard.propTypes = {
  resortInfo: PropTypes.shape({
    resort_id: PropTypes.number,
    resortName: PropTypes.string,
    location: PropTypes.string,
    price: PropTypes.number,
    rating: PropTypes.number,
    difficulty: PropTypes.string,
  }),
};

export default ResortCard;
