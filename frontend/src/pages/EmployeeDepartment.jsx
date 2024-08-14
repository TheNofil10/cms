import React, { useEffect, useState } from 'react';
import axios from 'axios';

const EmployeeDepartment = () => {
    const [department, setDepartment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      const fetchDepartment = async () => {
        try {
          const response = await axios.get('http://127.0.0.1:8000/api/department/me', {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            },
          });
          console.log(response.data); // Add this line to debug
          setDepartment(response.data);
        } catch (error) {
          setError('Error fetching department data');
        } finally {
          setLoading(false);
        }
      };
  
      fetchDepartment();
    }, []);
  
    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;
  
    return (
      <div>
        <h1>Department: {department?.name}</h1>
        <p>Description: {department?.description}</p>
        <h2>Members</h2>
        <ul>
          {department?.members?.map(member => (
            <li key={member.username}>
              <p>{member.first_name} {member.last_name}</p>
              <p>{member.email}</p>
              <p>{member.position}</p>
              {/* Add any other fields you want to display */}
            </li>
          ))}
        </ul>
      </div>
    );
  };  

export default EmployeeDepartment;
