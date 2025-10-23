import React, { useState } from "react";
import { useNavigate } from "react-router-dom";


const Profile = () => {
  const navigate = useNavigate(); // hook navigate
  const [fullName, setFullName] = useState("");
  const [nickName, setNickName] = useState("");
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
const handleAgeChange = (e) => {
    const value = e.target.value;

    // Chỉ cho phép số nguyên dương
    if (value === "" || /^[0-9]+$/.test(value)) {
      setAge(value);

      // Kiểm tra hợp lệ
      if (value === "") {
        setAgeError("Age is required");
      } else if (parseInt(value) <= 0) {
        setAgeError("Age must be greater than 0");
      } else if (parseInt(value) > 150) {
        setAgeError("Age seems too high");
      } else {
        setAgeError(""); // hợp lệ
      }
    }
  };
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-pink-50 rounded-lg shadow-md p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <button
            className="text-pink-400 hover:underline"
            onClick={() => navigate(-1)} // quay lại trang trước
          >&larr; Trở về</button>
          <button className="bg-pink-300 text-white px-4 py-2 rounded hover:bg-pink-400">
            Edit
          </button>
        </div>

        {/* Profile Info */}
        <div className="flex items-center space-x-6 mb-6">
          <img
            src="https://via.placeholder.com/100"
            alt="avatar"
            className="w-24 h-24 rounded-full object-cover"
          />
          <div>
            <h2 className="text-xl font-semibold">Dương Văn A</h2>
            <p className="text-gray-500 text-sm">alexarawles@gmail.com</p>
          </div>
        </div>

        {/* Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              placeholder="Your Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nick Name
            </label>
            <input
              type="text"
              placeholder="Your Nick Name"
              value={nickName}
              onChange={(e) => setNickName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Gender
            </label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Age
            </label>
            <input
              type="number"
              placeholder="Your Age"
              value={age}
              onChange={handleAgeChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2"
            />
          </div>
        </div>

        {/* Email Addresses */}
        <div>
          <p className="font-semibold mb-2">My email Address</p>
          <div className="flex items-center mb-2">
            <div className="bg-blue-200 p-2 rounded-full mr-2">
              <span role="img" aria-label="email">
                📧
              </span>
            </div>
            <span className="text-gray-700">alexarawles@gmail.com</span>
          </div>
          <button className="mt-2 bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200">
            + Add Email Address
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
