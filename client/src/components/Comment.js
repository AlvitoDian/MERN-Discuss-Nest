import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { useAuthContext } from "../hooks/useAuthContext";
import { formatDistanceToNow } from "date-fns";

export default function Comment({ postId }) {
  const apiUrl = process.env.REACT_APP_DOMAIN_API;
  const { user } = useAuthContext();

  const [inputComment, setInputComment] = useState("");
  const [comments, setComments] = useState([]);
  const [errorMessages, setErrorMessages] = useState({});

  //? Get All Comment
  const getAllComments = async () => {
    try {
      const response = await axios.get(`${apiUrl}/all-comment/${postId}`, {
        withCredentials: true,
      });

      const formattedComments = response.data.map((comment) => ({
        id: comment._id,
        userId: comment.userId,
        userName: comment.userId.name,
        postId: comment.postId,
        content: comment.content,
        profileImage: comment.userId.profileImage,
        date: formatDistanceToNow(new Date(comment.date)) + " ago",
      }));

      setComments(formattedComments);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.error("Unauthorized access. Redirect or show login form.");
        return;
      } else {
        console.error("Error fetching posts:", error);
      }
    }
  };

  //? Use Effect
  useEffect(() => {
    getAllComments();
  }, []);

  //? Function Add Comment
  const addComment = async (e) => {
    e.preventDefault();

    try {
      const currentDate = new Date();
      const response = await axios.post(
        `${apiUrl}/add-comment`,
        {
          userId: user._id,
          postId: postId,
          content: inputComment,
          date: currentDate,
        },
        { withCredentials: true }
      );

      const newComment = {
        id: response.data._id,
        userId: response.data.userId,
        postId: response.data.postId,
        content: response.data.content,
        userName: user.name,
        date: formatDistanceToNow(new Date(response.data.date)) + " ago",
      };

      setComments([...comments, newComment]);
      setInputComment("");
      getAllComments();
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
    <>
      <p className="py-3 text-gray-200 overflow-hidden font-medium text-xl border-t border-gray-500">
        Comments :
      </p>
      {/* //? Comment Section */}
      {comments.map((comment, index) => (
        <div className="pb-3 fade-in" key={index}>
          <div className="flex space-x-4 rtl:space-x-reverse">
            <div className="relative">
              {comment.profileImage ? (
                <img
                  className="w-10 h-10 rounded-full"
                  src={`${apiUrl}/images/${comment.profileImage}`}
                  alt=""
                />
              ) : (
                <img
                  className="w-10 h-10 rounded-full"
                  src="https://www.w3schools.com/w3css/img_avatar2.png"
                  alt=""
                />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex space-x-2">
                <p className="text-sm font-medium truncate text-gray-200">
                  {comment.userName}
                </p>
                <p className="text-sm font-sm truncate text-gray-400">
                  {comment.date}
                </p>
              </div>
              <p className="text-sm text-gray-300">{comment.content}</p>
              {/*   <div className="text-sm text-gray-400 font-medium pr-2 cursor-pointer hover:text-gray-200 transition duration-300 ease-in-out">
                Reply
              </div> */}
            </div>
          </div>
        </div>
      ))}

      {/* //? Comment Section End */}
      {/* //? Field Input Comment End */}
      {user && (
        <form onSubmit={addComment}>
          <div className="w-full mb-4 border border-gray-500 rounded-lg bg-zinc-800 ">
            <div className="px-4 py-2 bg-white rounded-t-lg dark:bg-gray-800">
              <label htmlFor="comment" className="sr-only">
                Your comment
              </label>
              <textarea
                id="comment"
                rows={4}
                className="w-full px-0 text-sm text-gray-900 bg-white border-0 dark:bg-gray-800 focus:ring-0 dark:text-white dark:placeholder-gray-400"
                placeholder="Write a comment..."
                required=""
                onChange={(e) => setInputComment(e.target.value)}
                value={inputComment}
              />
            </div>
            <div className="flex items-center justify-between px-3 py-2 border-t dark:border-gray-600">
              <button
                type="submit"
                className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center border border-emerald-500 text-white bg-zinc-800 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-emerald-500 transition duration-300 ease-in-out"
              >
                Post comment
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
              {/*    <div className="flex ps-0 space-x-1 rtl:space-x-reverse sm:ps-2">
                <button
                  type="button"
                  className="inline-flex justify-center items-center p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
                >
                  <svg
                    className="w-4 h-4"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 12 20"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M1 6v8a5 5 0 1 0 10 0V4.5a3.5 3.5 0 1 0-7 0V13a2 2 0 0 0 4 0V6"
                    />
                  </svg>
                  <span className="sr-only">Attach file</span>
                </button>
                <button
                  type="button"
                  className="inline-flex justify-center items-center p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
                >
                  <svg
                    className="w-4 h-4"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 16 20"
                  >
                    <path d="M8 0a7.992 7.992 0 0 0-6.583 12.535 1 1 0 0 0 .12.183l.12.146c.112.145.227.285.326.4l5.245 6.374a1 1 0 0 0 1.545-.003l5.092-6.205c.206-.222.4-.455.578-.7l.127-.155a.934.934 0 0 0 .122-.192A8.001 8.001 0 0 0 8 0Zm0 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z" />
                  </svg>
                  <span className="sr-only">Set location</span>
                </button>
                <button
                  type="button"
                  className="inline-flex justify-center items-center p-2 text-gray-500 rounded cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
                >
                  <svg
                    className="w-4 h-4"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 18"
                  >
                    <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
                  </svg>
                  <span className="sr-only">Upload image</span>
                </button>
              </div> */}
            </div>
          </div>
        </form>
      )}
      {!user && (
        <button
          className={`inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white rounded-lg focus:ring-4 focus:outline-none focus:ring-blue-300 bg-gray-400`}
          disabled
        >
          Login to Comment
        </button>
      )}
      {/* //? Field Input Comment End */}
    </>
  );
}
