"use client";
import React, { useState } from "react";

const LiveCourseForm = () => {
  const [formData, setFormData] = useState({
    specialization: "CBSE",
    courseClass: "10",
    title: "",
    description: {
      shortDesc: "",
      longDesc: "",
    },
    courseType: "OTA",
    startDate: "",
    endDate: "",
    seatLimit: 1,
    classDuration: 1,
    fees: 0,
    videos: {
      intro: "",
      descriptionVideo: "",
    },
    image: {
      public_id: "",
      url: "",
    },
  });

  const [imagePreview, setImagePreview] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Handle nested description
    if (name === "shortDesc" || name === "longDesc") {
      setFormData((prev) => ({
        ...prev,
        description: {
          ...prev.description,
          [name]: value,
        },
      }));
    }
    // Handle nested videos
    else if (name === "intro" || name === "descriptionVideo") {
      setFormData((prev) => ({
        ...prev,
        videos: {
          ...prev.videos,
          [name]: value,
        },
      }));
    }
    // Normal fields
    else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        ...(name === "courseType" && value === "OTO" ? { seatLimit: 1 } : {}),
      }));
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);

    // Simulate backend upload response
    const uploaded = {
      public_id: "img_" + file.name,
      url: "https://yourcdn.com/" + file.name,
    };

    setFormData((prev) => ({
      ...prev,
      image: uploaded,
    }));
  };

  const removeImage = () => {
    setFormData((prev) => ({
      ...prev,
      image: { public_id: "", url: "" },
    }));
    setImagePreview(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Send `formData` to your API here
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">
        Create Live Course
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          placeholder="Course Title"
          value={formData.title}
          onChange={handleChange}
          required
          className="w-full border px-4 py-2 rounded"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
            name="specialization"
            value={formData.specialization}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded"
          >
            <option value="CBSE">CBSE</option>
            <option value="NEET">NEET</option>
            <option value="IIT-JEE">IIT-JEE</option>
          </select>

          <select
            name="courseClass"
            value={formData.courseClass}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded"
          >
            {[...Array(12)].map((_, i) => (
              <option key={i + 1} value={String(i + 1)}>
                Class {i + 1}
              </option>
            ))}
          </select>
        </div>

        <select
          name="courseType"
          value={formData.courseType}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
        >
          <option value="OTA">OTA</option>
          <option value="OTO">OTO</option>
        </select>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded"
          />

          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded"
          />
        </div>

        <input
          type="number"
          name="seatLimit"
          value={formData.seatLimit}
          onChange={handleChange}
          disabled={formData.courseType === "OTO"}
          placeholder="Seat Limit"
          className="w-full border px-4 py-2 rounded"
        />

        <input
          type="number"
          name="classDuration"
          value={formData.classDuration}
          onChange={handleChange}
          placeholder="Class Duration (hours)"
          className="w-full border px-4 py-2 rounded"
        />

        <input
          type="number"
          name="fees"
          value={formData.fees}
          onChange={handleChange}
          placeholder="Fees"
          className="w-full border px-4 py-2 rounded"
        />

        <textarea
          name="shortDesc"
          value={formData.description.shortDesc}
          onChange={handleChange}
          placeholder="Short Description"
          className="w-full border px-4 py-2 rounded"
        />

        <textarea
          name="longDesc"
          value={formData.description.longDesc}
          onChange={handleChange}
          placeholder="Long Description"
          className="w-full border px-4 py-2 rounded"
        />

        <input
          type="text"
          name="intro"
          value={formData.videos.intro}
          onChange={handleChange}
          placeholder="Intro Video URL"
          className="w-full border px-4 py-2 rounded"
        />

        <input
          type="text"
          name="descriptionVideo"
          value={formData.videos.descriptionVideo}
          onChange={handleChange}
          placeholder="Description Video URL"
          className="w-full border px-4 py-2 rounded"
        />

        <div className="flex flex-col gap-2">
          <label className="font-medium">Upload Course Image</label>
          <input type="file" accept="image/*" onChange={handleImageUpload} />
          {imagePreview && (
            <div className="relative mt-2">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-auto rounded shadow"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded"
              >
                Remove
              </button>
            </div>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default LiveCourseForm;
