import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { NavLink } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../store/userContext";

export default function Navbar() {
  const { user } = useContext(UserContext);

  return (
    <div className="sticky top-0 z-50">
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <NavLink to={""}>Best Ski Resorts in Europe</NavLink>
          </Typography>
          {user ? (
            <NavLink to={"/myresorts"}>
              <Button color="inherit">My Resorts</Button>
            </NavLink>
          ) : (
            <>
              <NavLink to={"/login"}>
                <Button color="inherit">Login</Button>
              </NavLink>
              <NavLink to={"/register"}>
                <Button color="inherit">Register</Button>
              </NavLink>
            </>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
}
