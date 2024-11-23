import React from "react";
import { useFormik } from "formik";
import "./Handle.css"; // Import the CSS file

const validate = (values) => {
  const errors = {};
  if (!values.codechef) {
    errors.codechef = "CodeChef Username cannot be empty";
  } else if (values.codechef.length > 15) {
    errors.codechef = "Must be 15 characters or less";
  }

  if (!values.codeforces) {
    errors.codeforces = "Codeforces Username cannot be empty";
  } else if (values.codeforces.length > 20) {
    errors.codeforces = "Must be 20 characters or less";
  }

  if (!values.leetcode) {
    errors.leetcode = "LeetCode Username cannot be empty";
  } else if (values.leetcode.length > 20) {
    errors.leetcode = "Must be 20 characters or less";
  }

  return errors;
};

function HandleForm() {
  const formik = useFormik({
    initialValues: {
      codechef: "",
      codeforces: "",
      leetcode: "",
    },
    validate,
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2));
    },
  });

  return (
    <div className="flex flex-col space-y-5 w-[60%] m-auto mr-11">
      {/* Free Trial Button */}
      <button className="bg-purple-600 text-white font-bold py-7 px-8 w-full rounded-lg shadow-md text-4xl">
        Enter your Handles
      </button>

      {/* Form Container */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          {/* CodeChef Handle */}
          <div>
            <input
              type="text"
              placeholder="CodeChef Username"
              name="codechef"
              id="codechef"
              onChange={formik.handleChange}
              value={formik.values.codechef}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-black text-black text-3xl"
            />
            {formik.errors.codechef ? (
              <div className="text-red-600 text-sm mt-1">
                {formik.errors.codechef}
              </div>
            ) : null}
          </div>

          {/* Codeforces handle */}
          <div>
            <input
              type="text"
              placeholder="Codeforces Username"
              name="codeforces"
              id="codeforces"
              onChange={formik.handleChange}
              value={formik.values.codeforces}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-black text-black text-3xl"
            />
            {formik.errors.codeforces ? (
              <div className="text-red-600 text-sm mt-1">
                {formik.errors.codeforces}
              </div>
            ) : null}
          </div>
          
          {/* LeetCode */}
          <div>
            <input
              type="text"
              placeholder="LeetCode Username"
              name="leetcode"
              id="leetcode"
              onChange={formik.handleChange}
              value={formik.values.leetcode}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-black text-black text-3xl"
            />
            {formik.errors.leetcode ? (
              <div className="text-red-600 text-sm mt-1">
                {formik.errors.leetcode}
              </div>
            ) : null}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-green-500 text-white font-bold py-5 w-full rounded-lg shadow-md hover:bg-green-600 focus:outline-none text-4xl"
          >
            Submit
          </button>
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

export default HandleForm;