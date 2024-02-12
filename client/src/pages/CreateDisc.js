import React, { useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";

export default function CreateDisc() {
  const [userId, setUserId] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [body, setBody] = useState("");

  const { user } = useAuthContext();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here (e.g., sending data to the server)
    console.log("Form submitted:", { userId, title, category, body });
    // Reset form fields
    setUserId("");
    setTitle("");
    setCategory("");
    setBody("");
  };

  return (
    <div className="card">
      <div className="card-body">
        <h2>Create Discussion</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="hidden"
            className="form-control"
            id="_id"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            required
          />
          <div className="mb-3">
            <label htmlFor="title" className="form-label">
              Title
            </label>
            <input
              type="text"
              className="form-control"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="category" className="form-label">
              Category
            </label>
            <input
              type="text"
              className="form-control"
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="body" className="form-label">
              Body
            </label>
            <textarea
              className="form-control"
              id="body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              required
            ></textarea>
          </div>
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
