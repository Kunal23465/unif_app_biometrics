import touchId from "../assets/svg/attendance/touch.svg";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const Attendance: React.FC = () => {
  const navigate = useNavigate();

  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  const [punchIn, setPunchIn] = useState<string | null>(null);
  const [punchOut, setPunchOut] = useState<string | null>(null);
  const [totalHours, setTotalHours] = useState<string | null>(null);

  //  Auto Update Time Every Second
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();

      const formattedTime = now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      const formattedDate = now.toLocaleDateString([], {
        weekday: "long",
        day: "numeric",
        month: "short",
      });

      setTime(formattedTime);
      setDate(formattedDate);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  const calculateHours = (start: string, end: string) => {
    const today = new Date().toISOString().split("T")[0];

    const startTime = new Date(`${today}T${start}:00`);
    const endTime = new Date(`${today}T${end}:00`);

    const diffMs = endTime.getTime() - startTime.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);

    return diffHours.toFixed(2);
  };

  const markAttendance = async () => {
    if (!window.flutter_inappwebview) {
      alert("Biometric service not available");
      return;
    }

    try {
      const res =
        await window.flutter_inappwebview.callHandler("markAttendance");

      if (!res.success) {
        alert("Authentication Failed");
        return;
      }

      const currentTime = res.timestamp;

      //  First scan  Punch In
      if (!punchIn) {
        setPunchIn(currentTime);
        alert("Punch In at " + currentTime);
        return;
      }

      //  last update Punch Out
      setPunchOut(currentTime);

      const hours = calculateHours(punchIn, currentTime);
      setTotalHours(hours);

      alert("Punch Out updated at " + currentTime);
    } catch (e) {
      alert("Error communicating with Flutter");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 p-6 mt-10">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-6">
        {/* Time */}
        <h2 className="text-3xl font-semibold text-center mb-2">{time}</h2>

        {/*  Dynamic Date  Weather   City */}
        <p className="text-center text-gray-500 mb-6">{date}</p>

        <div className="flex justify-center mb-8">
          <button
            className="w-40 h-40 rounded-full bg-gray-100 shadow-inner flex items-center justify-center hover:scale-105 transition"
            onClick={markAttendance}
          >
            <img src={touchId} alt="touchId" className="w-16 h-16" />
          </button>
        </div>

        <div className="grid grid-cols-3 text-center border-t pt-4 text-sm text-gray-600">
          <div>
            <p className="font-semibold">{punchIn || "--:--"}</p>
            <p className="mt-1">Punch In</p>
          </div>

          <div>
            <p className="font-semibold">{punchOut || "--:--"}</p>
            <p className="mt-1">Punch Out</p>
          </div>

          <div>
            <p className="font-semibold">
              {totalHours ? totalHours + " hrs" : "--:--"}
            </p>
            <p className="mt-1">Total Hrs</p>
          </div>
        </div>

        <button
          onClick={() => navigate("/")}
          className="mt-6 w-full bg-blue-500 text-white py-2 rounded-xl"
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default Attendance;
