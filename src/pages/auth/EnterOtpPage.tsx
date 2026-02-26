import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/svg/login/Logo.svg";
import CustomInput from "../../utils/CustomInput";
import { sendValidationService } from "../../services/modules/auth/otp.validate.service";

const EnterOtpPage: React.FC = () => {
  const navigate = useNavigate();

  const [enteredOtp, setEnteredOtp] = useState("");
  const [emplId, setEmplId] = useState(""); 
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");


  useEffect(() => {
    const storedEmplId = localStorage.getItem("emplId");
    if (storedEmplId) {
      setEmplId(storedEmplId);
    } else {
      setErrorMsg("Employee ID not found. Please login again.");
    }
  }, []);

  const handleVerifyOtp = async () => {
    if (!enteredOtp) {
      setErrorMsg("OTP is required");
      return;
    }

    if (!emplId) {
      setErrorMsg("Employee ID missing. Cannot verify OTP.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const res = await sendValidationService({
        emplId: emplId,
        otp: enteredOtp,
      });

      if (res.valid === "true") {
        navigate("/home");
      } else {
        setErrorMsg(res.message);
      }
    } catch (err) {
      setErrorMsg("OTP validation failed");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-r from-[#0f2b46] to-[#1e4b6e] relative overflow-hidden">
      <div className="flex flex-col items-center mt-30">
        <img src={Logo} alt="logo" />
        <h1 className="text-white text-[26px] font-semibold mt-3 tracking-wide">
          Employee Connect
        </h1>
      </div>

      <div className="absolute top-[33%] bottom-0 w-full bg-white rounded-t-[36px] px-6 pt-6 pb-8 shadow-xl overflow-auto">
        <h2 className="text-[22px] font-bold text-[#1C1C1C] mb-6">Enter OTP</h2>

        <CustomInput
          label="Enter OTP"
          type="text"
          placeholder=""
          value={enteredOtp}
          onChange={setEnteredOtp}
          validators={[val => (!val ? "OTP is required" : null)]}
        />

        {errorMsg && <p className="text-red-500 mt-2">{errorMsg}</p>}

        <button
          type="button"
          onClick={handleVerifyOtp}
          disabled={loading}
          className="w-full h-[52px] rounded-full bg-amber-400 text-white text-[16px] font-semibold shadow-md active:scale-[0.97] transition-transform duration-150 disabled:opacity-60 mt-4"
        >
          {loading ? "Verifying..." : "Enter OTP"}
        </button>
      </div>
    </div>
  );
};

export default EnterOtpPage;