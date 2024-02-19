import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Forum from "./pages/Forum";
import SinglePost from "./pages/SinglePost";
import SingleUser from "./pages/SingleUser";
import UpdateUser from "./pages/UpdateUser";
import SuntingPost from "./pages/SuntingPost";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function App() {
  return (
    <>
      <SkeletonTheme baseColor="#7a7a8c" highlightColor="#444">
        <Navbar />
        <Routes>
          <Route path="/register" element={<SignUp />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/" element={<Home />}></Route>
          <Route path="/forum" element={<Forum />}></Route>
          <Route path="/forum/post/:slug" element={<SinglePost />} />
          <Route path="/forum/user/:slug" element={<SingleUser />} />
          <Route path="/update-user" element={<UpdateUser />} />
          <Route path="/update-post" element={<SuntingPost />} />
        </Routes>
        <Footer />
      </SkeletonTheme>
    </>
  );
}
export default App;
