import React, { useState, useEffect } from "react";
import { FaEdit, FaSave, FaSpinner, FaTimes } from "react-icons/fa";
import axios from "axios";
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  EmailShareButton,
  WhatsappShareButton,
  WhatsappIcon,
  EmailIcon,
  LinkedinIcon,
  TwitterIcon,
  FacebookIcon,
} from "react-share";
import API from "../../../api/api";
const ShareJobModal = ({ job, onClose }) => {
  const [postContent, setPostContent] = useState("");
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchGeneratedPost = async () => {
      try {
        setLoading(true);
        const response = await axios.post(
          `${API}/generate-post/`,
          { job },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );
        setPostContent(response.data.postContent);
      } catch (error) {
        console.error("Error fetching generated post:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGeneratedPost();
  }, [job]);

  const handleEdit = (event) => {
    setPostContent(event.target.value);
  };

  const handleSave = () => {
    setEditing(false);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-10/12 md:w-1/2 lg:w-2/4 relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
          onClick={onClose}
        >
          <FaTimes className="text-2xl" />
        </button>
        <h2 className="text-xl font-bold mb-4">Share Job Posting</h2>
        <textarea
          value={loading ? "Loading..." : postContent}
          onChange={handleEdit}
          disabled={!editing}
          className="w-full h-40 p-2 border border-gray-300 rounded-md resize-none mb-4"
        />
        <div className="flex items-center mb-4">
          <button
            onClick={() => setEditing(!editing)}
            className="flex items-center mr-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            {editing ? (
              <>
                <FaSave className="mr-2" />
                Save
              </>
            ) : (
              <>
                <FaEdit className="mr-2" />
                Edit
              </>
            )}
          </button>
          <div className="flex justify-between space-x-2">
          <FacebookShareButton
            url={`https://www.facebook.com/sharer/sharer.php?u=${postContent}`}
            quote={postContent}
            className="p-2 border rounded-full bg-blue-600 text-white"
          >
            <FacebookIcon size={40} round />
          </FacebookShareButton>
          <TwitterShareButton
            url={`https://twitter.com/intent/tweet?text=${postContent}`}
            title={postContent}
            className="p-2 border rounded-full bg-blue-400 text-white"
          >
            <TwitterIcon size={40} round />
          </TwitterShareButton>
          <LinkedinShareButton
            url={`https://www.linkedin.com/shareArticle?mini=true&summary=${postContent}`}
            title={postContent}
            className="p-2 border rounded-full bg-blue-700 text-white"
          >
            <LinkedinIcon size={40} round />
          </LinkedinShareButton>
          <EmailShareButton
            url="mailto:?subject=Job Posting&body="
            body={postContent}
            className="p-2 border rounded-full bg-gray-600 text-white"
          >
            <EmailIcon size={40} round />
          </EmailShareButton>
          <WhatsappShareButton
            url={`https://api.whatsapp.com/send?text=${postContent}`}
            title="Job Posting"
            className="p-2 border rounded-full bg-green-600 text-white"
          >
            <WhatsappIcon size={40} round />
          </WhatsappShareButton>
        </div>
        </div>
        
      </div>
    </div>
  );
};

export default ShareJobModal;
