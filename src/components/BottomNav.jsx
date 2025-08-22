import React from "react";
import { Link, useLocation } from "react-router-dom";

const BottomNav = () => {
  const location = useLocation();

  const navItems = [
    { path: "/", icon: "ri-home-4-line", activeIcon: "ri-home-4-fill", label: "Home" },
    { path: "/frontdev/blogs", icon: "ri-news-line", activeIcon: "ri-news-fill", label: "Blogs" },
    { path: "/frontdev/others", icon: "ri-apps-line", activeIcon: "ri-apps-fill", label: "Others" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 md:hidden z-50 bg-white shadow-lg border-t border-gray-100">
      <div className="grid grid-cols-3 h-14">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className="flex flex-col items-center justify-center text-[11px]"
            >
              <i
                className={`${isActive ? item.activeIcon : item.icon} text-[22px] ${
                  isActive ? "text-gray-600" : "text-gray-500"
                }`}
              ></i>
              <span className={isActive ? "text-gray-600 font-medium" : "text-gray-600"}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;
