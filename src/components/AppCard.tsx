import hrmsIcon from "../assets/svg/home/myApps/hrms.svg";
import crmIcon from "../assets/svg/home/myApps/crm.svg";
import alumniIcon from "../assets/svg/home/myApps/alumni.svg";
import myGuruji from "../assets/svg/home/myApps/myGuruji.svg";
import campus from "../assets/svg/home/myApps/campus.svg";
import DMS from "../assets/svg/home/myApps/DMS.svg";
import placement from "../assets/svg/home/myApps/placement.svg";
import travelDesk from "../assets/svg/home/myApps/travelDesk.svg";
import Facility from "../assets/svg/home/myApps/Facility.svg";

const apps = [
  { title: "HRMS", icon: hrmsIcon },
  { title: "CRM", icon: crmIcon },
  { title: "Alumni", icon: alumniIcon },
  { title: "My Guruji", icon: myGuruji },
  { title: "Campus Management", icon: campus },
  { title: "DMS", icon: DMS },
  { title: "Placement", icon: placement },
  { title: "Travel Desk", icon: travelDesk },
  { title: "Facility Management", icon: Facility },
];

const AppCard: React.FC = () => {
  const cols = 3; 

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-4">
      <div className="grid grid-cols-3 rounded-xl overflow-hidden">
        {apps.map((app, index) => {
          const isLastCol = (index + 1) % cols === 0;
          const isLastRow = index >= apps.length - cols;

          return (
            <div
              key={index}
              className={`
                flex flex-col items-center justify-center
                p-4 text-center
                border-gray-200
                ${!isLastCol ? "border-r" : ""}
                ${!isLastRow ? "border-b" : ""}
                hover:bg-gray-50 transition cursor-pointer
              `}
            >
              <img src={app.icon} alt={app.title} className="w-10 h-10 mb-2" />
              <p className="text-sm font-semibold leading-tight">{app.title}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AppCard;