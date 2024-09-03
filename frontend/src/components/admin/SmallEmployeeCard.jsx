import React from 'react';

const SmallEmployeeCard = ({ employee }) => {
  const { profile_image, first_name, last_name, position } = employee;

  return (
    <div className="bg-white p-1 rounded-lg flex items-center space-x-4">
      <img
        src={profile_image || "default-profile.png"}
        alt={`${first_name} ${last_name}`}
        className="w-4 h-4 rounded-full object-cover"
      />
      <div className="flex flex-col">
        <h3 className="text-sm font-semibold">{`${first_name} ${last_name}`}</h3>
        <p className="text-xs text-gray-500">{position || "No Position"}</p>
      </div>
    </div>
  );
};

export default SmallEmployeeCard;
