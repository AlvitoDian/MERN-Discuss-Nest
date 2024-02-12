import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Forum from "./pages/Forum";
import SinglePost from "./pages/SinglePost";
import SingleUser from "./pages/SingleUser";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/register" element={<SignUp />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/" element={<Home />}></Route>
        <Route path="/forum" element={<Forum />}></Route>
        <Route path="/forum/post/:slug" element={<SinglePost />} />
        <Route path="/forum/user/:id" element={<SingleUser />} />
      </Routes>
      <Footer />
    </>
  );
}
export default App;
