import touchId from "../assets/svg/attendance/touch.svg";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  getLatestPunch,
  punchService,
  type PunchDataRequest,
  type PunchLatestResponse,
} from "../services/modules/punch/punch.service";

const Attendance: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const navData = location.state as any;

  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  const [punchIn, setPunchIn] = useState<string | null>(null);
  const [punchOut, setPunchOut] = useState<string | null>(null);
  const [totalHours, setTotalHours] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [latLng, setLatLng] = useState<{ lat: number; lng: number } | null>(
    navData?.latitude && navData?.longitude
      ? { lat: navData.latitude, lng: navData.longitude }
      : null,
  );

  //  change time format
  const formatTo12Hour = (time: string | null) => {
    if (!time) return "";

    const cleanTime = time.split(".")[0];
    const [hourStr, minute] = cleanTime.split(":");

    let hour = parseInt(hourStr, 10);
    const ampm = hour >= 12 ? "PM" : "AM";

    hour = hour % 12;
    hour = hour ? hour : 12;

    return `${hour}:${minute} ${ampm}`;
  };

  const calculateHours = (start: string, end: string) => {
    const today = new Date().toISOString().split("T")[0];
    const startTime = new Date(`${today}T${start}`);
    const endTime = new Date(`${today}T${end}`);
    const diffMs = endTime.getTime() - startTime.getTime();
    return (diffMs / (1000 * 60 * 60)).toFixed(2);
  };

  // Fetch latest punch
  useEffect(() => {
    const fetchLatestPunch = async () => {
      const emplId = localStorage.getItem("emplId");
      if (!emplId) return;

      try {
        const latest: PunchLatestResponse = await getLatestPunch(emplId);
        setPunchIn(latest.punchIn || null);
        setPunchOut(latest.punchOut || null);

        if (latest.punchIn && latest.punchOut) {
          setTotalHours(calculateHours(latest.punchIn, latest.punchOut));
        }
      } catch (err) {
        console.error("Failed to fetch latest punch", err);
      }
    };

    fetchLatestPunch();
  }, []);

  // Live Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      );
      setDate(
        now.toLocaleDateString([], {
          weekday: "long",
          day: "numeric",
          month: "short",
        }),
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Mark Attendance

  const markAttendance = async () => {
    if (loading) return;

    if (!window.flutter_inappwebview) {
      alert("Biometric service not available");
      return;
    }

    try {
      setLoading(true);

      const res =
        await window.flutter_inappwebview.callHandler("markAttendance");

      if (!res?.success) {
        alert("Authentication Failed");
        setLoading(false);
        return;
      }

      if (res.latitude && res.longitude) {
        setLatLng({ lat: res.latitude, lng: res.longitude });
      }

      const emplId = localStorage.getItem("emplId");
      if (!emplId) {
        alert("Employee ID not found. Please login again.");
        setLoading(false);
        return;
      }

      const payload: PunchDataRequest = { emplId };
      const apiRes = await punchService(payload);

      if (apiRes.valid !== "true") {
        alert(apiRes.message || "Failed to record punch");
        setLoading(false);
        return;
      }

      // Update state directly from punch response

      setPunchIn((apiRes as any).punchIn || null);
      setPunchOut((apiRes as any).punchOut || null);

      if ((apiRes as any).punchIn && (apiRes as any).punchOut) {
        setTotalHours(
          calculateHours((apiRes as any).punchIn, (apiRes as any).punchOut),
        );
      } else {
        setTotalHours(null);
      }

      alert(apiRes.message || "Punch recorded successfully");

      // Auto go back
      setTimeout(() => {
        navigate(-1);
      }, 500);
    } catch (err) {
      console.error(err);
      alert("Error during attendance marking");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 relative overflow-hidden">
      {latLng && (
        <div className="w-full h-[55vh]">
          <iframe
            width="100%"
            height="100%"
            loading="lazy"
            src={`https://maps.google.com/maps?q=${latLng.lat},${latLng.lng}&z=15&output=embed`}
          />
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[32px] shadow-2xl px-6 pt-6 pb-8">
        <h2 className="text-3xl font-semibold text-center">{time}</h2>
        <p className="text-center text-gray-500 mt-1 mb-6">{date}</p>

        {/* Punch Button */}
        <div className="flex justify-center mb-8">
          <button
            onClick={markAttendance}
            disabled={loading}
            className={`
              w-40 h-40 rounded-full
              bg-gradient-to-b from-gray-100 to-gray-200
              shadow-inner
              flex items-center justify-center
              transition
              ${loading ? "opacity-50 cursor-not-allowed" : "active:scale-95"}
            `}
          >
            {loading ? (
              <span className="text-gray-600 font-medium">Processing...</span>
            ) : (
              <img src={touchId} alt="touchId" className="w-14 h-14" />
            )}
          </button>
        </div>

        {/* Stats Card */}
        <div className="bg-gray-50 rounded-2xl p-4 grid grid-cols-3 text-center text-sm">
          <div>
            <p className="font-semibold">{formatTo12Hour(punchIn) || "--:--"}</p>
            <p className="text-gray-500 mt-1">Punch In</p>
          </div>

          <div>
            <p className="font-semibold">{formatTo12Hour(punchOut) || "--:--"}</p>
            <p className="text-gray-500 mt-1">Punch Out</p>
          </div>

          <div>
            <p className="font-semibold">
              {totalHours ? `${totalHours} hrs` : "--:--"}
            </p>
            <p className="text-gray-500 mt-1">Total Hrs</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Attendance;
