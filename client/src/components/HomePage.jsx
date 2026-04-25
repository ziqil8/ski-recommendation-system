import IconButton from "@mui/material/IconButton";
import { useContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import {
  Button,
  Card,
  CardContent,
  CardMedia,
  Grid2,
  Pagination,
  Stack,
  Typography,
} from "@mui/material";
import ResortCard from "./ResortCard";
import FilterInput from "./FilterInput";
import ResortService from "../services/resort.service";
import { UserContext } from "../store/userContext";
import ski_image_1 from "../assets/skiing_1.jpg";
import ski_image_2 from "../assets/skiing_2.jpg";
import ski_image_3 from "../assets/skiing_3.jpg";
import { Link } from "react-router-dom";

const contry_list = [
  "Austria",
  "Andorra",
  "Southern Russia",
  "Poland",
  "Bulgaria",
  "Bosnia and Herzegovina",
  "Slovenia",
  "France",
  "Switzerland",
  "Germany",
  "Spain",
  "Italy",
  "Sweden",
  "Norway",
  "Ukraine",
  "Finland",
  "Serbia",
  "Slovakia",
  "Siberia",
  "Czech Republic",
  "Romania",
  "Greece",
  "United Kingdom",
  "Liechtenstein",
  "Lithuania",
  "Denmark",
  "Netherlands",
];

const difficulty_options = ["Beginner", "Intermediate", "Hard"];

const elevation_options = ["≤ 810 feet", "810 ~ 1620 feet", "> 1620 feet"];

const price_options = ["≤ $30", "$30 ~ $42", "$42 ~ $54", "> $54"];

const rating_options = ["0 ~ 1", "1 ~ 2", "2 ~ 3", "3 ~ 4", "4 ~ 5"];

function HomePage() {
  const { user, setMyResorts, setMyResortsSet, setMyLessonsSet } =
    useContext(UserContext);
  const [allResorts, setAllResorts] = useState([]);
  const [filteredResorts, setFilteredResorts] = useState([]);
  const [displayedResorts, setDisplayedResorts] = useState([]);
  const [difficulty, setDifficulty] = useState([]);
  const [country, setCountry] = useState([]);
  const [elevation, setElevation] = useState([]);
  const [price, setPrice] = useState([]);
  const [rating, setRating] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);

  const handleSelectDifficulty = (value) => {
    const currentIndex = difficulty.indexOf(value);
    const newChecked = [...difficulty];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setDifficulty(newChecked);
  };

  const handleSelectCountry = (value) => {
    const currentIndex = country.indexOf(value);
    const newChecked = [...country];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setCountry(newChecked);
  };

  const handleSelectElevation = (value) => {
    const currentIndex = elevation.indexOf(value);
    const newChecked = [...elevation];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setElevation(newChecked);
  };

  const handleSelectPrice = (value) => {
    const currentIndex = price.indexOf(value);
    const newChecked = [...price];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setPrice(newChecked);
  };

  const handleSelectRating = (value) => {
    const currentIndex = rating.indexOf(value);
    const newChecked = [...rating];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setRating(newChecked);
  };

  const handleSearch = () => {
    const searchResult = allResorts.filter((item) => {
      const total_slopes =
        (item["BeginnerSlope"] || 0) +
        (item["IntermediateSlope"] || 0) +
        (item["DifficultSlope"] || 0);

      const resortElevation = item.HighestPoint - item.LowestPoint;
      let level = "Unknown";
      if (total_slopes > 0) {
        if (item["BeginnerSlope"] / total_slopes > 0.5) {
          level = "Beginner";
        } else if (item["DifficultSlope"] / total_slopes > 0.2) {
          level = "Hard";
        } else {
          level = "Intermediate";
        }
      }

      let matchesElevation = elevation.length === 0;
      if (elevation.includes("≤ 810 feet")) {
        matchesElevation = matchesElevation || resortElevation <= 810;
      }
      if (elevation.includes("810 ~ 1620 feet")) {
        matchesElevation =
          matchesElevation ||
          (810 < resortElevation && resortElevation <= 1620);
      }
      if (elevation.includes("> 1620 feet")) {
        matchesElevation = matchesElevation || resortElevation > 1620;
      }

      let matchesPrice = price.length === 0;
      if (price.includes("≤ $30")) {
        matchesPrice = matchesPrice || item.DayPassPrice <= 30;
      }
      if (price.includes("$30 ~ $42")) {
        matchesPrice =
          matchesPrice || (30 < item.DayPassPrice && item.DayPassPrice <= 42);
      }
      if (price.includes("$42 ~ $54")) {
        matchesPrice =
          matchesPrice || (42 < item.DayPassPrice && item.DayPassPrice <= 54);
      }
      if (price.includes("> $54")) {
        matchesPrice = matchesPrice || item.DayPassPrice > 54;
      }

      let matchesRating = rating.length === 0;
      if (rating.includes("0 ~ 1")) {
        matchesRating =
          matchesRating || (item.AverageRating >= 0 && item.AverageRating <= 1);
      }
      if (rating.includes("1 ~ 2")) {
        matchesRating =
          matchesRating || (item.AverageRating > 1 && item.AverageRating <= 2);
      }
      if (rating.includes("2 ~ 3")) {
        matchesRating =
          matchesRating || (item.AverageRating > 2 && item.AverageRating <= 3);
      }
      if (rating.includes("3 ~ 4")) {
        matchesRating =
          matchesRating || (item.AverageRating > 3 && item.AverageRating <= 4);
      }
      if (rating.includes("4 ~ 5")) {
        matchesRating =
          matchesRating || (item.AverageRating > 4 && item.AverageRating <= 5);
      }

      const matchesCountry =
        country.length === 0 || country.includes(item.CountryName);
      const matchesDifficulty =
        difficulty.length === 0 || difficulty.includes(level);

      return (
        matchesCountry &&
        matchesDifficulty &&
        matchesRating &&
        matchesElevation &&
        matchesPrice
      );
    });
    setFilteredResorts(searchResult);

    if (searchResult.length > 10) {
      const data = searchResult.slice(0, 10).map((item) => {
        const display = {
          resort_id: item["ResortID"],
          resortName: item["ResortName"],
          location: item["CountryName"],
          price: item["DayPassPrice"],
          rating: item["AverageRating"],
        };
        const total_slopes =
          item["BeginnerSlope"] +
          item["IntermediateSlope"] +
          item["DifficultSlope"];
        if (total_slopes === 0) {
          display["difficulty"] = "Unknown";
        } else {
          if (item["BeginnerSlope"] / total_slopes > 0.5) {
            display["difficulty"] = "Beginner";
          } else if (item["DifficultSlope"] / total_slopes > 0.2) {
            display["difficulty"] = "Hard";
          } else {
            display["difficulty"] = "Intermediate";
          }
        }
        return display;
      });
      setDisplayedResorts(data);
    } else {
      const data = searchResult.map((item) => {
        const display = {
          resort_id: item["ResortID"],
          resortName: item["ResortName"],
          location: item["CountryName"],
          price: item["DayPassPrice"],
          rating: item["AverageRating"],
        };
        const total_slopes =
          item["BeginnerSlope"] +
          item["IntermediateSlope"] +
          item["DifficultSlope"];
        if (total_slopes === 0) {
          display["difficulty"] = "Unknown";
        } else {
          if (item["BeginnerSlope"] / total_slopes > 0.5) {
            display["difficulty"] = "Beginner";
          } else if (item["DifficultSlope"] / total_slopes > 0.2) {
            display["difficulty"] = "Hard";
          } else {
            display["difficulty"] = "Intermediate";
          }
        }
        return display;
      });
      setDisplayedResorts(data);
    }
  };

  const handleClear = () => {
    setCountry([]);
    setDifficulty([]);
    setElevation([]);
    setPrice([]);
    setRating([]);
    setFilteredResorts(allResorts);
    const data = allResorts.slice(0, 10).map((item) => {
      const display = {
        resort_id: item["ResortID"],
        resortName: item["ResortName"],
        location: item["CountryName"],
        price: item["DayPassPrice"],
        rating: item["AverageRating"],
      };
      const total_slopes =
        item["BeginnerSlope"] +
        item["IntermediateSlope"] +
        item["DifficultSlope"];
      if (total_slopes === 0) {
        display["difficulty"] = "Unknown";
      } else {
        if (item["BeginnerSlope"] / total_slopes > 0.5) {
          display["difficulty"] = "Beginner";
        } else if (item["DifficultSlope"] / total_slopes > 0.2) {
          display["difficulty"] = "Hard";
        } else {
          display["difficulty"] = "Intermediate";
        }
      }
      return display;
    });
    setDisplayedResorts(data);
  };

  const handleChangePage = (event, newPage) => {
    setPageNumber(newPage);
    const data = filteredResorts
      .slice((newPage - 1) * 10, newPage * 10)
      .map((item) => {
        const display = {
          resort_id: item["ResortID"],
          resortName: item["ResortName"],
          location: item["CountryName"],
          price: item["DayPassPrice"],
          rating: item["AverageRating"],
        };
        const total_slopes =
          item["BeginnerSlope"] +
          item["IntermediateSlope"] +
          item["DifficultSlope"];
        if (total_slopes === 0) {
          display["difficulty"] = "Unknown";
        } else {
          if (item["BeginnerSlope"] / total_slopes > 0.5) {
            display["difficulty"] = "Beginner";
          } else if (item["DifficultSlope"] / total_slopes > 0.2) {
            display["difficulty"] = "Hard";
          } else {
            display["difficulty"] = "Intermediate";
          }
        }
        return display;
      });
    setDisplayedResorts(data);
  };

  const fetchResorts = async () => {
    try {
      const res = await ResortService.getAllResorts();
      setAllResorts(res.data);
      setFilteredResorts(res.data);
      const data = res.data.slice(0, 10).map((item) => {
        const display = {
          resort_id: item["ResortID"],
          resortName: item["ResortName"],
          location: item["CountryName"],
          price: item["DayPassPrice"],
          rating: item["AverageRating"],
        };
        const total_slopes =
          item["BeginnerSlope"] +
          item["IntermediateSlope"] +
          item["DifficultSlope"];
        if (total_slopes === 0) {
          display["difficulty"] = "Unknown";
        } else {
          if (item["BeginnerSlope"] / total_slopes > 0.5) {
            display["difficulty"] = "Beginner";
          } else if (item["DifficultSlope"] / total_slopes > 0.2) {
            display["difficulty"] = "Hard";
          } else {
            display["difficulty"] = "Intermediate";
          }
        }
        return display;
      });
      setDisplayedResorts(data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchFavoriteResorts = async (userID) => {
    if (!userID) {
      return;
    }
    try {
      const res = await ResortService.getFavoriteResorts(userID);
      setMyResorts(res.data);
      const tmp = new Set();
      for (let i = 0; i < res.data.length; i++) {
        tmp.add(res.data[i].resort_id);
      }
      setMyResortsSet(tmp);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchRegisteredLessons = async (userID) => {
    if (!userID) {
      return;
    }
    try {
      const res = await ResortService.getRegisteredLessons(userID);
      const tmp = new Set();
      for (let i = 0; i < res.data.length; i++) {
        tmp.add(res.data[i].LessonID);
      }
      setMyLessonsSet(tmp);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchResorts();
  }, []);

  useEffect(() => {
    if (!user) {
      return;
    }
    fetchFavoriteResorts(user.UserID);
    fetchRegisteredLessons(user.UserID);
  }, [user]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pageNumber]);

  return (
    <div className="p-6">
      <Typography sx={{ fontSize: "1.5rem" }}>Popular Searches</Typography>
      <Grid2 container spacing={2}>
        <Grid2 size={4}>
          <Card>
            <CardMedia
              sx={{ height: 250 }}
              image={ski_image_1}
              title="popular search"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                <Link
                  to={`/resort/popular/${"beginner"}`}
                  className="hover:underline text-blue-500"
                >
                  Popular Resorts for Beginners
                </Link>
              </Typography>
            </CardContent>
          </Card>
        </Grid2>
        <Grid2 size={4}>
          <Card>
            <CardMedia
              sx={{ height: 250 }}
              image={ski_image_2}
              title="popular search"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                <Link
                  to={`/resort/popular/${"intermediate"}`}
                  className="hover:underline text-blue-500"
                >
                  Popular Resorts for Intermediate Level
                </Link>
              </Typography>
            </CardContent>
          </Card>
        </Grid2>
        <Grid2 size={4}>
          <Card>
            <CardMedia
              sx={{ height: 250 }}
              image={ski_image_3}
              title="popular search"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                <Link
                  to={`/resort/popular/${"difficult"}`}
                  className="hover:underline text-blue-500"
                >
                  Popular Resorts for Pro Skiers
                </Link>
              </Typography>
            </CardContent>
          </Card>
        </Grid2>
      </Grid2>

      <div className="flex justify-center gap-3 mt-4">
        <FilterInput
          id={"select-country"}
          label={"Country"}
          value={country}
          options={contry_list}
          handleSelect={handleSelectCountry}
        />
        <FilterInput
          id={"select-difficulty"}
          label={"Difficulty"}
          value={difficulty}
          options={difficulty_options}
          handleSelect={handleSelectDifficulty}
        />
        <FilterInput
          id={"select-elevation"}
          label={"Elevation"}
          value={elevation}
          options={elevation_options}
          handleSelect={handleSelectElevation}
        />
        <FilterInput
          id={"select-price"}
          label={"Price"}
          value={price}
          options={price_options}
          handleSelect={handleSelectPrice}
        />
        <FilterInput
          id={"select-rating"}
          label={"Rating"}
          value={rating}
          options={rating_options}
          handleSelect={handleSelectRating}
        />
        <IconButton onClick={handleSearch}>
          <FontAwesomeIcon icon={faMagnifyingGlass} />
        </IconButton>
        <Button onClick={handleClear}>Clear</Button>
      </div>
      <div className="p-6">
        <Stack spacing={2}>
          <Pagination
            count={Math.ceil(filteredResorts.length / 10)}
            page={pageNumber}
            showFirstButton
            showLastButton
            onChange={handleChangePage}
          />
          {displayedResorts.map((item, idx) => (
            <ResortCard key={idx} resortInfo={item} />
          ))}
          <Pagination
            count={Math.ceil(filteredResorts.length / 10)}
            page={pageNumber}
            showFirstButton
            showLastButton
            onChange={handleChangePage}
          />
        </Stack>
      </div>
    </div>
  );
}

export default HomePage;
