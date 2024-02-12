import { useNavigate, useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import axios from "axios";

export default function UpdateUser() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const getUserById = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/user/update/${id}`
      );

      setName(response.data.name);
      setEmail(response.data.email);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getUserById();
  }, []);

  const updateUser = async (e) => {
    e.preventDefault();

    console.log("Form submitted:", { name, email });
  };

  return (
    <div className="mt-28 max-w ml-20 mr-20 p-6 bg-white border border-gray-200 rounded-lg shadow-lg shadow-indigo-200/50 mb-5 overflow-hidden">
      <div className="flex flex-col items-center pb-10">
        <img
          className="w-24 h-24 mb-3 rounded-full shadow-lg"
          src="https://www.w3schools.com/w3css/img_avatar2.png"
          alt="Bonnie image"
        />
        <h5 className="mb-1 text-xl font-medium text-gray-900 ">{name}</h5>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {email}
        </span>
        <form onSubmit={updateUser}>
          <div className="mb-3">
            <input
              type="text"
              onChange={(e) => setTitle(e.target.value)}
              value={name}
              id="default-input"
              className="block p-2.5 w-full text-sm text-gray-900 bg-blue-100 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-blue-100 dark:border-blue-300 dark:placeholder-gray-400 dark:text-gray-600 dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Write your titles here..."
            />
            <input
              type="text"
              onChange={(e) => setTitle(e.target.value)}
              value={email}
              id="default-input"
              className="block p-2.5 w-full text-sm text-gray-900 bg-blue-100 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-blue-100 dark:border-blue-300 dark:placeholder-gray-400 dark:text-gray-600 dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Write your titles here..."
            />
          </div>

          <button className="mt-5 text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">
            Send
          </button>
          {errorMessages.length > 0 && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mt-5">
              <p>Error : </p>
              <ul>
                {errorMessages.map((errorMessage, index) => (
                  <li key={index}>{errorMessage}</li>
                ))}
              </ul>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
