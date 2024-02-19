import { useState, useEffect } from "react";
import PostCard from "../components/PostCard";
import Pagination from "../components/Pagination";
import UserOnlineCard from "../components/UserOnlineCard";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";
import { useAuthContext } from "../hooks/useAuthContext";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import SkeletonPostCard from "../components/skeleton/SkeletonPostCard";

export default function Forum() {
  //? Dependencies Section
  const navigate = useNavigate();
  const { user } = useAuthContext();
  //? Dependencies Section End

  //? Data State Handle Section
  const [userId, setUserId] = useState("");
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [body, setBody] = useState("");
  const [errorMessages, setErrorMessages] = useState({});
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [postImage, setPostImage] = useState();
  const [previewImage, setPreviewImage] = useState();
  const [isLoading, setIsLoading] = useState(true);
  //? Data State Handle Section End

  //? Pagination Section
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(8);
  const indexOfLastItem = currentPage * postsPerPage;
  const indexOfFirstItem = indexOfLastItem - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstItem, indexOfLastItem);
  //? Pagination End

  //? API Section
  const apiUrl = process.env.REACT_APP_DOMAIN_API;
  //? API Section End

  //? Image Preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setPostImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  //? Get All Posts
  const getPosts = async () => {
    try {
      const response = await axios.get(`${apiUrl}/posts`, {
        withCredentials: true,
      });

      const updatedPosts = response.data.map((post) => ({
        ...post,
        userName: post.userId.name,
      }));

      setPosts(updatedPosts);

      setTimeout(() => {
        setPosts(updatedPosts);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.error("Unauthorized access. Redirect or show login form.");
        return;
      } else {
        console.error("Error fetching posts:", error);
      }
    }
  };

  //? Get Online Users
  const getOnlineUsers = async () => {
    try {
      const response = await axios.get(`${apiUrl}/online-users`, {
        withCredentials: true,
      });

      const updatedUsers = response.data.map((onlineUsers) => ({
        ...onlineUsers,
      }));

      setOnlineUsers(updatedUsers);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.error("Unauthorized access. Redirect or show login form.");

        return;
      } else {
        console.error("Error fetching user online:", error);
      }
    }
  };

  useEffect(() => {
    getPosts();
    getOnlineUsers();
  }, []);

  //? Add Post
  const addPost = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("userId", user._id);
      formData.append("title", title);
      formData.append("category", category);
      formData.append("body", body);

      if (postImage) {
        formData.append("postImage", postImage);
      }

      const response = await axios.post(`${apiUrl}/add-post`, formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      navigate("/forum");

      setPosts([{ ...response.data, userName: user.name }, ...posts]);

      setUserId("");
      setTitle("");
      setCategory("");
      setBody("");
      setPostImage(null);
      setPreviewImage(null);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.errors) {
        const validationErrors = error.response.data.errors.map(
          (validationError) => validationError.msg
        );

        setErrorMessages(validationErrors);
      } else {
        console.error("Error:", error.message);
      }
    }
  };

  //? Search Filter
  const searchFilter = (e) => {
    const searchFilter = e.target.value.toLowerCase();

    setIsLoading(true); // Set isLoading to true when filtering

    if (searchFilter.trim() === "") {
      getPosts();
    } else {
      const filteredPosts = posts.filter((post) => {
        return (
          post.title.toLowerCase().includes(searchFilter) ||
          post.userName.toLowerCase().includes(searchFilter) ||
          post.body.toLowerCase().includes(searchFilter)
        );
      });

      setPosts(filteredPosts);

      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }
  };

  //? Category Filter
  const categoryFilter = () => {
    const techCheckbox = document.getElementById("tech");
    const designCheckbox = document.getElementById("design");
    const entertainmentCheckbox = document.getElementById("entertainments");

    const techChecked = techCheckbox.checked;
    const designChecked = designCheckbox.checked;
    const entertainmentChecked = entertainmentCheckbox.checked;

    setIsLoading(true); // Set isLoading to true when filtering

    if (!techChecked && !designChecked && !entertainmentChecked) {
      getPosts();
    } else {
      const filteredPosts = posts.filter((post) => {
        const postCategories = post.category.toLowerCase();
        console.log(postCategories);

        return (
          (techChecked && postCategories.includes("tech")) ||
          (designChecked && postCategories.includes("design")) ||
          (entertainmentChecked && postCategories.includes("entertainment"))
        );
      });

      setPosts(filteredPosts);

      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }
  };

  return (
    <div className="bg-gradient-to-b from-neutral-900 to-neutral-900 shadow">
      <div className="ml-10 mr-10 items-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-10 pt-28 pb-9">
          <div>
            <p className="mb-3 text-gray-200 font-medium">Filter Topics</p>
            <>
              <ul className="w-48 text-sm font-medium bg-zinc-700 border border-emerald-300 rounded-lg">
                <li className="w-full border-b border-gray-200 rounded-t-lg dark:border-gray-600">
                  <div className="flex items-center ps-3">
                    <input
                      id="tech"
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                      onChange={categoryFilter}
                    />
                    <label
                      htmlFor="tech"
                      className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >
                      Tech
                    </label>
                  </div>
                </li>
                <li className="w-full border-b border-gray-200 rounded-t-lg dark:border-gray-600">
                  <div className="flex items-center ps-3">
                    <input
                      id="design"
                      type="checkbox"
                      defaultValue=""
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                      onChange={categoryFilter}
                    />
                    <label
                      htmlFor="design"
                      className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >
                      Design
                    </label>
                  </div>
                </li>
                <li className="w-full border-gray-200 rounded-t-lg dark:border-gray-600">
                  <div className="flex items-center ps-3">
                    <input
                      id="entertainments"
                      type="checkbox"
                      defaultValue=""
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                      onChange={categoryFilter}
                    />
                    <label
                      htmlFor="entertainments"
                      className="w-full py-3 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >
                      Entertainment
                    </label>
                  </div>
                </li>
              </ul>
            </>
          </div>
          <div className="col-span-3">
            {!user && (
              <div className="max-w-7xl p-6 bg-emerald-400 rounded-lg shadow-lg shadow-emerald-200/50 mb-5">
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-900 dark:text-dark"
                >
                  Login first to Discuss Together...
                </label>
              </div>
            )}
            {user && (
              <div className="max-w-7xl p-6 bg-emerald-500 rounded-lg shadow-lg shadow-emerald-300/50 mb-5">
                <label
                  htmlFor="message"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-dark"
                >
                  Share your Discussion
                </label>
                <form onSubmit={addPost} encType="multipart/form-data">
                  <input
                    type="file"
                    id="postImage"
                    accept=".png, .jpg, .jpeg"
                    name="postImage"
                    onChange={handleImageChange}
                    style={{ display: "none" }}
                  />
                  <div className="mb-3">
                    <input
                      type="text"
                      onChange={(e) => setTitle(e.target.value)}
                      value={title}
                      id="default-input"
                      className="block p-2.5 w-full text-sm text-gray-300 bg-zinc-700 rounded-lg border border-gray-300 focus:ring-zinc-500 focus:border-zinc-500 dark:bg-zinc-700 dark:zinc-zinc-300 dark:placeholder-gray-400 dark:text-gray-300 dark:focus:ring-zinc-500 dark:focus:border-zinc-500"
                      placeholder="Write your titles here..."
                    />
                  </div>
                  <select
                    id="countries"
                    onChange={(e) => setCategory(e.target.value)}
                    value={category}
                    className="mb-3 block p-2.5 w-full text-sm text-gray-300 bg-zinc-700 rounded-lg border border-gray-300 focus:ring-zinc-500 focus:border-zinc-500 dark:bg-zinc-700 dark:zinc-zinc-300 dark:placeholder-gray-400 dark:text-gray-300 dark:focus:ring-zinc-500 dark:focus:border-zinc-500"
                  >
                    <option value="" disabled className="text-gray-300">
                      Choose a category
                    </option>
                    <option value="Tech" className="text-gray-300">
                      Tech
                    </option>
                    <option value="Design" className="text-gray-300">
                      Design
                    </option>
                    <option value="Entertainment" className="text-gray-300">
                      Entertainment
                    </option>
                  </select>
                  <div className="w-full mb-4 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
                    <div className="flex items-center justify-between px-3 py-2 border-b dark:border-gray-600">
                      <div className="flex flex-wrap items-center divide-gray-200 sm:divide-x sm:rtl:divide-x-reverse dark:divide-gray-600">
                        <div className="flex items-center space-x-1 rtl:space-x-reverse sm:pe-4">
                          <label
                            htmlFor="postImage"
                            type="button"
                            className="p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
                          >
                            <svg
                              className="w-4 h-4"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="currentColor"
                              viewBox="0 0 16 20"
                            >
                              <path d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM10.5 6a1.5 1.5 0 1 1 0 2.999A1.5 1.5 0 0 1 10.5 6Zm2.221 10.515a1 1 0 0 1-.858.485h-8a1 1 0 0 1-.9-1.43L5.6 10.039a.978.978 0 0 1 .936-.57 1 1 0 0 1 .9.632l1.181 2.981.541-1a.945.945 0 0 1 .883-.522 1 1 0 0 1 .879.529l1.832 3.438a1 1 0 0 1-.031.988Z" />
                              <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z" />
                            </svg>
                            <span className="sr-only">Upload image</span>
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="px-4 py-2 bg-white rounded-b-lg dark:bg-gray-800">
                      <label htmlFor="editor" className="sr-only">
                        Publish post
                      </label>

                      <textarea
                        id="editor"
                        rows={8}
                        className="block w-full px-0 text-sm text-gray-800 bg-white border-0 dark:bg-gray-800 focus:ring-0 dark:text-white dark:placeholder-gray-400"
                        placeholder="Write an article..."
                        required=""
                        onChange={(e) => setBody(e.target.value)}
                        defaultValue={""}
                      />
                      {previewImage && (
                        <img
                          className="w-24 h-24 mb-3 shadow-lg "
                          src={previewImage}
                          alt="Post Image Preview"
                        />
                      )}
                    </div>
                  </div>
                  <button className="text-white bg-gradient-to-r from-neutral-500 to-neutral-700 shadow-md hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
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
            )}
            {/* //? Category Button */}
            <div className="flex flex-column sm:flex-row flex-wrap space-y-4 sm:space-y-0 items-center justify-between pb-4">
              {/* //? Search */}
              <div>
                <label htmlFor="table-search" className="sr-only">
                  Search
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 rtl:inset-r-0 rtl:right-0 flex items-center ps-3 pointer-events-none">
                    <svg
                      className="w-5 h-5 text-gray-500 dark:text-gray-400"
                      aria-hidden="true"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    id="table-search"
                    className="block p-2 ps-10 text-sm text-gray-200 rounded-lg w-80 bg-zinc-700 focus:ring-blue-500 focus:border-blue-500 shadow-lg"
                    placeholder="Search for post"
                    onChange={searchFilter}
                  />
                </div>
              </div>
            </div>

            {/* //? Category Button End */}
            {isLoading && <SkeletonPostCard count={8} />}
            {!isLoading &&
              currentPosts.map((post, index) => (
                <PostCard
                  key={index}
                  postId={post._id}
                  title={post.title}
                  slug={post.slug}
                  author={post.userName}
                  authorId={post.userId._id}
                  authorSlug={post.userId.slug}
                  content={post.body}
                  postImage={post.postImage}
                  date={formatDistanceToNow(new Date(post.date)) + " ago"}
                />
              ))}
          </div>
          <div>
            <p className="mb-3 text-gray-200 font-medium">
              Current User's Online
            </p>
            {onlineUsers.length > 0 ? (
              onlineUsers.map((user, index) => (
                <UserOnlineCard
                  key={index}
                  name={user.name}
                  email={user.email}
                  userSlug={user.slug}
                  profileImage={user.profileImage}
                />
              ))
            ) : (
              <p className="text-gray-500">No user online...</p>
            )}
          </div>
        </div>

        <Pagination
          currentPage={currentPage}
          itemsPerPage={postsPerPage}
          totalItems={posts.length}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
