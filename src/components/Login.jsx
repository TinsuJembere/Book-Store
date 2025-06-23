import React, { useState } from "react";
import { FaGoogle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setMessage("");
    try {
      const res = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (res.ok) {
        localStorage.setItem("token", result.token);
        localStorage.setItem("user", JSON.stringify(result.user));
        setMessage("");
        navigate("/Book-Store");
      } else {
        setMessage(result.message || "Login failed.");
      }
    } catch (err) {
      setMessage("Server error. Please try again later.");
    }
  };

  return (
    <div className="min-h-[calc(100vh-120px)] flex flex-col items-center justify-center">
      <div className="flex flex-col shadow-xl rounded-lg px-3 py-6">
        <h3 className="text-2xl font-medium">Please Login</h3>
        <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
          <label htmlFor="email" className="font-medium mb-2 mt-2">
            Email
          </label>
          <input
            type="text"
            id="email"
            {...register("email", { required: true })}
            placeholder="Email Address"
            className="shadow focus:outline-none px-6 py-1 rounded"
          />
          {errors.email && (
            <p className="text-red-500 text-xs italic">Email is required</p>
          )}

          <label htmlFor="password" className="font-medium mb-2 mt-2">
            Password
          </label>
          <input
            id="password"
            type="password"
            {...register("password", { required: true })}
            placeholder="Password"
            className="shadow focus:outline-none px-6 py-1 rounded"
          />
          {errors.password && (
            <p className="text-red-500 text-xs italic">Password is required</p>
          )}

          {message && <p className="text-red-500 text-xs italic mb-3">{message}</p>}

          <button className="text-white rounded-md bg-blue-700 w-fit px-6 py-1 mt-3 mb-3">
            Login
          </button>
        </form>

        <p className="mb-3">
          Haven't an account?{" "}
          <Link to={"/register"} className="text-blue-700">
            Register
          </Link>
        </p>
        <button className="flex items-center justify-center gap-2 py-1 bg-black rounded-md text-white">
          <FaGoogle className="size-4" /> Sign up with Google
        </button>
      </div>
    </div>
  );
};

export default Login;
