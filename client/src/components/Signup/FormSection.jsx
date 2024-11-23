import React, { useState } from "react";
import { useFormik } from "formik";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import "./FormSection.css"; // Import the CSS file

const validate = (values) => {
  const errors = {};
  if (!values.firstName) {
    errors.firstName = "First Name cannot be empty";
  } else if (values.firstName.length > 15) {
    errors.firstName = "Must be 15 characters or less";
  }

  if (!values.lastName) {
    errors.lastName = "Last Name cannot be empty";
  } else if (values.lastName.length > 20) {
    errors.lastName = "Must be 20 characters or less";
  }

  if (!values.email) {
    errors.email = "Email is required";
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = "Invalid email address";
  }

  if (!values.password) {
    errors.password = "Password is required";
  } else if (values.password.length < 8) {
    errors.password = "Password must not be less than 8 characters";
  }

  return errors;
};

function FormSection() {
  const [submitError, setSubmitError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
    validate,
    onSubmit: async (values) => {
      try {
        const response = await axios.post('http://localhost:5000/signup', values);
        if (response.status === 201) {
          localStorage.setItem('userEmail', values.email); // Store email
          navigate('/handle-form'); // Changed from /login to /handle-form
        }
      } catch (error) {
        setSubmitError(error.response?.data?.message || 'Signup failed');
      }
    },
  });

  return (
    <div className="flex flex-col space-y-5 w-[60%] m-auto mr-11">
      {/* Free Trial Button */}
      <button className="bg-purple-600 text-white font-bold py-7 px-8 w-full rounded-lg shadow-md text-4xl">
        Enter your Credentials
      </button>

      {/* Form Container */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          {/* First Name Field */}
          <div>
            <input
              type="text"
              placeholder="First Name"
              name="firstName"
              id="firstName"
              onChange={formik.handleChange}
              value={formik.values.firstName}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-black text-black text-3xl"
            />
            {formik.errors.firstName ? (
              <div className="text-red-600 text-sm mt-1">
                {formik.errors.firstName}
              </div>
            ) : null}
          </div>

          {/* Last Name Field */}
          <div>
            <input
              type="text"
              placeholder="Last Name"
              name="lastName"
              id="lastName"
              onChange={formik.handleChange}
              value={formik.values.lastName}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-black text-black text-3xl"
            />
            {formik.errors.lastName ? (
              <div className="text-red-600 text-sm mt-1">
                {formik.errors.lastName}
              </div>
            ) : null}
          </div>

          {/* Email Field */}
          <div>
            <input
              type="email"
              placeholder="Email Address"
              name="email"
              id="email"
              onChange={formik.handleChange}
              value={formik.values.email}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-black text-black text-3xl"
            />
            {formik.errors.email ? (
              <div className="text-red-600 text-sm mt-1">
                {formik.errors.email}
              </div>
            ) : null}
          </div>

          {/* Password Field */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              name="password"
              id="password"
              onChange={formik.handleChange}
              value={formik.values.password}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-black text-black text-3xl"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-2xl"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
            {formik.errors.password ? (
              <div className="text-red-600 text-sm mt-1">
                {formik.errors.password}
              </div>
            ) : null}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-green-500 text-white font-bold py-5 w-full rounded-lg shadow-md hover:bg-green-600 focus:outline-none text-4xl"
          >
            Sign Up
          </button>
          {submitError && (
            <div className="text-red-600 text-sm text-center">{submitError}</div>
          )}
        </form>

        {/* Terms and Services */}
        <p className="text-gray-600 text-xs mt-4 text-center">
          By clicking the button, you are agreeing to our&nbsp;
          <a href="nothing" className="text-red-500 underline">
            Terms and Services
          </a>
        </p>
      </div>
    </div>
  );
}

export default FormSection;
