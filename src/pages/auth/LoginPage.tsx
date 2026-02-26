import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import Logo from "../../assets/svg/login/Logo.svg";
import { loginService } from "../../services/modules/auth/login.service";
import CustomInput from "../../utils/CustomInput";
import { sendOtpService } from "../../services/modules/auth/otp.service";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const [emplId, setEmplId] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const validateForm = () => {
    if (!emplId.trim()) {
      setErrorMsg("Employee ID is required");
      return false;
    }
    if (!password.trim()) {
      setErrorMsg("Password is required");
      return false;
    }
    if (emplId.trim().length < 1) {
      setErrorMsg("Employee ID must be at least 1 character");
      return false;
    }
    if (password.trim().length < 6) {
      setErrorMsg("Password must be at least 6 characters");
      return false;
    }
    setErrorMsg(""); // Clear error if valid
    return true;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);

      const response = await loginService({
        emplId: emplId,
        password,
      });

      localStorage.setItem("accessToken", response.accessToken);
      localStorage.setItem("refreshToken", response.refreshToken);

  
      localStorage.setItem("emplId", response.emplId);
      localStorage.setItem("phoneNumber", response.phoneNumber);

  
      // await sendOtpService({
      //   emplId: response.emplId,
      //   phoneNumber: response.phoneNumber,
      // });

      navigate("/home", { replace: true });
    } catch (error) {
      const err = error as AxiosError<any>;
      setErrorMsg(
        err?.response?.data?.message || "Login failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-r from-[#0f2b46] to-[#1e4b6e] relative overflow-hidden">
      {/* LOGO */}
      <div className="flex flex-col items-center mt-30">
        <img src={Logo} alt="logo" />
        <h1 className="text-white text-[26px] font-semibold mt-3 tracking-wide">
          Employee Connect
        </h1>
      </div>

      {/* BOTTOM SHEET */}
      <div className="absolute top-[33%] bottom-0 w-full bg-white rounded-t-[36px] px-6 pt-6 pb-8 shadow-xl overflow-auto">
        <h2 className="text-[22px] font-bold text-[#1C1C1C] mb-6">Log In</h2>

        {/* EMPLOYEE ID */}
        <CustomInput
          label="Employee ID"
          type="text"
          placeholder="Enter Employee ID"
          value={emplId}
          onChange={setEmplId}
          validators={[
            (val) => (!val ? "Employee ID is required" : null),
            (val) =>
              val && val.length < 1 ? "ID must be at least 1 character" : null,
          ]}
        />

        {/* PASSWORD */}
        <CustomInput
          label="Password"
          type="password"
          placeholder="********"
          value={password}
          onChange={setPassword}
          validators={[
            (val) => (!val ? "Password is required" : null),
            (val) =>
              val && val.length < 6
                ? "Password must be at least 6 characters"
                : null,
          ]}
        />

        {/* ERROR MESSAGE */}
        {/* {errorMsg && <p className="text-red-500 text-sm mb-3 font-medium">{errorMsg}</p>} */}

        {/* REMEMBER & FORGOT */}
        <div className="flex items-center justify-between mb-6">
          <label className="flex items-center gap-2 text-[14px] text-[#5F6368] cursor-pointer">
            {/* <input
              type="checkbox"
              checked={remember}
              onChange={() => setRemember(!remember)}
              className="w-[16px] h-[16px] accent-[#3AA6A6]"
            /> */}
            {/* Remember me */}
          </label>

          <button
            type="button"
            onClick={() => navigate("/enter-opt")}
            className="text-[14px] text-amber-400 font-medium"
          >
            Forgot Password?
          </button>
        </div>

        {/* LOGIN BUTTON */}
        <button
          type="button"
          onClick={handleLogin}
          disabled={loading}
          className="w-full h-[52px] rounded-full bg-amber-400 text-white text-[16px] font-semibold shadow-md active:scale-[0.97] transition-transform duration-150 disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Log In"}
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
