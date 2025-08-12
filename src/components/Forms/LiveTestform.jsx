"use client";
import { useState } from "react";

export default function LiveTestForm() {
  const [formData, setFormData] = useState({
    title: "",
    description: { short: "", long: "" },
    image: { public_id: "", url: "" },
    subject: "",
    startDate: "",
    duration: "",
    overallMarks: { positive: "", negative: "" },
    markingType: "PQM",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.includes("description.")) {
      const key = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        description: { ...prev.description, [key]: value },
      }));
    } else if (name.includes("overallMarks.")) {
      const key = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        overallMarks: { ...prev.overallMarks, [key]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    // You can POST formData to your Next.js API route
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl shadow-md w-full max-w-lg space-y-4"
      >
        <h2 className="text-2xl font-bold mb-4">Create Live Test</h2>

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
          <label className="block font-semibold">Image</label>
          <input
            type="file"
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

        <div>
          <label className="block font-semibold">Subject</label>
          <input
            type="text"
            name="subject"
            required
            value={formData.subject}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-2"
          />
        </div>

        <div>
          <label className="block font-semibold">Start Date</label>
          <input
            type="datetime-local"
            name="startDate"
            required
            value={formData.startDate}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-2"
          />
        </div>

        <div>
          <label className="block font-semibold">Duration (minutes)</label>
          <input
            type="number"
            name="duration"
            required
            min="1"
            value={formData.duration}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-2"
          />
        </div>

        <div>
          <label className="block font-semibold">Positive Marks</label>
          <input
            type="number"
            name="overallMarks.positive"
            required
            value={formData.overallMarks.positive}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-2"
          />
        </div>
        <div>
          <label className="block font-semibold">Negative Marks</label>
          <input
            type="number"
            name="overallMarks.negative"
            required
            value={formData.overallMarks.negative}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-2"
          />
        </div>

        <div>
          <label className="block font-semibold">Marking Type</label>
          <select
            name="markingType"
            value={formData.markingType}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-2"
          >
            <option value="OAM">Overall Marks</option>
            <option value="PQM">Per Question Marks</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Create Live Test
        </button>
      </form>
    </div>
  );
}
