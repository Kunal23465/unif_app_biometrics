import AppCard from "../components/AppCard";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Header from "../components/Header";
import DateStatusCard from "../components/DateStatusCard";
import PunchCard from "../components/PunchCard";

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
      const res = await window.flutter_inappwebview.callHandler(
        "markAttendance",
        {
          requireBiometric: false,
        },
      );

      if (!res?.success) {
        alert(res.message || "Attendance failed");
        return;
      }

      // Pass location + timestamp to Attendance page
      navigate("/attendance", {
        state: {
          latitude: res.latitude,
          longitude: res.longitude,
          timestamp: res.timestamp,
        },
      });
    } catch (error) {
      console.error("Attendance error:", error);
      alert("Something went wrong");
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="px-4 -mt-12 space-y-4 pb-6">
        <DateStatusCard />
        <PunchCard onPunch={handleAttendanceClick} />
        <AppCard />
      </div>
    </div>
  );
};

export default Home;
