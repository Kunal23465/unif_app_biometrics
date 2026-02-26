import { useState } from "react";
import { useNavigate } from "react-router-dom";
import power from "../assets/svg/home/power.svg";
import profile from "../assets/svg/home/profile.svg";
import notifications from "../assets/svg/home/notifications.svg";
import logo from "../assets/svg/login/Logo.svg";


const Header = () => {
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  

  //   Logout
  const confirmLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("emplId");
    sessionStorage.clear();
    navigate("/", { replace: true });
  };

  return (
    <>
      <div className="bg-gradient-to-r from-[#0f2b46] to-[#1e4b6e] h-50 px-4 pt-6 text-white">
        <div className="flex items-center justify-between mt-10">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img src={logo} alt="logo" />
          </div>

          {/* Right Icons */}
          <div className="flex gap-3">
            <button >
              <img
                src={notifications}
                className="cursor-pointer"
                alt="notification"
              />
            </button>

            {/* Logout */}
            <button onClick={() => setShowLogoutModal(true)}>
              <img src={power} className="cursor-pointer" alt="logout" />
            </button>

            <img src={profile} className="cursor-pointer" alt="profile" />
          </div>
        </div>
      </div>

      {/*  Logout Modal */} 
      {showLogoutModal && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setShowLogoutModal(false)} 
        >
          <div
            className="bg-white rounded-2xl p-6 w-80 shadow-2xl text-center
                       transform transition-all duration-200 scale-100 opacity-100"
            onClick={(e) => e.stopPropagation()} 
          >
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Are you sure you want to logout?
            </h2>

            <div className="flex justify-center gap-4 mt-4">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
              >
                Cancel
              </button>

              <button
                onClick={confirmLogout}
                className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;