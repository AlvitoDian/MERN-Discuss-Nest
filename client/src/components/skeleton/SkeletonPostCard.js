import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faClock } from "@fortawesome/free-solid-svg-icons";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const SkeletonPostCard = ({ count }) => {
  const renderSkeletonCards = () => {
    const cards = [];

    for (let i = 0; i < count; i++) {
      cards.push(
        <div
          key={i}
          className="max-w-7xl p-6 bg-zinc-700 rounded-lg mb-5 overflow-hidden fade-in"
        >
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-300">
            <Skeleton />
          </h5>

          <Skeleton width={90} />
          <p className="mb-3 font-normal text-gray-200 overflow-hidden">
            <Skeleton count={4} />
          </p>
          <Link className="transition duration-300 ease-in-out text-white bg-gradient-to-r from-neutral-500 to-neutral-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 shadow ">
            Read More
          </Link>
        </div>
      );
    }

    return cards;
  };

  return <>{renderSkeletonCards()}</>;
};

export default SkeletonPostCard;
