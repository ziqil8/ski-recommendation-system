import { Stack } from "@mui/material";
import ResortCard from "./ResortCard";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../store/userContext";

const MyResorts = () => {
  const navigate = useNavigate();
  const { myResorts } = useContext(UserContext);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      navigate("/");
    }
  });

  return (
    <div className="px-12 pt-6">
      <div className="text-3xl mb-6">My Favorite Resorts</div>
      <Stack spacing={2}>
        {myResorts.map((item, idx) => (
          <ResortCard key={idx} resortInfo={item} idx={idx} />
        ))}
      </Stack>
    </div>
  );
};

export default MyResorts;
