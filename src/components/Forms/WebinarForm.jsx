"use client";
import React, { useState, useEffect } from "react";

const WebinarForm = ({ onSubmit }) => {
  const [form, setForm] = useState({
    title: "",
    description: {
      short: "",
      long: "",
    },
    price: "",
    webinarType: "OTA",
    time: "",
    date: "",
    seatLimit: 1,
    duration: "",
    fees: 0,
    image: {
      public_id: "",
      url: "",
    },
    webinarLink: "",
    assetsLinks: [],
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    if (form.webinarType === "OTO") {
      setForm((prev) => ({ ...prev, seatLimit: 1 }));
    }
  }, [form.webinarType]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleDescriptionChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      description: {
        ...prev.description,
        [name]: value,
      },
    }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      setForm((prev) => ({
        ...prev,
        image: {
          public_id: data.public_id,
          url: data.url,
        },
      }));
    } catch (err) {
      console.error("Image upload failed", err);
    }
  };

  const handleAssetsChange = (index, field, value) => {
    const updated = [...form.assetsLinks];
    updated[index] = { ...updated[index], [field]: value };
    setForm((prev) => ({ ...prev, assetsLinks: updated }));
  };

  const addAsset = () => {
    setForm((prev) => ({
      ...prev,
      assetsLinks: [...prev.assetsLinks, { name: "PDF", link: "" }],
    }));
  };

  const removeAsset = (index) => {
    const updated = [...form.assetsLinks];
    updated.splice(index, 1);
    setForm((prev) => ({ ...prev, assetsLinks: updated }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md space-y-4"
    >
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
        Create Webinar
      </h2>

      <div>
        <label className="block text-gray-700 dark:text-gray-300">Title</label>
        <input
          type="text"
          name="title"
          className="w-full mt-1 p-2 border rounded dark:bg-gray-700 dark:text-white"
          value={form.title}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label className="block text-gray-700 dark:text-gray-300">
          Short Description
        </label>
        <input
          type="text"
          name="short"
          className="w-full mt-1 p-2 border rounded dark:bg-gray-700 dark:text-white"
          value={form.description.short}
          onChange={handleDescriptionChange}
          required
        />
      </div>

      <div>
        <label className="block text-gray-700 dark:text-gray-300">
          Long Description
        </label>
        <textarea
          name="long"
          className="w-full mt-1 p-2 border rounded dark:bg-gray-700 dark:text-white"
          value={form.description.long}
          onChange={handleDescriptionChange}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700 dark:text-gray-300">
            Price
          </label>
          <input
            type="number"
            name="price"
            className="w-full mt-1 p-2 border rounded dark:bg-gray-700 dark:text-white"
            value={form.price}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 dark:text-gray-300">Fees</label>
          <input
            type="number"
            name="fees"
            className="w-full mt-1 p-2 border rounded dark:bg-gray-700 dark:text-white"
            value={form.fees}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-gray-700 dark:text-gray-300">
          Webinar Type
        </label>
        <select
          name="webinarType"
          className="w-full mt-1 p-2 border rounded dark:bg-gray-700 dark:text-white"
          value={form.webinarType}
          onChange={handleChange}
        >
          <option value="OTA">Open to All</option>
          <option value="OTO">Open to One</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700 dark:text-gray-300">Time</label>
          <input
            type="time"
            name="time"
            className="w-full mt-1 p-2 border rounded dark:bg-gray-700 dark:text-white"
            value={form.time}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 dark:text-gray-300">Date</label>
          <input
            type="date"
            name="date"
            className="w-full mt-1 p-2 border rounded dark:bg-gray-700 dark:text-white"
            value={form.date}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-gray-700 dark:text-gray-300">
          Seat Limit
        </label>
        <input
          type="number"
          name="seatLimit"
          className="w-full mt-1 p-2 border rounded dark:bg-gray-700 dark:text-white"
          value={form.seatLimit}
          onChange={handleChange}
          required
          disabled={form.webinarType === "OTO"}
        />
      </div>

      <div>
        <label className="block text-gray-700 dark:text-gray-300">
          Duration (minutes)
        </label>
        <input
          type="number"
          name="duration"
          className="w-full mt-1 p-2 border rounded dark:bg-gray-700 dark:text-white"
          value={form.duration}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label className="block text-gray-700 dark:text-gray-300">
          Webinar Link
        </label>
        <input
          type="url"
          name="webinarLink"
          className="w-full mt-1 p-2 border rounded dark:bg-gray-700 dark:text-white"
          value={form.webinarLink}
          onChange={handleChange}
        />
      </div>

      <div>
        <label className="block text-gray-700 dark:text-gray-300">Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="mt-1 block w-full text-sm text-gray-500 dark:text-gray-300"
        />
        {imagePreview && (
          <img
            src={imagePreview}
            alt="Preview"
            className="mt-2 w-32 h-32 object-cover rounded"
          />
        )}
      </div>

      <div>
        <label className="block text-gray-700 dark:text-gray-300 mb-2">
          Assets
        </label>
        {form.assetsLinks.map((asset, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <select
              value={asset.name}
              onChange={(e) =>
                handleAssetsChange(index, "name", e.target.value)
              }
              className="p-2 rounded border dark:bg-gray-700 dark:text-white"
            >
              <option value="PDF">PDF</option>
              <option value="VIDEO">VIDEO</option>
              <option value="PPT">PPT</option>
            </select>
            <input
              type="url"
              placeholder="Asset link"
              value={asset.link}
              onChange={(e) =>
                handleAssetsChange(index, "link", e.target.value)
              }
              className="flex-grow p-2 rounded border dark:bg-gray-700 dark:text-white"
            />
            <button
              type="button"
              onClick={() => removeAsset(index)}
              className="px-3 py-1 text-sm text-white bg-red-600 rounded"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addAsset}
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
        >
          Add Asset
        </button>
      </div>

      <button
        type="submit"
        className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Submit Webinar
      </button>
    </form>
  );
};

export default WebinarForm;
