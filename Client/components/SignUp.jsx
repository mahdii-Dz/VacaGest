"use client";
import Image from "next/image";
import React, { useContext, useState } from "react";
import UnivEmailValidate from "./UnivEmailValidate";
import Link from "next/link";
import { GLobalContext } from "@/app/AppContext/Context";
import { useRouter } from "next/navigation";

function SignUp() {
  const { FormData, setFormData } = useContext(GLobalContext);
  const [errors, setErrors] = useState({});
  const router = useRouter();

  const validateForm = () => {
    const newErrors = {};

    // Required field validation
    if (!FormData.fName?.trim()) newErrors.fName = "Le prénom est requis";
    if (!FormData.lName?.trim()) newErrors.lName = "Le nom est requis";
    if (!FormData.phone) newErrors.phone = "Le téléphone est requis";
    if (!FormData.grade?.trim()) newErrors.grade = "Le grade est requis";
    if (!FormData.specialty?.trim())
      newErrors.specialty = "La spécialité est requise";
    if (!FormData.statue?.trim()) newErrors.statue = "Le statut est requis";
    if (!FormData.password?.trim())
      newErrors.password = "Le mot de passe est requis";

    if (FormData.password && FormData.password.length < 6) {
      newErrors.password =
        "Le mot de passe doit contenir au moins 6 caractères";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      router.push("/VerifyEmail");
    } else {
      const firstErrorField = Object.keys(errors)[0];
      if (firstErrorField) {
        const element = document.getElementById(firstErrorField);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
          element.focus();
        }
      }
    }
  };

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData({ ...FormData, [name]: value });

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  }

  // Alternative: Show validation on button click without preventing navigation
  const handleButtonClick = (e) => {
    e.preventDefault();

    if (validateForm()) {
      router.push("/VerifyEmail");
    }
  };

  return (
    <section className="w-full h-dvh flex flex-col justify-start mt-20 items-center">
      <div>
        <Image
          src={"/VacaGest.svg"}
          width={176}
          height={53}
          alt="VacaGest Logo"
        />
        <h2 className="text-5.5 font-semibold text-center">
          Créer votre compte
        </h2>
      </div>
      <p className="text-gray-600 text-xl mt-4">
        Demande d&apos;inscription pour les enseignants vacataires
      </p>

      <form onSubmit={handleSubmit} className="mt-10 w-[30vw]">
        <div className="flex flex-col gap-3 mb-4">
          <label className="font-semibold" htmlFor="Prénom">
            Informations personnelles
          </label>
          <div className="flex gap-2">
            <div className="w-full">
              <input
                type="text"
                required
                onChange={handleChange}
                value={FormData.fName || ""}
                className={`w-full outline-none border ${
                  errors.fName ? "border-red-500" : "border-black/20"
                } rounded-md bg-[#F3F5F7] h-11 px-4`}
                placeholder="Prénom"
                id="fName"
                name="fName"
              />
              {errors.fName && (
                <p className="text-red-500 text-sm mt-1">{errors.fName}</p>
              )}
            </div>
            <div className="w-full">
              <input
                type="text"
                required
                onChange={handleChange}
                value={FormData.lName || ""}
                className={`w-full outline-none border ${
                  errors.lName ? "border-red-500" : "border-black/20"
                } rounded-md bg-[#F3F5F7] h-11 px-4`}
                placeholder="Nom"
                id="lName"
                name="lName"
              />
              {errors.lName && (
                <p className="text-red-500 text-sm mt-1">{errors.lName}</p>
              )}
            </div>
          </div>

          <div>
            <UnivEmailValidate
              handleChange={handleChange}
              value={FormData.email || ""}
            />
          </div>

          <div>
            <input
              type="tel"
              required
              onChange={handleChange}
              value={FormData.phone || ""}
              className={`w-full outline-none border ${
                errors.phone ? "border-red-500" : "border-black/20"
              } rounded-md bg-[#F3F5F7] h-11 px-4`}
              placeholder="Entrez votre numéro de téléphone"
              id="phone"
              name="phone"
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <label className="font-semibold" htmlFor="Grade">
            Informations professionnelles
          </label>

          <div>
            <select
              id="grade"
              name="grade"
              required
              onChange={handleChange}
              value={FormData.grade || ""}
              className={`w-full outline-none border text-gray-500 ${
                errors.grade ? "border-red-500" : "border-black/20"
              } rounded-md bg-[#F3F5F7] h-11 px-3.5`}
              style={{
                appearance: "none",
                WebkitAppearance: "none",
                MozAppearance: "none",
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 16px center",
                backgroundSize: "16px",
                paddingRight: "44px",
              }}
            >
              <option value="">Grade</option>
              <option value="Grade 1">Grade 1</option>
              <option value="Grade 2">Grade 2</option>
              <option value="Grade 3">Grade 3</option>
              <option value="Grade 4">Grade 4</option>
            </select>
            {errors.grade && (
              <p className="text-red-500 text-sm mt-1">{errors.grade}</p>
            )}
          </div>

          <div>
            <input
              type="text"
              required
              onChange={handleChange}
              value={FormData.specialty || ""}
              name="specialty"
              className={`w-full outline-none border ${
                errors.specialty ? "border-red-500" : "border-black/20"
              } rounded-md bg-[#F3F5F7] h-11 px-4`}
              placeholder="Spécialité"
              id="specialty"
            />
            {errors.specialty && (
              <p className="text-red-500 text-sm mt-1">{errors.specialty}</p>
            )}
          </div>

          <div>
            <select
              id="statue"
              name="statue"
              onChange={handleChange}
              value={FormData.statue || ""}
              className={`w-full outline-none border text-gray-500 ${
                errors.statue ? "border-red-500" : "border-black/20"
              } rounded-md bg-[#F3F5F7] h-11 px-3.5`}
              style={{
                appearance: "none",
                WebkitAppearance: "none",
                MozAppearance: "none",
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 16px center",
                backgroundSize: "16px",
                paddingRight: "44px",
              }}
            >
              <option value="">Statut</option>
              <option value="interne">Interne</option>
              <option value="externe">Externe</option>
            </select>
            {errors.statue && (
              <p className="text-red-500 text-sm mt-1">{errors.statue}</p>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <label className="font-semibold mt-4" htmlFor="password">
            Informations du compte
          </label>
          <div>
            <input
              type="password"
              required
              onChange={handleChange}
              value={FormData.password || ""}
              name="password"
              className={`w-full outline-none border ${
                errors.password ? "border-red-500" : "border-black/20"
              } rounded-md bg-[#F3F5F7] h-11 px-4`}
              placeholder="Entrez votre mot de passe"
              id="password"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>
        </div>
 
        <button
          className="w-full mt-6 bg-primary rounded-md h-11 text-white font-semibold cursor-pointer hover:bg-primary/80 disabled:opacity-50 disabled:cursor-not-allowed"
          type="submit"
          onClick={handleButtonClick}
          disabled={Object.keys(errors).some((key) => errors[key])}
        >
          Créer un compte
        </button>
      </form>

      <p className="mt-8 text-[14px] pb-20 text-gray-600">
        Vous avez déjà un compte?{" "}
        <Link href="/Login" className="text-primary cursor-pointer">
          Se connecter
        </Link>
      </p>
    </section>
  );
}

export default SignUp;
