import { useNavigate, useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { format } from "date-fns";
import { useAuthContext } from "../hooks/useAuthContext";

export default function SingleUser() {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { slug } = useParams();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [postCount, setPostCount] = useState("");
  const [profileImage, setProfileImage] = useState();
  const [isFollowing, setIsFollowing] = useState(false);
  const [follower, setFollower] = useState();
  const [loading, setLoading] = useState(true);
  const apiUrl = process.env.REACT_APP_DOMAIN_API;

  const getUserBySlug = async () => {
    try {
      const response = await axios.get(`${apiUrl}/user/${slug}`);

      setName(response.data.name);
      setEmail(response.data.email);
      setPostCount(response.data.postCount);
      if (response.data.profileImage) {
        setProfileImage(`${apiUrl}/images/` + response.data.profileImage);
      }
      if (!response.data.profileImage) {
        setProfileImage("https://www.w3schools.com/w3css/img_avatar2.png");
      }

      //? Count Follower
      const countFollower = await axios.get(`${apiUrl}/countFollower/${slug}`, {
        withCredentials: true,
      });
      setFollower(countFollower.data.followerCount);

      //? Check is Following
      const isFollowingResponse = await axios.post(
        `${apiUrl}/checkFollow/${slug}`,
        {
          userId: user._id,
        },
        {
          withCredentials: true,
        }
      );
      setIsFollowing(isFollowingResponse.data.isFollowing);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    try {
      const response = await axios.post(
        `${apiUrl}/follow/${slug}`,
        {
          userId: user._id,
        },
        { withCredentials: true }
      );
      setIsFollowing(response.data.success);
      setFollower((prevFollower) => prevFollower + 1);
    } catch (error) {
      console.error("Error following user:", error);
    }
  };

  useEffect(() => {
    getUserBySlug();
  }, []);

  return (
    <div className="flex flex-col h-screen">
      <div className="mt-28 max-w ml-20 mr-20 p-6 bg-zinc-700 rounded-lg mb-5 overflow-hidden">
        <div className="flex flex-col items-center pb-10">
          <img
            className="w-24 h-24 mb-3 rounded-full shadow-lg"
            src={profileImage}
            alt="Bonnie image"
          />
          <h5 className="mb-1 text-xl font-medium text-gray-200 ">{name}</h5>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {email}
          </span>
          <div className="flex mt-4 md:mt-6">
            {user && user.slug !== slug && (
              <button
                onClick={handleFollow}
                className={`inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white rounded-lg focus:ring-4 focus:outline-none focus:ring-blue-300 ${
                  isFollowing
                    ? "bg-gray-400"
                    : "bg-emerald-400 hover:bg-emerald-600"
                }`}
                disabled={isFollowing}
              >
                {isFollowing ? "Following" : "Follow"}
              </button>
            )}
            {user && user.slug === slug && (
              <button
                className={`inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white rounded-lg focus:ring-4 focus:outline-none focus:ring-blue-300 bg-gray-400`}
                disabled
              >
                Follow
              </button>
            )}
            {!user && (
              <button
                className={`inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white rounded-lg focus:ring-4 focus:outline-none focus:ring-blue-300 bg-gray-400`}
                disabled
              >
                Follow
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-10">
            <div className="p-5 bg-transparent rounded-md ">
              <p className=" items-center px-4 py-2 text-md font-medium text-center text-gray-200 ">
                Followers
              </p>
              <p className=" items-center px-4 py-2 text-md font-medium text-center text-gray-500">
                {follower}
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
