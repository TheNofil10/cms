import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FaUser, FaArrowRight, FaTrash } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {ENCODING_URL} from "../../api/api";

const FacialEncoding = ({ isOpen, onClose, employeeId }) => {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    employee_id: employeeId || "", // Directly use the passed employeeId
    profile_images: [], // For multiple images
  });

  const [imagePreviews, setImagePreviews] = useState([]); // Previews for the selected images
  const [step, setStep] = useState(2); // Start directly at step 2
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef(null); // Ref to programmatically trigger file input

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prevState) => ({
      ...prevState,
      profile_images: [...prevState.profile_images, ...files], // Append new files
    }));

    // Create image previews
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews((prevState) => [...prevState, ...previews]); // Append new previews
  };

  const handleRemoveImage = (index) => {
    setFormData((prevState) => {
      const newImages = [...prevState.profile_images];
      newImages.splice(index, 1); // Remove the image from the array
      return { ...prevState, profile_images: newImages };
    });
    setImagePreviews((prevState) => {
      const newPreviews = [...prevState];
      newPreviews.splice(index, 1); // Remove the preview
      return newPreviews;
    });
  };

  const handleUpdateEncoding = (e) => {
    e.preventDefault();
    setLoading(true);

    const formDataObj = new FormData();
    formDataObj.append("employee_id", formData.employee_id);

    // Append multiple images to FormData
    formData.profile_images.forEach((image) => {
      formDataObj.append("profile_images", image);
    });

    console.log("ENCODING_URL", ENCODING_URL);

    axios
      .post(`${ENCODING_URL}/update_encoding/`, formDataObj, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((response) => {
        toast.success("Encoding updated successfully!");
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        toast.error("Failed to update encoding.");
      });
  };

  const handleAddMoreFiles = () => {
    fileInputRef.current.click(); // Trigger file input click programmatically
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md">
        <h2 className="text-3xl mb-6 text-black text-center">Update Encoding</h2>
        <ToastContainer />

        {/* Form */}
        <form onSubmit={handleUpdateEncoding} className="bg-white p-8 rounded-lg shadow-2xl">
          {/* Step 2: Upload Profile Image */}
          {step === 2 && (
            <>
              <div className="mb-4">
                <label className="block text-sm mb-2">Profile Images</label>
                <input
                  ref={fileInputRef}
                  type="file"
                  name="profile_images"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  className="w-full p-2 bg-gray-200 border-none outline-none hidden"
                />

                {/* Button to trigger file input */}
                <button
                  type="button"
                  onClick={handleAddMoreFiles}
                  className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600 transition duration-200"
                >
                  Add More Files
                </button>
              </div>

              {/* Preview Selected Images */}
              {imagePreviews.length > 0 && (
                <div className="mb-4 grid grid-cols-2 gap-2">
                  {imagePreviews.map((preview, index) => (
                    <div className="relative" key={index}>
                      <img
                        src={preview}
                        alt={`Selected image ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 m-1"
                        onClick={() => handleRemoveImage(index)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <button
                type="submit"
                className={`bg-black text-white p-2 rounded transition duration-200 ${loading ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-800"}`}
                disabled={loading} // Disable button when loading
              >
                {loading ? (
                  <svg
                    className="animate-spin h-5 w-5 text-white inline-block"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    ></path>
                  </svg>
                ) : (
                  "Submit"
                )}
              </button>
            </>
          )}
        </form>
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="mt-4 bg-red-500 text-white p-2 rounded hover:bg-red-600 transition duration-200 w-full"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default FacialEncoding;
