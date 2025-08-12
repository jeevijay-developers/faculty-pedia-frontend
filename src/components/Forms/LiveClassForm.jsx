"use client";
import React, { useState } from "react";

const LiveClassForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    courseId: "", // Hidden in UI
    subject: "",
    topic: "",
    time: "",
    date: "",
    duration: "",
    liveClassLink: "",
    assetsLinks: [],
  });

  const [newAsset, setNewAsset] = useState({ name: "PPT", link: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAssetChange = (e) => {
    setNewAsset({ ...newAsset, [e.target.name]: e.target.value });
  };

  const addAsset = () => {
    if (newAsset.link.trim()) {
      setFormData((prev) => ({
        ...prev,
        assetsLinks: [...prev.assetsLinks, newAsset],
      }));
      setNewAsset({ name: "PPT", link: "" });
    }
  };

  const removeAsset = (index) => {
    setFormData((prev) => ({
      ...prev,
      assetsLinks: prev.assetsLinks.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted Live Class Data:", formData);
    // Submit logic here (API call)
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-lg mt-8">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Create Live Class
      </h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Title */}
        <div>
          <label className="block mb-1 font-medium">Title</label>
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full border rounded-lg p-2 focus:outline-none focus:ring focus:border-blue-500"
            placeholder="Enter class title"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block mb-1 font-medium">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border rounded-lg p-2 focus:outline-none focus:ring focus:border-blue-500"
            placeholder="Enter class description"
            required
          />
        </div>

        {/* Subject */}
        <div>
          <label className="block mb-1 font-medium">Subject</label>
          <input
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            className="w-full border rounded-lg p-2 focus:outline-none focus:ring focus:border-blue-500"
            placeholder="Enter subject"
            required
          />
        </div>

        {/* Topic */}
        <div>
          <label className="block mb-1 font-medium">Topic (optional)</label>
          <input
            name="topic"
            value={formData.topic}
            onChange={handleChange}
            className="w-full border rounded-lg p-2 focus:outline-none focus:ring focus:border-blue-500"
            placeholder="Enter topic"
          />
        </div>

        {/* Time */}
        <div>
          <label className="block mb-1 font-medium">Time</label>
          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            className="w-full border rounded-lg p-2 focus:outline-none focus:ring focus:border-blue-500"
            required
          />
        </div>

        {/* Date */}
        <div>
          <label className="block mb-1 font-medium">Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full border rounded-lg p-2 focus:outline-none focus:ring focus:border-blue-500"
            required
          />
        </div>

        {/* Duration */}
        <div>
          <label className="block mb-1 font-medium">
            Duration (in minutes)
          </label>
          <input
            type="number"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            className="w-full border rounded-lg p-2 focus:outline-none focus:ring focus:border-blue-500"
            placeholder="e.g. 60"
            required
          />
        </div>

        {/* Live Class Link */}
        <div>
          <label className="block mb-1 font-medium">Live Class Link</label>
          <input
            name="liveClassLink"
            value={formData.liveClassLink}
            onChange={handleChange}
            className="w-full border rounded-lg p-2 focus:outline-none focus:ring focus:border-blue-500"
            placeholder="https://..."
          />
        </div>

        {/* Assets */}
        <div>
          <label className="block mb-2 font-medium">Assets</label>
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            <select
              name="name"
              value={newAsset.name}
              onChange={handleAssetChange}
              className="border rounded-lg p-2 focus:outline-none focus:ring focus:border-blue-500"
            >
              <option value="PPT">PPT</option>
              <option value="VIDEO">VIDEO</option>
              <option value="PDF">PDF</option>
            </select>
            <input
              type="url"
              name="link"
              value={newAsset.link}
              onChange={handleAssetChange}
              placeholder="Enter asset link"
              className="flex-1 border rounded-lg p-2 focus:outline-none focus:ring focus:border-blue-500"
            />
            <button
              type="button"
              onClick={addAsset}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Add Asset
            </button>
          </div>

          {/* Show added assets */}
          <ul className="mt-4 space-y-2">
            {formData.assetsLinks.map((asset, index) => (
              <li
                key={index}
                className="flex justify-between items-center bg-gray-100 rounded-lg p-2"
              >
                <span className="text-sm font-medium">
                  {asset.name}:{" "}
                  <a
                    href={asset.link}
                    className="text-blue-600"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {asset.link}
                  </a>
                </span>
                <button
                  type="button"
                  onClick={() => removeAsset(index)}
                  className="text-red-600 hover:underline text-sm"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
        >
          Submit Live Class
        </button>
      </form>
    </div>
  );
};

export default LiveClassForm;
