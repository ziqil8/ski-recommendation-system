import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/Navbar";
import { UserContext } from "./store/userContext";
import { useState } from "react";
import AuthService from "./services/auth.service";

const App = () => {
  const [currentUser, setCurrentUser] = useState(AuthService.getCurrentUser());
  const [myResorts, setMyResorts] = useState([]);
  const [myResortsSet, setMyResortsSet] = useState(new Set());
  const [myLessonsSet, setMyLessonsSet] = useState(new Set());

  const userContextValue = {
    user: currentUser,
    setUser: setCurrentUser,
    myResorts: myResorts,
    setMyResorts: setMyResorts,
    myResortsSet: myResortsSet,
    setMyResortsSet: setMyResortsSet,
    myLessonsSet: myLessonsSet,
    setMyLessonsSet: setMyLessonsSet,
  };

  return (
    <UserContext.Provider value={userContextValue}>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition:Bounce
      />
      <Navbar />
      <Outlet />
    </UserContext.Provider>
  );
};

export default App;
