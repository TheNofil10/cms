import React, { useState, useEffect } from "react";
import { FaEdit, FaSave, FaTimes } from "react-icons/fa";
import axios from "axios";
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  EmailShareButton,
  WhatsappShareButton,
} from "react-share";

const ShareJobModal = ({ job, onClose }) => {
  const [postContent, setPostContent] = useState("");
  const [email, setEmail] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const fetchGeneratedPost = async () => {
      try {
        const response = await axios.post(
          "http://127.0.0.1:8000/api/generate-post/",
          { job },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          }
        );
        setPostContent(response.data.postContent);
        setIsOpen(true);
      } catch (error) {
        console.error("Error fetching generated post:", error);
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

  const encodedContent = postContent;

  return isOpen ? (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-1/2 lg:w-1/3 relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
          onClick={onClose}
        >
          <FaTimes className="text-2xl" />
        </button>
        <h2 className="text-xl font-bold mb-4">Share Job Posting</h2>
        <textarea
          value={postContent}
          onChange={handleEdit}
          disabled={!editing}
          className="w-full h-40 p-2 border border-gray-300 rounded-md resize-none mb-4"
        />
        <div className="flex items-center mb-4">
          <button
            onClick={handleSave}
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
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div className="flex justify-between">
          <FacebookShareButton
            url={`https://www.facebook.com/sharer/sharer.php?u=${encodedContent}`}
            quote={postContent}
            className="p-2 border rounded-md bg-blue-600 text-white"
          >
            Share on Facebook
          </FacebookShareButton>
          <TwitterShareButton
            url={`https://twitter.com/intent/tweet?text=${encodedContent}`}
            title={postContent}
            className="p-2 border rounded-md bg-blue-400 text-white"
          >
            Share on Twitter
          </TwitterShareButton>
          <LinkedinShareButton
            url={`https://www.linkedin.com/shareArticle?mini=true&summary=${encodedContent}`}
            title={postContent}
            className="p-2 border rounded-md bg-blue-700 text-white"
          >
            Share on LinkedIn
          </LinkedinShareButton>
          <EmailShareButton
            url={`mailto:?subject=Job Posting&body=${encodedContent}`}
            subject="Job Posting"
            body={postContent}
            className="p-2 border rounded-md bg-gray-600 text-white"
          >
            Share via Email
          </EmailShareButton>
          <WhatsappShareButton
            url={`mailto:?subject=Job Posting&body=${encodedContent}`}
            subject="Job Posting"
            body={postContent}
            className="p-2 border rounded-md bg-gray-600 text-white"
          >
                Whatsappp
          </WhatsappShareButton>
        </div>
      </div>
    </div>
  ) : null;
};

export default ShareJobModal;
