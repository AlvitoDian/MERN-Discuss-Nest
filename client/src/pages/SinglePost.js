import { useNavigate, useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { format } from "date-fns";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { faClock } from "@fortawesome/free-solid-svg-icons";
import Comment from "../components/Comment";
import { Link } from "react-router-dom";
import SkeletonSinglePost from "../components/skeleton/SkeletonSinglePost";

export default function SinglePost() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [body, setBody] = useState("");
  const [author, setAuthor] = useState("");
  const [authorId, setAuthorId] = useState();
  const [postId, setPostId] = useState();
  const [authorSlug, setAuthorSlug] = useState("");
  const [date, setDate] = useState("");
  const [postImage, setPostImage] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { slug } = useParams();
  const apiUrl = process.env.REACT_APP_DOMAIN_API;

  const getPostBySlug = async () => {
    try {
      const response = await axios.get(`${apiUrl}/post/${slug}`);
      setTitle(response.data.title);
      setCategory(response.data.category);
      setBody(response.data.body);
      setAuthor(response.data.userId.name);
      setAuthorId(response.data.userId._id);
      setPostId(response.data._id);
      setPostImage(`${apiUrl}/images/` + response.data.postImage);
      setAuthorSlug(response.data.userId.slug);
      const currentDate = response.data.date;
      setDate(
        currentDate
          ? format(new Date(currentDate), "MMMM d, yyyy HH:mm:ss")
          : ""
      );
      setIsLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getPostBySlug();
  }, []);

  return (
    <>
      {isLoading && <SkeletonSinglePost />}
      {!isLoading && (
        <div className="flex flex-col">
          <div className="mt-28 max-w ml-20 mr-20 p-6 bg-zinc-700 rounded-lg mb-5 overflow-hidden ">
            <a href="#">
              <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-200">
                {title}
              </h5>
            </a>
            <img
              className="h-96 w-screen rounded-lg object-cover object-fit:cover"
              src={postImage}
              alt="image description"
            />
            <div className="flex items-center mb-3 mt-3">
              <Link to={`/forum/user/${authorSlug}`}>
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

            <p className="mb-3 font-normal text-gray-200 overflow-hidden">
              {body}
            </p>
            {postId && <Comment postId={postId} />}
          </div>
        </div>
      )}
    </>
  );
}
