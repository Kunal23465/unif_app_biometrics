import ProfileCard from "../components/ProfileCard";
import AppCard from "../components/AppCard";
import AttendanceCard from "../components/AttendanceCard";
import apps from "../assets/svg/home/apps.svg";
import touchId from "../assets/svg/attendance/touch_1.svg";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(false);

  const handleAttendanceClick = async () => {
    if (checking) return;

    if (!window.flutter_inappwebview) {
      alert("Service not available");
      return;
    }

    setChecking(true);

    try {
      const res =
        await window.flutter_inappwebview.callHandler("markAttendance");

      if (!res.success) {
        alert(res.message || "Attendance failed");
        return;
      }

      console.log("Time:", res.timestamp);
      console.log("Lat:", res.latitude);
      console.log("Lng:", res.longitude);

      navigate("/attendance");
    } catch (error) {
      console.error("Attendance error:", error);
      alert("Something went wrong");
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-6 mt-10">
      <div className="max-w-md mx-auto">
        <ProfileCard />

        <h3 className="mt-8 mb-4 text-lg font-semibold flex items-center gap-2">
          <img src={apps} alt="apps" className="w-5 h-5" />
          <span>My Apps</span>
        </h3>

        <AppCard />

        <h3 className="mt-8 mb-4 text-lg font-semibold flex items-center gap-2">
          <img src={touchId} alt="attendance" className="w-5 h-5" />
          <span>Attendance</span>
        </h3>

        <AttendanceCard onClick={handleAttendanceClick} />
      </div>
    </div>
  );
};

export default Home;
