import notificationIcon from "../assets/svg/home/notification.svg";
import logout from "../assets/svg/home/logout.svg";
import profilePic from "../assets/svg/home/profilePic.svg";

const ProfileCard = () => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div>
          <img src={profilePic} alt="profilePic" />
        </div>
        <div>
          <h2 className="font-semibold">Kunal Mishra</h2>
          <p className="text-sm text-gray-500">Software Engineer</p>
        </div>
      </div>
      <div className="flex gap-2">
        <button>
          <img src={notificationIcon} alt="notificationIcon" />
        </button>

        <button>
          <img src={logout} alt="logout" />
        </button>
      </div>
    </div>
  );
};

export default ProfileCard;
