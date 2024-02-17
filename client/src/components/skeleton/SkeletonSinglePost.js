import { useNavigate, useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { format } from "date-fns";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { faClock } from "@fortawesome/free-solid-svg-icons";

import { Link } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function SkeletonSinglePost() {
  return (
    <div className="flex flex-col ">
      <div className="mt-28 max-w ml-20 mr-20 p-6 bg-zinc-700 rounded-lg mb-5 overflow-hidden ">
        <a href="#">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-200">
            <Skeleton />
          </h5>
        </a>
        <Skeleton width={210} />
        <p className="mb-3 font-normal text-gray-200 overflow-hidden">
          <Skeleton />
          <Skeleton />
          <Skeleton />
          <Skeleton />
          <Skeleton />
        </p>
      </div>
    </div>
  );
}
