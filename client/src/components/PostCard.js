import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { faClock } from "@fortawesome/free-solid-svg-icons";

export default function PostCard({
  postId,
  title,
  slug,
  author,
  content,
  date,
  authorId,
  authorSlug,
  postImage,
}) {
  // Function to limit the text to a certain number of words
  const limitText = (text, limit) => {
    if (text) {
      const words = text.split(" ");
      if (words.length > limit) {
        return words.slice(0, limit).join(" ") + " ...";
      }
      return text;
    }
    return "";
  };

  const limitedContent = limitText(content, 30);
  const apiUrl = process.env.REACT_APP_DOMAIN_API;

  return (
    <div
      className="max-w-7xl p-6 bg-zinc-700 rounded-lg mb-5 overflow-hidden fade-in"
      key={postId}
    >
      <a href="#">
        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-300">
          {title}
        </h5>
      </a>

      <div className="flex items-center mb-3">
        <Link to={`user/${authorSlug}`}>
          <p className="font-light text-gray-400 font-medium">
            <FontAwesomeIcon icon={faUser} className="pr-2" size="sm" />
            {author}
          </p>
        </Link>
        <p className="ml-3 font-light text-gray-200">
          <FontAwesomeIcon icon={faClock} className="pr-2" size="sm" />
          {date}
        </p>
      </div>
      <div className="flex items-center justify-center">
        <img
          className="h-48 w-screen rounded-lg object-cover object-fit:cover"
          src={`${apiUrl}/images/${postImage}`}
          alt="image description"
        />
      </div>
      <p className="mb-3 font-normal text-gray-200 overflow-hidden">
        {limitedContent}
      </p>
      <Link
        to={`post/${slug}`}
        className="transition duration-300 ease-in-out text-white bg-gradient-to-r from-neutral-500 to-neutral-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 shadow "
      >
        Read More
      </Link>
    </div>
  );
}
