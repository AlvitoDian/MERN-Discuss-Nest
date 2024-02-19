import { useNavigate, useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuthContext } from "../hooks/useAuthContext";
import { formatDistanceToNow } from "date-fns";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function SuntingPost() {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [updatePost, setUpdatePost] = useState({
    _id: null,
    title: "",
    category: "",
    body: "",
    postImage: "",
  });
  const [previewImage, setPreviewImage] = useState();
  const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);
  const [errorMessages, setErrorMessages] = useState({});
  const apiUrl = process.env.REACT_APP_DOMAIN_API;

  const getAllPostBySlug = async () => {
    try {
      const response = await axios.get(`${apiUrl}/posts-user/${user.slug}`, {
        withCredentials: true,
      });
      const updatedPosts = response.data.map((post) => ({
        ...post,
        userName: post.userId.name,
        postImage: post.postImage
          ? `${apiUrl}/images/${post.postImage}`
          : "https://www.w3schools.com/html/img_chania.jpg",
      }));

      setPosts(updatedPosts);
      // if (response.data.profileImage) {
      //   setProfileImage(`${apiUrl}/images/` + response.data.profileImage);
      // }
      // if (!response.data.profileImage) {
      //   setProfileImage("https://www.w3schools.com/w3css/img_avatar2.png");
      // }
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    getAllPostBySlug();
  }, []);

  // const handleImageChange = (e) => {
  //   const file = e.target.files[0];

  //   if (file) {
  //     setProfileImage(file);
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       setPreviewImage(reader.result);
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };

  const handleUpdatePost = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", updatePost.title);
    formData.append("category", updatePost.category);
    formData.append("body", updatePost.body);
    formData.append("postImage", updatePost.postImage);

    /*  console.log("Send : ", formData); */

    /*    for (let entry of formData.entries()) {
      console.log(entry[0], entry[1]);
    }
 */
    try {
      const response = await axios.put(
        `${apiUrl}/update-post/${user._id}`,
        formData,
        {
          withCredentials: true,
        }
      );
      if (response) {
        setUpdateModalOpen(false);
        window.location.reload();
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleDeletePost = async (postId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this post?"
    );

    if (confirmDelete) {
      try {
        const response = await axios.delete(`${apiUrl}/delete-post/${postId}`, {
          withCredentials: true,
        });
        if (response) {
          window.location.reload();
        }
      } catch (error) {
        console.error("Error deleting post:", error);
        window.alert("Error deleting post. Please try again later.");
      }
    }
  };

  const handleOpenUpdateModal = (post) => {
    setUpdatePost({
      id: post._id,
      title: post.title,
      category: post.category,
      body: post.body,
      postImage: post.postImage,
    });
    setUpdateModalOpen(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const updatedPost = { ...updatePost, postImage: file };
      setUpdatePost(updatedPost);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  /*   console.log(updatePost);
   */
  return (
    <>
      <div className="flex flex-col h-screen">
        <div className="mt-28 max-w ml-20 mr-20 p-6 bg-zinc-700 rounded-lg mb-5 overflow-hidden ">
          <h2 className="text-gray-200 font-medium text-2xl">Sunting Posts</h2>
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-5">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Title
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Category
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Date
                  </th>

                  <th scope="col" className="px-6 py-3">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post, index) => (
                  <tr
                    className="border-b bg-gray-800 border-gray-700 "
                    key={index}
                  >
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      {post.title}
                    </th>
                    <td className="px-6 py-4">{post.category}</td>
                    <td className="px-6 py-4">
                      {formatDistanceToNow(new Date(post.date)) + " ago"}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleOpenUpdateModal(post)}
                        href="#"
                        className="font-medium text-blue-600 dark:text-blue-500 hover:text-blue-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeletePost(post._id)}
                        className="font-medium text-blue-600 dark:text-blue-500 hover:text-blue-600 pl-2"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* Modal Section */}
      {isUpdateModalOpen && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-black opacity-45"></div>
            </div>

            {/* Modal container */}
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <div className="inline-block align-bottom rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              {/* Modal content */}
              <form onSubmit={handleUpdatePost} encType="multipart/form-data">
                <div className="bg-zinc-700 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-200 mb-4">
                    Edit Post
                  </h3>
                  <div>
                    <label
                      htmlFor="title"
                      className="block text-sm font-medium leading-6 text-gray-200"
                    >
                      Title
                    </label>
                    <div className="relative mt-2 rounded-md shadow-sm">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"></div>
                      <input
                        type="text"
                        name="title"
                        id="title"
                        className="w-full border-gray-300 rounded-md p-2 bg-zinc-800 bg-opacity-90 shadow-lg text-gray-200 focus:bg-zinc-800"
                        placeholder="Title"
                        value={updatePost.title}
                        onChange={(e) =>
                          setUpdatePost({
                            ...updatePost,
                            title: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="relative mt-2 rounded-md shadow-sm">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"></div>
                      <label
                        htmlFor="category"
                        className="block text-sm font-medium leading-6 text-gray-200"
                      >
                        Category
                      </label>
                      <select
                        name="category"
                        id="category"
                        className="w-full border-gray-300 rounded-md p-2 bg-zinc-800 bg-opacity-90 shadow-lg text-gray-200 focus:bg-zinc-800"
                        placeholder="Title"
                        value={updatePost.category}
                        onChange={(e) =>
                          setUpdatePost({
                            ...updatePost,
                            category: e.target.value,
                          })
                        }
                      >
                        <option hidden>Select Category</option>
                        <option value="Tech">Tech</option>
                        <option value="Design">Design</option>
                        <option value="Entertainment">Entertainment</option>
                      </select>
                    </div>
                    <div className="pt-5">
                      <label
                        htmlFor="editor"
                        className="block text-sm font-medium leading-6 text-gray-200"
                      >
                        Content
                      </label>
                      <div className="px-4 py-2 bg-white rounded-lg dark:bg-gray-800">
                        <textarea
                          id="editor"
                          rows={8}
                          className="block w-full px-0 text-sm text-gray-800 bg-white border-0 dark:bg-gray-800 focus:ring-0 dark:text-white dark:placeholder-gray-400"
                          placeholder="Write an article..."
                          required=""
                          value={updatePost.body}
                          onChange={(e) =>
                            setUpdatePost({
                              ...updatePost,
                              body: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className="pt-5">
                      <input
                        type="file"
                        id="postImage"
                        accept=".png, .jpg, .jpeg"
                        name="postImage"
                        onChange={handleImageChange}
                        style={{ display: "none" }}
                      />
                      <label
                        htmlFor="postImage"
                        className="block text-sm font-medium leading-6 text-gray-200"
                      >
                        Image
                      </label>
                      <label
                        htmlFor="postImage"
                        className="cursor-pointer transition duration-300 ease-in-out relative items-center flex justify-center"
                      >
                        {previewImage && (
                          <img
                            className="w-screen rounded-lg h-48 mb-3 shadow-lg opacity-50 hover:opacity-100 transition duration-300 ease-in-out"
                            src={previewImage}
                            alt="Profile image"
                          />
                        )}
                        {!previewImage && (
                          <img
                            className="w-screen rounded-lg h-48 mb-3 shadow-lg opacity-50 hover:opacity-100 transition duration-300 ease-in-out"
                            src={updatePost.postImage}
                            alt="Profile image"
                          />
                        )}

                        <div className="absolute">
                          <FontAwesomeIcon
                            icon={faEdit}
                            size="xl"
                            className="text-white pt-5 shadow"
                          />
                        </div>
                      </label>
                    </div>
                  </div>
                  {/*       <div>
                    <label
                      htmlFor="price"
                      className="block text-sm font-medium leading-6 text-gray-200"
                    >
                      Category
                    </label>
                    <div className="relative mt-2 rounded-md shadow-sm">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"></div>
                      <input
                        type="text"
                        name="name"
                        id="price"
                        className="w-full border-gray-300 rounded-md p-2 bg-zinc-800 bg-opacity-90 shadow-lg text-gray-200 focus:bg-zinc-800"
                        placeholder="Name"
                      />
                    </div>
                  </div> */}
                </div>
                <div className="bg-zinc-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-emerald-500 text-base font-medium text-white hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm transition duration-300 ease-in-out"
                  >
                    Edit Post
                  </button>
                  <button
                    onClick={() => setUpdateModalOpen(false)}
                    className="mt-3 w-full inline-flex justify-center bg-red-600 rounded-md shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-200 hover:bg-red-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition duration-300 ease-in-out"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
