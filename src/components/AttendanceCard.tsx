import touchId from "../assets/svg/attendance/touch.svg";

interface Props {
  onClick: () => void;
}

const AttendanceCard: React.FC<Props> = ({ onClick }) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <div className="flex justify-center">
        <button
          onClick={onClick}
          className="w-24 h-24 rounded-full bg-gray-100 shadow-inner 
                     flex items-center justify-center 
                     hover:scale-105 transition"
        >
          <img src={touchId} alt="touchId" className="w-12 h-12" />
        </button>
      </div>

      <p className="mt-4 text-gray-600 text-center font-semibold">
        Mark Attendance
      </p>
    </div>
  );
};

export default AttendanceCard;
