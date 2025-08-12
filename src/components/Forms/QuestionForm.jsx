"use client";
import { useState } from "react";

export default function QuestionForm() {
  const [formData, setFormData] = useState({
    title: "",
    image: { public_id: "", url: "" },
    subject: "",
    topic: "",
    marks: { positive: "", negative: "" },
    options: {
      A: { text: "", image: { public_id: "", url: "" } },
      B: { text: "", image: { public_id: "", url: "" } },
      C: { text: "", image: { public_id: "", url: "" } },
      D: { text: "", image: { public_id: "", url: "" } },
    },
    correctOptions: [],
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.includes("marks.")) {
      const key = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        marks: { ...prev.marks, [key]: value },
      }));
    } else if (name.includes("options.") && name.includes(".text")) {
      const key = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        options: {
          ...prev.options,
          [key]: { ...prev.options[key], text: value },
        },
      }));
    } else if (name === "correctOptions") {
      setFormData((prev) => ({
        ...prev,
        correctOptions: checked
          ? [...prev.correctOptions, value]
          : prev.correctOptions.filter((opt) => opt !== value),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageUpload = async (e, fieldPath) => {
    const file = e.target.files[0];
    if (!file) return;

    const localPreview = URL.createObjectURL(file);

    // Update preview
    setFormData((prev) => {
      const updated = { ...prev };
      const keys = fieldPath.split(".");
      let target = updated;
      for (let i = 0; i < keys.length - 1; i++) {
        target = target[keys[i]];
      }
      target[keys[keys.length - 1]].url = localPreview;
      return updated;
    });

    // Upload to backend
    const data = new FormData();
    data.append("image", file);

    try {
      const res = await fetch("/upload-image", {
        method: "POST",
        body: data,
      });
      const result = await res.json();

      setFormData((prev) => {
        const updated = { ...prev };
        const keys = fieldPath.split(".");
        let target = updated;
        for (let i = 0; i < keys.length - 1; i++) {
          target = target[keys[i]];
        }
        target[keys[keys.length - 1]] = {
          public_id: result.public_id || "",
          url: result.url || localPreview,
        };
        return updated;
      });
    } catch (err) {
      console.error("Image upload failed", err);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    // Send to API
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl shadow-md w-full max-w-2xl space-y-4"
      >
        <h2 className="text-2xl font-bold">Create Question</h2>

        {/* Title */}
        <div>
          <label className="block font-semibold">Question Title</label>
          <input
            type="text"
            name="title"
            required
            value={formData.title}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
          />
        </div>

        {/* Question Image */}
        <div>
          <label className="block font-semibold">Question Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageUpload(e, "image")}
            className="w-full border rounded-lg p-2"
          />
          {formData.image.url && (
            <img
              src={formData.image.url}
              alt="Preview"
              className="mt-2 w-32 h-32 object-cover rounded-lg"
            />
          )}
        </div>

        {/* Subject */}
        <div>
          <label className="block font-semibold">Subject</label>
          <input
            type="text"
            name="subject"
            required
            value={formData.subject}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
          />
        </div>

        {/* Topic */}
        <div>
          <label className="block font-semibold">Topic</label>
          <input
            type="text"
            name="topic"
            required
            value={formData.topic}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
          />
        </div>

        {/* Marks */}
        <div>
          <label className="block font-semibold">Positive Marks</label>
          <input
            type="number"
            name="marks.positive"
            required
            value={formData.marks.positive}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
          />
        </div>
        <div>
          <label className="block font-semibold">Negative Marks</label>
          <input
            type="number"
            name="marks.negative"
            required
            value={formData.marks.negative}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
          />
        </div>

        {/* Options */}
        {["A", "B", "C", "D"].map((opt) => (
          <div key={opt} className="border p-3 rounded-lg">
            <label className="block font-semibold">Option {opt}</label>
            <input
              type="text"
              name={`options.${opt}.text`}
              placeholder="Option text"
              value={formData.options[opt].text}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 mb-2"
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e, `options.${opt}.image`)}
              className="w-full border rounded-lg p-2"
            />
            {formData.options[opt].image.url && (
              <img
                src={formData.options[opt].image.url}
                alt={`Option ${opt}`}
                className="mt-2 w-24 h-24 object-cover rounded-lg"
              />
            )}
          </div>
        ))}

        {/* Correct Options */}
        <div>
          <label className="block font-semibold">Correct Options</label>
          {["A", "B", "C", "D"].map((opt) => (
            <label key={opt} className="inline-flex items-center mr-4">
              <input
                type="checkbox"
                name="correctOptions"
                value={opt}
                checked={formData.correctOptions.includes(opt)}
                onChange={handleChange}
                className="mr-2"
              />
              {opt}
            </label>
          ))}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Create Question
        </button>
      </form>
    </div>
  );
}
