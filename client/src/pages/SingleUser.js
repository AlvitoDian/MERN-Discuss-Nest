import { useNavigate, useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { format } from "date-fns";

export default function SingleUser() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [postCount, setPostCount] = useState("");

  const getUserById = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/user/${id}`);

      setName(response.data.name);
      setEmail(response.data.email);
      setPostCount(response.data.postCount);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getUserById();
  }, []);

  return (
    <div className="flex flex-col h-screen">
      <div className="mt-28 max-w ml-20 mr-20 p-6 bg-zinc-700 rounded-lg mb-5 overflow-hidden">
        <div className="flex flex-col items-center pb-10">
          <img
            className="w-24 h-24 mb-3 rounded-full shadow-lg"
            src="https://www.w3schools.com/w3css/img_avatar2.png"
            alt="Bonnie image"
          />
          <h5 className="mb-1 text-xl font-medium text-gray-200 ">{name}</h5>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {email}
          </span>
          <div className="flex mt-4 md:mt-6">
            <a
              href="#"
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-emerald-400 rounded-lg hover:bg-emerald-600 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800"
            >
              Follow
            </a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-10">
            <div className="p-5 bg-transparent rounded-md ">
              <p className=" items-center px-4 py-2 text-md font-medium text-center text-gray-200 ">
                Followers
              </p>
              <p className=" items-center px-4 py-2 text-md font-medium text-center text-gray-500">
                99
              </p>
            </div>
            <div className="p-5 bg-transparent rounded-md ">
              <p className=" items-center px-4 py-2 text-md font-medium text-center text-gray-200 ">
                Posts
              </p>
              <p className=" items-center px-4 py-2 text-md font-medium text-center text-gray-500">
                {postCount}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
