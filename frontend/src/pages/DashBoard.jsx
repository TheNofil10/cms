import React from 'react';
import SideBarComponent from '../components/SideBarComponent';
import { useAuth } from '../contexts/AuthContext';
const DashBoard = () => {
  const { currentUser } = useAuth();

  return (
    <div className='App flex'>
      <SideBarComponent />
      <div>
        {currentUser ? (
          <h1>Hello, {currentUser.first_name} {currentUser.last_name}!</h1>
        ) : (
          <h1>Hello, Guest!</h1>
        )}
      <div className='container mx-auto my-4 p-6'>
      <EmployeeCard
        profileImage='src/assets/m2.jpg'
        name='John Cena'
        department='Development Team'
        position='Senior Developer'
        username='@johndoe'
      />
      </div>
      </div>
    </div>
  );
};
export default DashBoard;
