import { Box, Button, Divider, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { toast } from "react-toastify";
import AuthService from "../services/auth.service";
import { useNavigate } from "react-router-dom";

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

const RegisterPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleRegister = async () => {
    try {
      await AuthService.handleRegister(username, email, password);
      toast.success("New user is registered successfully.");
      navigate("/login");
    } catch (error) {
      console.log(error);
      toast.error("Failed to register new user.");
    }
  };

  return (
    <Box sx={style}>
      <Typography id="modal-modal-title" variant="h6" component="h2">
        Register
      </Typography>
      <Divider />
      <Box className="p-4 flex flex-col gap-3">
        <div>
          <Typography>Username</Typography>
          <TextField
            id="outlined-basic"
            variant="outlined"
            className="w-full"
            onChange={handleUsernameChange}
          />
        </div>
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
          onClick={handleRegister}
        >
          Register
        </Button>
      </div>
    </Box>
  );
};

export default RegisterPage;
