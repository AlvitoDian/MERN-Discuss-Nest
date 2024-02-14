import React from "react";
import { Link } from "react-router-dom";

export default function UserOnlineCard({ id, name, email, userId }) {
  return (
    <div>
      <p className="mb-3 text-gray-200">Current User's Online</p>

      <ul className="max-w-md">
        <li key={id} className="pb-3 sm:pb-4">
          <Link to={`user/${userId}`}>
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <div className="relative">
                <img
                  className="w-10 h-10 rounded-full"
                  src={"https://www.w3schools.com/w3css/img_avatar2.png"}
                  alt=""
                />
                <span className="bottom-0 left-7 absolute  w-3.5 h-3.5 bg-green-400 border-2 border-white dark:border-gray-800 rounded-full" />
              </div>

              {/* <div className="flex-shrink-0">
              <img
                className="w-8 h-8 rounded-full"
                src={"https://www.w3schools.com/w3css/img_avatar2.png"}
                alt={""}
              />
              <span className="bottom-0 left-7 absolute  w-3.5 h-3.5 bg-green-400 border-2 border-white dark:border-gray-800 rounded-full"></span>
            </div> */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate text-gray-200">
                  {name}
                </p>
                <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                  {email}
                </p>
              </div>
            </div>
          </Link>
        </li>
      </ul>
    </div>
  );
}
