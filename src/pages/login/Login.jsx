import { Link, useLocation, useNavigate } from "react-router";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { FcGoogle } from "react-icons/fc";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase/firebase.config";

const Login = () => {
  const { signInUser, signInWithGoogle } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const saveToken = async (email) => {
    try {
      console.log("Saving token for:", email);
      const { data } = await axios.post("http://localhost:3000/jwt", { email });
      console.log("Token received:", data.token);
      localStorage.setItem("token", data.token);
    } catch (err) {
      console.error(
        "Token save failed:",
        err.response?.status,
        err.response?.data,
      );
    }
  };

  const handleLogIn = async (event) => {
    event.preventDefault();
    const email = event.target.email.value;
    const password = event.target.password.value;

    try {
      setLoading(true);
      await signInUser(email, password);
      await saveToken(email);
      toast.success("Logged in successfully!");
      navigate(location.state?.from || "/");
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      const result = await signInWithGoogle();
      const { email } = result.user;

      try {
        await axios.get(`http://localhost:3000/users/check?email=${email}`);

        toast.error("No account found. Please sign up first.");
        await signOut(auth);
        setLoading(false);
        return;
      } catch (err) {
        if (err.response?.status === 409) {
          const { data } = await axios.post("http://localhost:3000/jwt", {
            email,
          });
          localStorage.setItem("token", data.token);
          toast.success("Logged in successfully!");
          navigate(location.state?.from || "/");
        } else {
          throw err;
        }
      }
    } catch (error) {
      if (
        error.code === "auth/popup-closed-by-user" ||
        error.code === "auth/cancelled-popup-request"
      ) {
        return;
      }
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          background: "linear-gradient(90deg, #625FA3, #C15B9C, #6EB18E)",
        }}
      >
        <span className="loading loading-spinner loading-lg text-white" />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{
        background: "linear-gradient(90deg, #625FA3, #C15B9C, #6EB18E)",
      }}
    >
      <div className="w-full max-w-sm bg-[#721f75] rounded-2xl p-8 border border-[#5f115f]">
        <h1 className="text-2xl font-bold text-white text-center mb-1">
          Login
        </h1>
        <p className="text-center text-gray-400 text-sm mb-7">Welcome back</p>

        <form onSubmit={handleLogIn} className="space-y-4">
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

          <div className="text-right">
            <a href="#" className="text-xs text-[#C15B9C] hover:underline">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full bg-[#C15B9C] hover:bg-[#a84d87] text-white font-semibold py-2.5 rounded-lg text-sm transition"
          >
            Login
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
          <span className="pointer-events-none">
            <FcGoogle size={18} />
          </span>
          Continue with Google
        </button>

        <p className="text-center text-xs text-gray-500 mt-6">
          New here?{" "}
          <Link
            to="/sign-up"
            className="text-[#C15B9C] hover:underline font-medium"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
