import RootLayout from "@/layout/RootLayout";
import { signIn, useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { FaEnvelope, FaLock } from "react-icons/fa";
import Swal from "sweetalert2";

const LoginPage = () => {
  const { data: session } = useSession();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    setFormData({ name: "", email: "", password: "" });
  };

  const handleGoogleSignup = () => {
    signIn("google", {
      callbackUrl: "https://pc-builder-ashen.vercel.app/",
    });
    if (session) {
      Swal.fire("wow login", "successfull");
    }
  };
  const handleGithubSignup = () => {
    signIn("github", {
      callbackUrl: "https://pc-builder-ashen.vercel.app/",
    });
    if (session) {
      Swal.fire("wow login", "successfull");
    }
  };

  if (session?.user) {
    return (
      <div
        onClick={() => signOut()}
        className="flex flex-col items-center justify-center h-[70vh] bg-gray-100"
      >
        <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300">
          Log out
        </button>
      </div>
    );
  }
  return (
    <div className="md:main-container mb-10 bg-gray-100">
      <nav aria-label="breadcrumb" className="w-full">
        <ol className="flex h-8 space-x-2">
          <li className="flex items-center">
            <Link
              rel="noopener noreferrer"
              href="/"
              title="Back to homepage"
              className="hover:underline"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-5 h-5 pr-1 dark:text-pink-500"
              >
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
              </svg>
            </Link>
          </li>
          <li className="flex items-center space-x-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 32 32"
              aria-hidden="true"
              fill="currentColor"
              className="w-2 h-2 mt-1 transform rotate-90 fill-current dark:text-gray-600"
            >
              <path d="M32 30.031h-32l16-28.061z"></path>
            </svg>
            <Link
              rel="noopener noreferrer"
              href="/login"
              className="flex items-center px-1 capitalize hover:underline"
            >
              login
            </Link>
          </li>
        </ol>
      </nav>
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold">Please login</h2>
          <p className="text-sm mb-4">Welcome to our vip customer.</p>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-gray-600"
              >
                Email
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <FaEnvelope />
                </span>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-2 pl-10 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>
            <div className="mb-6">
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium text-gray-600"
              >
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <FaLock />
                </span>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full p-2 pl-10 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-200"
            >
              login
            </button>
          </form>
          <div className="mt-5">
            <p className="text-center">OR LOGIN IN WITH</p>
            <div className="flex gap-x-3 mt-5">
              <button
                onClick={handleGithubSignup}
                className="bg-gray-700 w-full py-2 rounded text-white text-center"
              >
                Github
              </button>
              <button
                onClick={handleGoogleSignup}
                className="bg-red-500 w-full py-2 rounded text-white text-center"
              >
                Google
              </button>
            </div>
            <p className="text-center mt-5">
              <span className="mr-1">If you are new here.</span>
              <Link className="text-blue-600 hover:underline" href="#">
                create account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
LoginPage.getLayout = function getLayout(page) {
  return <RootLayout>{page}</RootLayout>;
};
