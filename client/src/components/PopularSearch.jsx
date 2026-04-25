import { useEffect, useState } from "react";
import { Pagination, Stack } from "@mui/material";
import ResortCard from "./ResortCard";
import ResortService from "../services/resort.service";
import { useParams } from "react-router-dom";

function PopularSearch() {
  const { searchType } = useParams();
  const [allResorts, setAllResorts] = useState([]);
  const [displayedResorts, setDisplayedResorts] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);

  const handleChangePage = (event, newPage) => {
    setPageNumber(newPage);
    const data = allResorts.slice((newPage - 1) * 10, newPage * 10);
    setDisplayedResorts(data);
  };

  const fetchResorts = async () => {
    try {
      let res;
      if (searchType === "beginner") {
        res = await ResortService.getPopularResortsForBeginners();
        setAllResorts(res.data);
      } else if (searchType === "intermediate") {
        res = await ResortService.getPopularResortsForIntermediate();
        setAllResorts(res.data);
      } else if (searchType === "difficult") {
        res = await ResortService.getPopularResortsForPros();
        setAllResorts(res.data);
      }
      console.log(res);
      const data = res.data.slice(0, 10);
      setDisplayedResorts(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchResorts();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pageNumber]);

  return (
    <div className="p-6">
      <Stack spacing={2}>
        <Pagination
          count={Math.ceil(allResorts.length / 10)}
          page={pageNumber}
          showFirstButton
          showLastButton
          onChange={handleChangePage}
        />
        {displayedResorts.map((item, idx) => (
          <ResortCard key={idx} resortInfo={item} />
        ))}
        <Pagination
          count={Math.ceil(allResorts.length / 10)}
          page={pageNumber}
          showFirstButton
          showLastButton
          onChange={handleChangePage}
        />
      </Stack>
    </div>
  );
}

export default PopularSearch;
