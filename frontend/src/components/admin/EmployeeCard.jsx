import React from "react";
import picture from "../../assets/profile.png"
const EmployeeCard = ({ employee, onClick }) => {
  return (
    <div
      className="bg-white p-4 border border-gray-200 rounded-lg shadow-md cursor-pointer hover:shadow-lg"
      onClick={onClick}
    >
      {/* {employee.profile_image ? ( */}
        <img src={employee.profile_image ? employee.profile_image: picture} alt="Profile" className="w-16 h-16 rounded-full mb-4" />
      {/* ) : (
        <div className="w-16 h-16 bg-gray-200 rounded-full mb-4"></div>
      )} */}
      <h3 className="text-lg font-semibold">{employee.first_name} {employee.last_name}</h3>
      <p className="text-gray-600">{employee.position}</p>
      <p className="text-gray-600">{employee.department}</p>
    </div>
  );
};

export default EmployeeCard;
