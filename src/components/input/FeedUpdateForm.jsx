import React, { useState, useEffect } from "react";
import Select from "react-dropdown-select";
import { get } from "../../services/ApiEndpoint";

const FeedUpdateForm = ({ data, onSave, onCancel }) => {
  const [formData, setFormData] = useState(data);

  useEffect(() => {
    setFormData(data);
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (name, selected) => {
    setFormData({ ...formData, [name]: selected[0]?.value || "" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const categoryOptions = [
    { label: "Positive", value: "Positive" },
    { label: "Neutral", value: "Neutral" },
    { label: "Negative", value: "Negative" },
  ];

  return (
    <div className="bg-white p-6 rounded-lg border-2 border-secondary-300 shadow-lg mb-4 w-2/5">
      <h2 className="text-2xl font-semibold mb-4">Edit Feedback</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Comment:</label>
          <input
            type="text"
            name="comment"
            value={formData.comment}
            onChange={handleChange}
            required
            className="w-full p-2 border border-secondary-300 rounded mt-1 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Category:</label>
          <Select
            options={categoryOptions}
            onChange={(selected) => handleSelectChange("category", selected)}
            values={categoryOptions.filter(
              (option) => option.value === formData.category
            )}
            className="w-full p-2 border border-gray-300 rounded mt-1"
            color="orange"
          />
        </div>
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="bg-primary-500 hover:bg-tertiary-100 text-white px-4 py-2 rounded mr-2"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-secondary-300 hover:bg-secondary-500 text-white px-4 py-2 rounded"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default FeedUpdateForm;
