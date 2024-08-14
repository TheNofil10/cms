import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FaEye, FaTrash } from 'react-icons/fa';

const DepartmentDetailPage = () => {
  const { id } = useParams();
  const [department, setDepartment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDepartment = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/departments/${id}/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        });
        setDepartment(response.data);
      } catch (error) {
        setError('Error fetching department data');
      } finally {
        setLoading(false);
      }
    };

    fetchDepartment();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  const handleUpdate = async (updatedData) => {
    try {
      await axios.put(
        `http://127.0.0.1:8000/api/departments/${id}/`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        }
      );
      setDepartment(updatedData);
    } catch (error) {
      console.error('Error updating department', error);
    }
  };

  const handleDeleteMember = async (memberId) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/departments/${id}/members/${memberId}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      setDepartment({
        ...department,
        members: department.members.filter(member => member.id !== memberId),
      });
    } catch (error) {
      console.error('Error deleting member', error);
    }
  };

  return (
    <div>
      <h1>{department.name}</h1>
      <p>{department.description}</p>
      <h2>Members</h2>
      <ul>
        {department.members.map(member => (
          <li key={member.id}>
            {member.name}
            <button onClick={() => handleDeleteMember(member.id)}><FaTrash /></button>
          </li>
        ))}
      </ul>
      <h2>Manager: {department.manager?.name || 'None'}</h2>
    </div>
  );
};

export default DepartmentDetailPage;
