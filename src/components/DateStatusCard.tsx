const DateStatusCard = () => {
  const today = new Date();

  // day number
  const day = today.getDate();

  // ordinal suffix (st, nd, rd, th)
  const getOrdinal = (n: number) => {
    if (n > 3 && n < 21) return "th";
    switch (n % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  // weekday name
  const weekday = today.toLocaleDateString("en-IN", {
    weekday: "long",
  });

  // month + year
  const monthYear = today.toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="bg-white rounded-2xl shadow p-4">
      <p className="text-2xl font-bold">
        {day}
        <sup className="text-sm">{getOrdinal(day)}</sup>{" "}
        <span className="text-base font-medium">{weekday}</span>
      </p>

      <p className="text-sm text-gray-500 mb-3">{monthYear}</p>

      <p className="text-sm text-gray-500 mb-2">This week status</p>

      <div className="flex justify-between">
        {["M", "T", "W", "T", "F", "S"].map((d, i) => (
          <div key={i} className="flex flex-col items-center text-xs">
            {/* DAY FIRST */}
            <span className="mb-1">{d}</span>

            {/* TICK CIRCLE BELOW */}
            <div
              className={`w-6 h-6 rounded-full border flex items-center justify-center
          ${i >= 3 ? "bg-green-500 border-green-500" : "border-gray-300"}`}
            >
              {i >= 3 && <span className="text-white text-xs">✓</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DateStatusCard;
