import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "react-toastify";
import { FcGoogle } from "react-icons/fc";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { auth } from "../../firebase/firebase.config";
import { signOut } from "firebase/auth";

const Signup = () => {
  const { createUser, updateUserProfile, signInWithGoogle } =
    useContext(AuthContext);

  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [registering, setRegistering] = useState(false);

  const validatePassword = (password) => {
    if (password.length < 6)
      return "Password must be at least 6 characters long.";
    if (!/[A-Z]/.test(password))
      return "Password must have at least one uppercase letter.";
    if (!/[a-z]/.test(password))
      return "Password must have at least one lowercase letter.";
    return null;
  };

  const checkEmailExists = async (email) => {
    try {
      await axios.get(`http://localhost:3000/users/check?email=${email}`);
      return false;
    } catch (error) {
      if (error.response?.status === 409) return true;
      throw error;
    }
  };

  const saveUserToDb = async ({ name, email, photoURL, role }) => {
    try {
      await axios.post("http://localhost:3000/users", {
        name,
        email,
        photoURL,
        role,
        createdAt: new Date(),
      });
    } catch (error) {
      if (error.response?.status === 409) {
        throw new Error("duplicate");
      }
      throw error;
    }

    const { data } = await axios.post("http://localhost:3000/jwt", { email });
    localStorage.setItem("token", data.token);
  };

  const handleRegister = async (event) => {
    event.preventDefault();

    const displayName = event.target.displayName.value;
    const photoURL = event.target.photoURL.value;
    const email = event.target.email.value;
    const password = event.target.password.value;

    const validationError = validatePassword(password);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    try {
      setRegistering(true);

      const emailTaken = await checkEmailExists(email);
      if (emailTaken) {
        toast.error(
          "This email is already registered. Please sign in instead.",
        );
        navigate("/login");
        return;
      }

      await createUser(email, password);
      await updateUserProfile(displayName, photoURL);
      await saveUserToDb({
        name: displayName,
        email,
        photoURL,
        role: "general user",
      });

      toast.success("Welcome! 🎉");
      navigate("/");
    } catch (error) {
      if (error.message !== "duplicate") {
        toast.error(error.response?.data?.message || error.message);
      }
    } finally {
      setRegistering(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setRegistering(true);

      const result = await signInWithGoogle();
      const { displayName, email, photoURL } = result.user;

      const emailTaken = await checkEmailExists(email);
      if (emailTaken) {
        await signOut(auth);
        toast.error("This email is already registered. Please login instead.");
        navigate("/login");
        return;
      }

      await saveUserToDb({
        name: displayName,
        email,
        photoURL,
        role: "general user",
      });

      toast.success("Welcome! 🎉");
      navigate("/");
    } catch (error) {
      if (error.message !== "duplicate") {
        toast.error(error.response?.data?.message || error.message);
      }
    } finally {
      setRegistering(false);
    }
  };

  if (registering) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-gradient">
        <span className="loading loading-spinner loading-lg text-white"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-gradient px-4">
      <div className="w-full max-w-sm bg-[#721f75] rounded-2xl p-8 border border-[#5f115f]">
        <h1 className="text-2xl font-bold text-white text-center mb-1">
          Create Account
        </h1>
        <p className="text-center text-gray-400 text-sm mb-7">Join us today</p>

        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            name="displayName"
            placeholder="Full Name"
            required
            className="w-full bg-[#252533] border border-[#2a2a38] focus:border-[#C15B9C] text-white placeholder-gray-500 rounded-lg px-4 py-2.5 text-sm outline-none transition"
          />

          <input
            type="text"
            name="photoURL"
            placeholder="Photo URL (optional)"
            className="w-full bg-[#252533] border border-[#2a2a38] focus:border-[#C15B9C] text-white placeholder-gray-500 rounded-lg px-4 py-2.5 text-sm outline-none transition"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            className="w-full bg-[#252533] border border-[#2a2a38] focus:border-[#C15B9C] text-white placeholder-gray-500 rounded-lg px-4 py-2.5 text-sm outline-none transition"
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              required
              className="w-full bg-[#252533] border border-[#2a2a38] focus:border-[#C15B9C] text-white placeholder-gray-500 rounded-lg px-4 py-2.5 pr-10 text-sm outline-none transition"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
            >
              {showPassword ? <FaEyeSlash size={15} /> : <FaEye size={15} />}
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-[#C15B9C] hover:bg-[#a84d87] text-white font-semibold py-2.5 rounded-lg text-sm transition"
          >
            Create Account
          </button>
        </form>

        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-[#5f115f]" />
          <span className="text-xs text-gray-500">or</span>
          <div className="flex-1 h-px bg-[#5f115f]" />
        </div>

        <button
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center gap-2 bg-[#252533] border border-[#2a2a38] hover:border-[#C15B9C] text-gray-300 py-2.5 rounded-lg text-sm transition"
        >
          <FcGoogle size={18} />
          Continue with Google
        </button>

        <p className="text-center text-xs text-gray-500 mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-[#C15B9C] hover:underline font-medium"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
