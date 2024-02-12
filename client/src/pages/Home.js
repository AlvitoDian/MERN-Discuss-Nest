import React, { useState, useEffect } from "react";
import HeroSection from "../components/HeroSection";

import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Home() {
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;

  return (
    <>
      <HeroSection />
    </>
  );
}
