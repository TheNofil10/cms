import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddDepartment = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        'http://127.0.0.1:8000/api/departments/',
        { name, description },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        }
      );
      navigate('/admin/departments');
    } catch (error) {
      console.error('Error creating department', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Department Name:
        <input value={name} onChange={(e) => setName(e.target.value)} />
      </label>
      <label>
        Description:
        <input value={description} onChange={(e) => setDescription(e.target.value)} />
      </label>
      <button type="submit">Add Department</button>
    </form>
  );
};

export default AddDepartment;
