import { useNavigate, useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuthContext } from "../hooks/useAuthContext";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function UpdateUser() {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [name, setName] = useState(user.name || "");
  const [email, setEmail] = useState(user.email || "");
  const [profileImage, setProfileImage] = useState();
  const [previewImage, setPreviewImage] = useState();
  const [errorMessages, setErrorMessages] = useState({});
  const apiUrl = process.env.REACT_APP_DOMAIN_API;

  const getUserBySlug = async () => {
    try {
      const response = await axios.get(`${apiUrl}/user/${user.slug}`);

      setName(response.data.name);
      setEmail(response.data.email);
      if (response.data.profileImage) {
        setProfileImage(`${apiUrl}/images/` + response.data.profileImage);
      }
      if (!response.data.profileImage) {
        setProfileImage("https://www.w3schools.com/w3css/img_avatar2.png");
      }
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    getUserBySlug();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const updateUser = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("profileImage", profileImage);

    try {
      const response = await axios.put(
        `${apiUrl}/update-user/${user._id}`,
        formData,
        {
          withCredentials: true,
        }
      );
      window.location.reload();
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="mt-28 max-w ml-20 mr-20 p-6 bg-zinc-700 rounded-lg mb-5 overflow-hidden">
        <div className="flex flex-col items-center pb-10">
          <label
            htmlFor="profileImage"
            className="block text-gray-200 pb-1 font-medium text-2xl pb-5"
          >
            Update Profile
          </label>
          <form onSubmit={updateUser} encType="multipart/form-data">
            <input
              type="file"
              id="profileImage"
              accept=".png, .jpg, .jpeg"
              name="profileImage"
              onChange={handleImageChange}
              style={{ display: "none" }}
            />
            <label
              htmlFor="profileImage"
              className="cursor-pointer transition duration-300 ease-in-out relative items-center flex justify-center"
            >
              {previewImage && (
                <img
                  className="w-24 h-24 mb-3 rounded-full shadow-lg opacity-60 hover:opacity-90 transition duration-300 ease-in-out"
                  src={previewImage}
                  alt="Profile preview"
                />
              )}
              {!previewImage && (
                <img
                  className="w-24 h-24 mb-3 rounded-full shadow-lg opacity-60 hover:opacity-90 transition duration-300 ease-in-out"
                  src={profileImage}
                  alt="Profile image"
                />
              )}
              {/*   {!profileImage && !previewImage && (
                <img
                  className="w-24 h-24 mb-3 rounded-full shadow-lg opacity-60"
                  src="https://www.w3schools.com/w3css/img_avatar2.png"
                  alt="Profile image"
                />
              )} */}

              <div className="absolute">
                <FontAwesomeIcon
                  icon={faCamera}
                  size="xl"
                  className="text-white pt-5 shadow"
                />
              </div>
            </label>
            <span className="text-sm text-gray-500 dark:text-gray-400"></span>

            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-200 pb-1 ">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={name}
                className="w-full border-gray-300 rounded-md p-2 bg-zinc-800 bg-opacity-90 shadow-lg text-gray-200 focus:bg-zinc-800"
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-200 pb-1">
                Email
              </label>
              <input
                type="text"
                name="email"
                value={email}
                className="w-full border-gray-300 rounded-md p-2 bg-zinc-800 bg-opacity-90 shadow-lg text-gray-200"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-400 text-dark font-medium p-2 rounded-md transition duration-300 ease-in-out hover:bg-emerald-600 transform"
            >
              Update
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
