import { useEffect, useState } from "react";
import punch from "../assets/svg/punch/carbon_touch.svg";
import punch_in_icon from "../assets/svg/punch/punch_in.svg";
import punch_out_icon from "../assets/svg/punch/punch_out.svg";
import total_hrs_icon from "../assets/svg/punch/total_hrs.svg";
import {
  getLatestPunch,
  type PunchLatestResponse,
} from "../services/modules/punch/punch.service";

interface Props {
  onPunch: () => void;
}

const PunchCard: React.FC<Props> = ({ onPunch }) => {
  const [punchIn, setPunchIn] = useState<string | null>(null);
  const [punchOut, setPunchOut] = useState<string | null>(null);
  const [totalHours, setTotalHours] = useState<string | null>(null);

  // Calculate total hours from punchIn and punchOut
  const calculateHours = (start: string, end: string) => {
    const today = new Date().toISOString().split("T")[0];
    const startTime = new Date(`${today}T${start}`);
    const endTime = new Date(`${today}T${end}`);
    const diffMs = endTime.getTime() - startTime.getTime();
    return (diffMs / (1000 * 60 * 60)).toFixed(2);
  };
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

  // Fetch latest punch data on mount
  useEffect(() => {
    const fetchLatest = async () => {
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

    fetchLatest();
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow p-4">
      <div className="grid grid-cols-3 text-center text-sm mb-4">
        {/* Punch In */}
        <div className="flex flex-col items-center">
          <img src={punch_in_icon} alt="punch in" />
          <p className="text-gray-500 mt-3">Punch In</p>
          <p className="font-semibold">{formatTo12Hour(punchIn) || "--:--:--"}</p>
        </div>

        {/* Punch Out */}
        <div className="flex flex-col items-center">
          <img src={punch_out_icon} alt="punch out" />
          <p className="text-gray-500 mt-3">Punch Out</p>
          <p className="font-semibold">{formatTo12Hour(punchOut) || "--:--:--"}</p>
        </div>

        {/* Total Hours */}
        <div className="flex flex-col items-center">
          <img src={total_hrs_icon} alt="total hrs" />
          <p className="text-gray-500 mt-3">Total Hr</p>
          <p className="font-semibold">
            {totalHours ? `${totalHours} hrs` : "--:--:--"}
          </p>
        </div>
      </div>

      <button
        onClick={onPunch}
        className="w-full bg-yellow-500 text-white py-3 rounded-full
             active:scale-95 transition flex items-center justify-center gap-2"
      >
        <img src={punch} alt="punch" className="w-5 h-5" />
        <span>{punchOut ? "Punch-In" : "Punch-Out"}</span>
      </button>
    </div>
  );
};

export default PunchCard;
