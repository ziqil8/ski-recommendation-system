import { Box, Button, Divider, TextField, Typography } from "@mui/material";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../store/userContext";
import AuthService from "../services/auth.service";
import { toast } from "react-toastify";

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

const LoginPage = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleLogin = async () => {
    try {
      const res = await AuthService.handleLogin(email, password);
      if (res.status < 400) {
        setUser(res.data);
        localStorage.setItem("user", JSON.stringify(res.data));
        navigate("/");
      } else {
        toast.error("Wrong email or password.");
      }
    } catch (error) {
      console.log(error);
      toast.error("Wrong email or password.");
    }
  };

  return (
    <Box sx={style}>
      <Typography id="modal-modal-title" variant="h6" component="h2">
        Login
      </Typography>
      <Divider />
      <Box className="p-4 flex flex-col gap-3">
        <div>
          <Typography>Email</Typography>
          <TextField
            id="outlined-basic"
            variant="outlined"
            className="w-full"
            onChange={handleEmailChange}
          />
        </div>
        <div>
          <Typography>Password</Typography>
          <TextField
            id="outlined-basic"
            variant="outlined"
            className="w-full"
            type="password"
            onChange={handlePasswordChange}
          />
        </div>
      </Box>

      <div className="w-full flex justify-end gap-4">
        <Button
          edge="end"
          aria-label="login"
          size="small"
          onClick={handleLogin}
        >
          Login
        </Button>
        <Button
          edge="end"
          aria-label="register"
          size="small"
          onClick={() => navigate("/register")}
        >
          Register
        </Button>
      </div>
    </Box>
  );
};

export default LoginPage;
