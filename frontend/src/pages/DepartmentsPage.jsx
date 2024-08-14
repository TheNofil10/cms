import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const DepartmentsPage = () => {
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    const fetchDepartments = async () => {
      const response = await axios.get('http://127.0.0.1:8000/api/departments/', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      });
      setDepartments(response.data);
    };

    fetchDepartments();
  }, []);

  return (
    <div>
      <h1>Departments</h1>
      <Link to="/admin/departments/add">Add New Department</Link>
      <ul>
        {departments.map(department => (
          <li key={department.id}>
            <Link to={`/admin/departments/${department.id}`}>{department.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DepartmentsPage;
