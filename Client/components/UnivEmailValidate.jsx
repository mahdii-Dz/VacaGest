"use client";
import React, { useState, useEffect } from "react";

const UnivEmailValidate = ({
  handleChange,
  name = "email",
  value = "",
}) => {
  const [email, setEmail] = useState(value);
  const [error, setError] = useState("");

  // Regex for @univ-boumerde.dz emails
  const univEmailRegex = /^[a-zA-Z0-9._%+-]+@univ-boumerdes\.dz$/;

  const validateEmail = (value) => {
    setEmail(value);

    if (!value) {
      setError("Email is required");
    } else if (!univEmailRegex.test(value)) {
      setError("Email must be a valid @univ-boumerdes.dz email address");
    } else {
      setError("");
    }

    const syntheticEvent = {
      target: {
        name: name,
        value: value,
      },
    };

    if (handleChange) {
      handleChange(syntheticEvent);
    }
  };


  const handleInputChange = (e) => {
    validateEmail(e.target.value);
  };

  return (
    <>
      <input
        type="text"
        name={name}
        value={email}
        className={`w-full outline-none border rounded-md bg-[#F3F5F7] h-11 px-4 ${
          error ? "border-red-500" : "border-black/20"
        }`}
        placeholder="Entrez votre adresse e-mail"
        onChange={handleInputChange}
        id="email"
      />
      {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
      {!error && email && univEmailRegex.test(email) && (
        <p className="text-sm text-green-600 mt-1">✓ Valid university email</p>
      )}
    </>
  );
};

export default UnivEmailValidate;
