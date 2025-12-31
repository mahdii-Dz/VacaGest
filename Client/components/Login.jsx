"use client";
import Image from "next/image";
import Link from "next/link";
import {  useEffect, useState } from "react";

function Login() {
  const [LogData, setLogData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (localStorage.getItem("userData")) {
      window.location.href = "/Dashboard";
    }
  }, []);

  async function CheckUser() {
    try {
      setError("");
      setMsg("");
      setIsLoading(true);
      const response = await fetch("http://localhost:5000/api/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: LogData.email,
          password: LogData.password,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setMsg(data.message);
        console.log(data);
        localStorage.setItem(
          "userData",
          JSON.stringify({
            ...data.user,
          })
        );
        setTimeout(() => {
          window.location.href = "/Dashboard";
        }, 1500);
      } else {
        setError(data.message);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    CheckUser();
  }
  function handleChange(e) {
    setLogData({ ...LogData, [e.target.id]: e.target.value });
  }

  return (
    <section className="w-full h-dvh flex flex-col justify-center items-center">
      <div>
        <Image
          src={"/VacaGest.svg"}
          width={176}
          height={53}
          alt="VacaGest Logo"
        />
        <h2 className="text-5.5 font-semibold text-center">Bon retour</h2>
        {msg && (
          <p className="text-green-500 mt-4 text-center bg-green-200 rounded-md py-0.5">
            {msg}
          </p>
        )}
        {error && (
          <p className="text-red-500 mt-4 text-center bg-red-200 rounded-md py-0.5">
            {error}
          </p>
        )}
      </div>
      <form onSubmit={handleSubmit} className="mt-16 w-[30vw]">
        <div className="flex flex-col gap-3 mb-4">
          <label className="font-semibold" htmlFor="email">
            Adresse e-mail
          </label>
          <input
            onChange={handleChange}
            type="text"
            className="w-full outline-none border border-black/20 rounded-md bg-[#F3F5F7] h-11 px-4 "
            placeholder="Entrez votre adresse e-mail"
            id="email"
          />
        </div>
        <div className="flex flex-col gap-3">
          <label className="font-semibold" htmlFor="password">
            Mot de passe
          </label>
          <input
            onChange={handleChange}
            type="password"
            className="w-full outline-none border border-black/20 rounded-md bg-[#F3F5F7] h-11 px-4 "
            placeholder="Entrez votre mot de passe"
            id="password"
          />
        </div>
        <p className="text-[14px] text-gray-600 mt-1.5 mb-6 cursor-pointer">
          Mot de passe oublié?
        </p>
        <button
          className="w-full bg-primary rounded-md h-11 text-white font-semibold cursor-pointer hover:bg-primary/80"
          type="submit"
        >
          {isLoading ? "Chargement..." : "Se connecter"}
        </button>
      </form>
      <p className="mt-8 text-[14px] text-gray-600">
        Vous n'avez pas de compte?{" "}
        <Link href="/Register" className="text-primary cursor-pointer ">
          S'inscrire
        </Link>
      </p>
    </section>
  );
}

export default Login;
