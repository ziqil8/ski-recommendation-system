import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import HomePage from "./components/HomePage.jsx";
import App from "./App.jsx";
import MyResorts from "./components/MyResorts.jsx";
import ResortDetail from "./components/ResortDetail.jsx";
import LoginPage from "./components/LoginPage.jsx";
import RegisterPage from "./components/RegisterPage.jsx";
import LessonDetail from "./components/LessonDetail.jsx";
import PopularSearch from "./components/PopularSearch.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/register",
        element: <RegisterPage />,
      },
      {
        path: "/myresorts",
        element: <MyResorts />,
      },
      {
        path: "/resort/:resortID",
        element: <ResortDetail />,
      },
      {
        path: "/lesson/:lessonID",
        element: <LessonDetail />,
      },
      {
        path: "/resort/popular/:searchType",
        element: <PopularSearch />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
