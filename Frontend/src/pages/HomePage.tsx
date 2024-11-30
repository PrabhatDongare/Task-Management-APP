import React, { useEffect, useState } from "react";
import {
  useForm,
  SubmitHandler,
  FieldValues,
  FieldError,
} from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../utils/constant";

interface LoginData {
  email: string;
  password: string;
}

interface SignupData {
  name: string;
  email: string;
  password: string;
}

interface ApiData {
  success: boolean;
  authToken: string;
}

const HomePage: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FieldValues>();
  const navigate = useNavigate();
  const [loginState, setLoginState] = useState<boolean>(true);

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    try {
      if (loginState) {
        const { email, password } = data as LoginData;
        const response = await axios.post<ApiData>(
          API_BASE_URL + "user/login",
          { email, password },
        );
        if (response.data?.success) {
          localStorage.setItem("token", response.data?.authToken);
        }
      } else {
        const { name, email, password } = data as SignupData;
        const response = await axios.post<ApiData>(
          API_BASE_URL + "user/signup",
          { name, email, password },
        );
        if (response.data?.success) {
          localStorage.setItem("token", response.data?.authToken);
        }
      }
      navigate("/dashboard");
      toast.success("Redirecting to Dashboard!");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message ||
            "Something went wrong. Please try again.",
        );
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/dashboard");
    }
  }, []);

  return (
    <main className="flex h-[93vh] items-center justify-center bg-slate-100">
      <section className="flex h-[70vh] w-[60vw] rounded-2xl bg-indigo-400 shadow-2xl">
        <div className="flex w-1/2 flex-col items-center justify-center rounded-s-2xl bg-fuchsia-400">
          <h1 className="text-center text-4xl font-thin tracking-widest">
            WELCOME
          </h1>
          <form
            onSubmit={handleSubmit(onSubmit)}
            autoComplete="off"
            className="bg-slate-60 w-4/6 py-7 text-xl"
          >
            {/* Name */}
            {!loginState && (
              <div className="mb-5">
                <div className="mb-2 flex items-center justify-between">
                  <label>Name</label>
                  {errors.name && (
                    <span className="text-base text-red-500">
                      {(errors.name as FieldError).message}
                    </span>
                  )}
                </div>
                <input
                  {...register("name", {
                    required: {
                      value: true,
                      message: "* This field is required",
                    },
                    pattern: {
                      value: /^(?! )[A-Za-z]+(?: [A-Za-z]+)*$/,
                      message: "* invalid name",
                    },
                  })}
                  className="w-full rounded-md border border-black bg-slate-100 px-2 py-1"
                />
              </div>
            )}

            {/* Email */}
            <div className="mb-5">
              <div className="mb-2 flex items-center justify-between">
                <label>Email</label>
                {errors.email && (
                  <span className="text-base text-red-500">
                    {(errors.email as FieldError).message}
                  </span>
                )}
              </div>
              <input
                {...register("email", {
                  required: {
                    value: true,
                    message: "* This field is required",
                  },
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: "* Invalid email",
                  },
                })}
                className="w-full rounded-md border border-black bg-slate-100 px-2 py-1"
              />
            </div>

            {/* Password */}
            <div className="mb-5">
              <div className="mb-2 flex items-center justify-between">
                <label>Password</label>
                {errors.password && (
                  <span className="text-base text-red-500">
                    {(errors.password as FieldError).message}
                  </span>
                )}
              </div>
              <input
                type="password"
                {...register("password", {
                  required: {
                    value: true,
                    message: "* This field is required",
                  },
                })}
                className="w-full rounded-md border border-black bg-slate-100 px-2 py-1"
              />
            </div>

            {/* Submit */}
            <input
              disabled={isSubmitting}
              type="submit"
              value="Login"
              className="mt-2 w-full cursor-pointer rounded-lg bg-[#088F8F] py-2 text-white"
            />
          </form>

          {loginState ? (
            <button
              className="cursor-pointer"
              onClick={() => setLoginState(!loginState)}
            >
              <span>Don't have an account - </span>
              <span className="text-blue-700 underline underline-offset-2">
                SignUp
              </span>
            </button>
          ) : (
            <button
              className="cursor-pointer"
              onClick={() => setLoginState(!loginState)}
            >
              <span>Already have an account - </span>
              <span className="text-blue-700 underline underline-offset-2">
                Login
              </span>
            </button>
          )}
        </div>
        <div className="mx-auto my-auto">
          <img className="h-96" src="/image.png" alt="login image" />
        </div>
      </section>
    </main>
  );
};

export default HomePage;
