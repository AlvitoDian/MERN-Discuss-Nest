import { useState, useEffect } from "react";
import PostCard from "../components/PostCard";
import Pagination from "../components/Pagination";
import UserOnlineCard from "../components/UserOnlineCard";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";
import { useAuthContext } from "../hooks/useAuthContext";

export default function Forum() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState("");
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [body, setBody] = useState("");
  const [errorMessages, setErrorMessages] = useState({});
  const [onlineUsers, setOnlineUsers] = useState([]);

  //? Pagination Section
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(8);

  const indexOfLastItem = currentPage * postsPerPage;
  const indexOfFirstItem = indexOfLastItem - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstItem, indexOfLastItem);
  //? Pagination End

  const { user } = useAuthContext();
  const apiUrl = process.env.REACT_APP_DOMAIN_API;

  //? Get All Posts
  const getPosts = async () => {
    try {
      const response = await axios.get(`${apiUrl}/posts`, {
        withCredentials: true,
      });

      /* console.log("Post", response); */

      // Add userName property to each post
      const updatedPosts = response.data.map((post) => ({
        ...post,
        userName: post.userId.name,
      }));

      setPosts(updatedPosts);
      /*  setPosts(response.data); */
    } catch (error) {
      if (error.response && error.response.status === 401) {
        // Handle 401 Unauthorized error
        console.error("Unauthorized access. Redirect or show login form.");
        // For example, you might redirect to a login page or show a login form
        return; // Stop execution and return from the function
      } else {
        // Handle other errors
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

      /* console.log("User", response); */

      const updatedUsers = response.data.map((onlineUsers) => ({
        ...onlineUsers,
      }));

      setOnlineUsers(updatedUsers);
      /*  setPosts(response.data); */
    } catch (error) {
      if (error.response && error.response.status === 401) {
        // Handle 401 Unauthorized error
        console.error("Unauthorized access. Redirect or show login form.");
        // For example, you might redirect to a login page or show a login form
        return; // Stop execution and return from the function
      } else {
        // Handle other errors
        console.error("Error fetching user online:", error);
      }
    }
  };

  useEffect(() => {
    getPosts();
    getOnlineUsers();
  }, []);

  const addPost = async (e) => {
    e.preventDefault();

    /* console.log("Form submitted:", { userId: user._id, title, category, body }); */
    try {
      const currentDate = new Date();
      const response = await axios.post(
        `${apiUrl}/add-post`,
        {
          userId: user._id,
          title,
          category,
          body,
          date: currentDate,
        },
        { withCredentials: true }
      );

      navigate("/forum");
      /* console.log("ini reponse : ", response.data); */
      /* setPosts([response.data, ...posts]); */

      const updatedPosts = posts.map((post) => ({
        ...post,
        userName: post.userId ? post.userId.name : "Unknown",
      }));

      /* console.log(updatedPosts); */

      // Add the new post to the beginning of the array
      setPosts([{ ...response.data, userName: user.name }, ...updatedPosts]);

      setUserId("");
      setTitle("");
      setCategory("");
      setBody("");
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

  return (
    <div className="bg-gradient-to-b from-neutral-900 to-neutral-900 shadow">
      <div className="ml-10 mr-10 items-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 pt-28 pb-9">
          <div>
            <p className="mb-3 text-gray-200 font-medium">Available Topics</p>
            <p>
              <span className="font-semibold text-emerald-400"># Tech</span>
            </p>
            <p>
              <span className="font-semibold text-emerald-400">
                # Entertainment
              </span>
            </p>
            <p>
              <span className="font-semibold text-emerald-400">
                # Programming
              </span>
            </p>
          </div>
          <div>
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
                <form onSubmit={addPost}>
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
                  <textarea
                    id="message"
                    onChange={(e) => setBody(e.target.value)}
                    value={body}
                    rows="4"
                    className="block p-2.5 w-full block p-2.5 w-full text-sm text-gray-300 bg-zinc-700 rounded-lg border border-gray-300 focus:ring-zinc-500 focus:border-zinc-500 dark:bg-zinc-700 dark:zinc-zinc-300 dark:placeholder-gray-400 dark:text-gray-300 dark:focus:ring-zinc-500 dark:focus:border-zinc-500"
                    placeholder="Write your thoughts here..."
                  ></textarea>
                  <button className="mt-5 text-white bg-gradient-to-r from-neutral-500 to-neutral-700 shadow-md hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">
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

            {currentPosts.map((post, index) => (
              <PostCard
                key={index}
                postId={post._id}
                title={post.title}
                slug={post.slug}
                author={post.userName}
                authorId={post.userId._id}
                content={post.body}
                date={formatDistanceToNow(new Date(post.date)) + " ago"}
              />
            ))}
          </div>
          {onlineUsers.map((user, index) => (
            <UserOnlineCard
              key={index}
              name={user.name}
              email={user.email}
              userId={user._id}
            />
          ))}
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
