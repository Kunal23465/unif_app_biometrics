
import hrmsIcon from "../assets/svg/home/myApps/HRMS.svg";
import crmIcon from "../assets/svg/home/myApps/CRM.svg";
import alumniIcon from "../assets/svg/home/myApps/Alumni.svg";


const apps = [
  { title: "HRMS", icon: hrmsIcon },
  { title: "CRM", icon: crmIcon },
  { title: "Alumni", icon: alumniIcon },
];

const AppCard: React.FC = () => {
  return (
    <div className="grid grid-cols-3 gap-4">
      {apps.map((app, index) => (
        <div
          key={index}
          className="bg-white rounded-2xl shadow p-4 text-center font-semibold hover:scale-105 transition cursor-pointer"
        >
          <div className="mb-2 flex justify-center">
            <img src={app.icon} alt={app.title} className="w-10 h-10" />
          </div>
          <p>{app.title}</p>
        </div>
      ))}
    </div>
  );
};

export default AppCard;
