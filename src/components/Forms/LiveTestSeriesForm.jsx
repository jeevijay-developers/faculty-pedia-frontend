"use client";
import React, { useState } from "react";

export default function LiveTestSeriesForm() {
  const [formData, setFormData] = useState({
    title: "",
    description: { short: "", long: "" },
    price: "",
    noOfTests: 1,
    startDate: "",
    endDate: "",
    image: { public_id: "", url: "" },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.includes("description.")) {
      const key = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        description: { ...prev.description, [key]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Show local preview instantly
    const localPreview = URL.createObjectURL(file);
    setFormData((prev) => ({
      ...prev,
      image: { ...prev.image, url: localPreview },
    }));

    const data = new FormData();
    data.append("image", file);

    try {
      const res = await fetch("/upload-image", {
        method: "POST",
        body: data,
      });
      const result = await res.json();

      // Replace preview with actual uploaded URL
      setFormData((prev) => ({
        ...prev,
        image: {
          public_id: result.public_id || "",
          url: result.url || localPreview,
        },
      }));
    } catch (err) {
      console.error("Image upload failed", err);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    // POST formData to backend
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl shadow-md w-full max-w-lg space-y-4"
      >
        <h2 className="text-2xl font-bold mb-4">Create Live Test Series</h2>

        <div>
          <label className="block font-semibold">Title</label>
          <input
            type="text"
            name="title"
            required
            value={formData.title}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-2"
          />
        </div>

        <div>
          <label className="block font-semibold">Short Description</label>
          <textarea
            name="description.short"
            required
            value={formData.description.short}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-2"
          />
        </div>

        <div>
          <label className="block font-semibold">Long Description</label>
          <textarea
            name="description.long"
            required
            value={formData.description.long}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-2"
          />
        </div>

        <div>
          <label className="block font-semibold">Price</label>
          <input
            type="number"
            name="price"
            required
            min="0"
            step="0.01"
            value={formData.price}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-2"
          />
        </div>

        <div>
          <label className="block font-semibold">Number of Tests</label>
          <input
            type="number"
            name="noOfTests"
            min="1"
            required
            value={formData.noOfTests}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-2"
          />
        </div>

        <div>
          <label className="block font-semibold">Start Date</label>
          <input
            type="date"
            name="startDate"
            required
            value={formData.startDate}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-2"
          />
        </div>

        <div>
          <label className="block font-semibold">End Date</label>
          <input
            type="date"
            name="endDate"
            required
            value={formData.endDate}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-2"
          />
        </div>

        <div>
          <label className="block font-semibold">Image</label>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full border border-gray-300 rounded-lg p-2"
          />
          {formData.image.url && (
            <img
              src={formData.image.url}
              alt="Preview"
              className="mt-2 w-32 h-32 object-cover rounded-lg border"
            />
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Create
        </button>
      </form>
    </div>
  );
}
