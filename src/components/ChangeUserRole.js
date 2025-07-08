import React, { useState } from "react";
import ROLE from "../common/role";
import { IoMdClose } from "react-icons/io";
import SummaryApi from "../common";
import toast from "react-hot-toast";

const ChangeUserRole = ({
  name,
  email,
  role,
  userId,
  onClose,
  callFunc,
  authToken,
}) => {
  const [userRole, setUserRole] = useState(role);

  const handleOnChangeSelect = (e) => {
    setUserRole(e.target.value);
    console.log(e.target.value);
  };

  const updateUserRole = async () => {
    const fetchResponse = await fetch(SummaryApi.updateUser.url, {
      method: SummaryApi.updateUser.method,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        userId: userId,
        role: userRole,
      }),
    });

    const responseData = await fetchResponse.json();

    if (responseData.success) {
      toast.success(responseData.message);
      onClose();
      callFunc();
    }

    console.log("role updated", responseData);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 bg-opacity-60 flex items-center justify-center">
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-sm p-6">
        {/* Close Button */}
        <button
          className="absolute top-3 right-3 text-gray-600 hover:text-red-600 transition"
          onClick={onClose}
        >
          <IoMdClose size={22} />
        </button>

        {/* Title */}
        <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
          Change User Role
        </h2>

        {/* User Info */}
        <div className="mb-4 text-sm text-gray-700 space-y-1">
          <p>
            <span className="font-semibold">Name :</span> {name}
          </p>
          <p>
            <span className="font-semibold">Email :</span> {email}
          </p>
        </div>

        {/* Role Selection */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Role :
          </label>
          <select
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={userRole}
            onChange={handleOnChangeSelect}
          >
            {Object.values(ROLE).map((el) => (
              <option value={el} key={el}>
                {el}
              </option>
            ))}
          </select>
        </div>

        {/* Action Button */}
        <button
          onClick={updateUserRole}
          className="w-full py-2 rounded-lg bg-sky-600 text-white font-semibold hover:bg-sky-700 transition"
        >
          Change Role
        </button>
      </div>
    </div>
  );
};

export default ChangeUserRole;
