"use client";

import { useEffect, useState, useRef, useContext, useCallback } from "react";
import { useRouter } from "next/navigation";
import { GLobalContext } from "@/app/AppContext/Context";
import FetchUser from "./FetchUser";

export default function OtpInput() {
  const { FormData, setFormData } = useContext(GLobalContext);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState("05:00");
  const [duration, setDuration] = useState(300);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [otpVerified, setOtpVerified] = useState(false);

  const inputRefs = useRef([]);
  const router = useRouter();
  const verificationAttemptsRef = useRef(0);
  const isVerifyingRef = useRef(false);

  useEffect(() => {
    if (localStorage.getItem("userData")) {
      window.location.href = "/Dashboard";
    }
  }, []);

  // Function to create user
  const createUser = async () => {
    try {
      const { fName, lName, email, phone, grade, specialty, statue, password } =
        FormData;

      const response = await fetch("https://vacagest.onrender.com/api/user/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fName,
          lName,
          email,
          phone: phone ? phone.toString() : "",
          grade: grade || "",
          specialty: specialty || "",
          statue: statue || "active",
          password,
          emailVerified: true,
        }),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  };

  // Auto send OTP on component mount
  useEffect(() => {
    if (FormData.email) {
      sendOtpOnMount();
    }
  }, [FormData.email]);

  // Timer countdown
  useEffect(() => {
    if (duration <= 0) {
      setIsResendDisabled(false);
      return;
    }

    const interval = setInterval(() => {
      setDuration((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsResendDisabled(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [duration]);

  // Update timer display
  useEffect(() => {
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    setTimer(
      `${minutes.toString().padStart(2, "0")}:${seconds
        .toString()
        .padStart(2, "0")}`
    );
  }, [duration]);

  // Auto-focus first input on mount
  useEffect(() => {
    setTimeout(() => {
      if (inputRefs.current[0]) {
        inputRefs.current[0].focus();
      }
    }, 500);
  }, []);

  // Auto-verification when all digits are filled
  useEffect(() => {
    const allFilled = otp.every((digit) => digit !== "");
    const otpString = otp.join("");

    if (
      allFilled &&
      otpString.length === 6 &&
      !isLoading &&
      !otpVerified &&
      !isVerifyingRef.current &&
      verificationAttemptsRef.current < 3
    ) {
      const verifyIfNotAlready = async () => {
        if (
          isVerifyingRef.current ||
          otpVerified ||
          verificationAttemptsRef.current >= 3
        ) {
          return;
        }

        isVerifyingRef.current = true;

        try {
          await handleVerify();
        } finally {
          setTimeout(() => {
            isVerifyingRef.current = false;
          }, 1000);
        }
      };

      const timeoutId = setTimeout(verifyIfNotAlready, 200);

      return () => clearTimeout(timeoutId);
    }
  }, [otp, isLoading, otpVerified]);

  // Send OTP on component mount
  const sendOtpOnMount = async () => {
    try {
      const response = await fetch("/api/otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: FormData.email,
          name: `${FormData.fName} ${FormData.lName}`,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({
          text: `Code de vérification envoyé à ${FormData.email}`,
          type: "success",
        });
      } else {
        setMessage({
          text: data.error || "Échec de l'envoi du code de vérification",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Failed to send OTP:", error);
    }
  };

  const handleChange = (index, value) => {
    if (/^[0-9]?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;

      setOtp(newOtp);

      if (value !== "" && index < 5) {
        setTimeout(() => {
          inputRefs.current[index + 1]?.focus();
        }, 50);
      }

      if (message.type === "error") {
        setMessage({ text: "", type: "" });
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      e.preventDefault();

      const newOtp = [...otp];

      if (newOtp[index] !== "") {
        newOtp[index] = "";
        setOtp(newOtp);
      } else if (index > 0) {
        newOtp[index - 1] = "";
        setOtp(newOtp);

        setTimeout(() => {
          inputRefs.current[index - 1]?.focus();
        }, 50);
      }
    }

    if (e.key === "Enter") {
      const allFilled = otp.every((digit) => digit !== "");
      if (allFilled) {
        handleVerify();
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData
      .getData("text/plain")
      .replace(/\s/g, "")
      .slice(0, 6);
    const pasteArray = pasteData.split("");

    if (pasteArray.every((char) => /^[0-9]$/.test(char))) {
      const newOtp = ["", "", "", "", "", ""];
      pasteArray.forEach((char, index) => {
        if (index < 6) {
          newOtp[index] = char;
        }
      });

      setOtp(newOtp);

      setTimeout(() => {
        const lastIndex = Math.min(pasteArray.length, 5);
        inputRefs.current[lastIndex]?.focus();
      }, 50);
    }
  };

  const handleVerify = useCallback(async () => {
    if (!FormData?.email) {
      setMessage({
        text: "Aucun email trouvé. Veuillez revenir à la page précédente.",
        type: "error",
      });
      return;
    }

    if (isVerifyingRef.current) {
      console.log("Already verifying, skipping...");
      return;
    }

    verificationAttemptsRef.current += 1;

    if (verificationAttemptsRef.current > 3) {
      console.log("Too many verification attempts, stopping");
      setMessage({
        text: "Trop de tentatives. Veuillez réessayer plus tard.",
        type: "error",
      });
      return;
    }

    const otpString = otp.join("");
    const enteredDigits = otp.filter((digit) => digit !== "").length;

    if (otpString.length !== 6) {
      setMessage({
        text: `Veuillez saisir les 6 chiffres (${enteredDigits}/6 saisis)`,
        type: "error",
      });
      return;
    }

    if (!otp.every((digit) => digit !== "")) {
      return;
    }

    isVerifyingRef.current = true;
    setIsLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const response = await fetch("/api/otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: FormData.email,
          otpWritten: otpString,
        }),
      });

      let data;
      try {
        data = await response.json();
        console.log("API Response:", data);
      } catch (jsonError) {
        console.error("Failed to parse JSON response:", jsonError);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        throw jsonError;
      }

      if (response.ok) {
        setMessage({
          text: "✓ Email vérifié avec succès!",
          type: "success",
        });
        setOtpVerified(true);

        // Update context
        setFormData((prev) => ({
          ...prev,
          emailVerified: true,
        }));


        
        // Create user after verification
        try {
          await createUser();
          const userData = await FetchUser({email: FormData.email});
          const user = userData.userData;
          localStorage.setItem(
            "userData",
            JSON.stringify({
              ...user,
              emailVerified: true,
            })
          );
          setTimeout(() => {
            router.push("/Dashboard");
          }, 2500);
        } catch (error) {
          console.error("Failed to create user:", error);
          setMessage({
            text: "Vérification réussie mais erreur lors de la création du compte.",
            type: "error",
          });
        }
      } else {
        setMessage({
          text:
            data.error || "Code de vérification invalide. Veuillez réessayer.",
          type: "error",
        });

        setOtp(["", "", "", "", "", ""]);
        setTimeout(() => {
          inputRefs.current[0]?.focus();
        }, 50);
      }
    } catch (error) {
      console.error("Verification error:", error);
      setMessage({
        text: "Erreur de connexion. Veuillez vérifier votre connexion et réessayer.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        isVerifyingRef.current = false;
      }, 500);
    }
  }, [otp, FormData, setFormData, router]);

  const handleResendOtp = async () => {
    if (isResendDisabled) return;

    setIsResendDisabled(true);
    setMessage({ text: "Envoi du nouveau code...", type: "info" });

    try {
      const response = await fetch("/api/otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: FormData.email,
          name: `${FormData.fName} ${FormData.lName}`,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setDuration(300);
        setIsResendDisabled(true);
        verificationAttemptsRef.current = 0;

        setMessage({
          text: "Nouveau code de vérification envoyé à votre email.",
          type: "success",
        });

        setOtp(["", "", "", "", "", ""]);
        setTimeout(() => {
          inputRefs.current[0]?.focus();
        }, 50);
      } else {
        setMessage({
          text: data.error || "Échec du renvoi du code. Veuillez réessayer.",
          type: "error",
        });
        setIsResendDisabled(false);
      }
    } catch (error) {
      setMessage({
        text: "Erreur réseau. Veuillez réessayer.",
        type: "error",
      });
      setIsResendDisabled(false);
    }
  };

  return (
    <div className="mt-8">
      <div className="w-full max-w-md mx-auto">
        <div className="space-y-8">
          {/* Email Display */}
          <div className="text-center mb-4">
            <p className="text-gray-600">
              Saisissez le code à 6 chiffres envoyé à
            </p>
            <p className="font-semibold text-blue-600 mt-1">{FormData.email}</p>
          </div>

          {/* OTP Input Boxes */}
          <div className="flex justify-center gap-3">
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={otp[index]}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className={`w-14 h-14 text-2xl text-center border-2 rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${otpVerified
                  ? "border-green-500 bg-green-50 text-green-700"
                  : otp[index]
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300 hover:border-gray-400"
                  } ${isLoading ? "opacity-50" : ""}`}
                maxLength={1}
                disabled={isLoading || otpVerified}
                autoComplete="one-time-code"
              />
            ))}
          </div>

          {/* Message Display */}
          {message.text && (
            <div
              className={`text-center p-3 rounded-lg ${message.type === "error"
                ? "bg-red-50 text-red-700 border border-red-200"
                : message.type === "success"
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-blue-50 text-blue-700 border border-blue-200"
                }`}
            >
              <div className="flex items-center justify-center gap-2">
                {message.type === "success" && (
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
                {message.text}
              </div>
            </div>
          )}

          {/* Timer and Resend Section */}
          <div className="flex items-center justify-between">
            <div className="text-gray-600">
              {duration > 0 ? (
                <span>
                  Expire dans{" "}
                  <span className="font-semibold text-blue-600">{timer}</span>
                </span>
              ) : (
                <span className="text-red-500 font-medium">Code expiré</span>
              )}
            </div>

            <button
              onClick={handleResendOtp}
              disabled={
                isResendDisabled || duration > 0 || isLoading || otpVerified
              }
              className="text-blue-600 hover:text-blue-800 font-medium disabled:text-gray-400 disabled:cursor-not-allowed transition-colors text-sm"
            >
              Renvoyer le code
            </button>
          </div>

          {/* Manual Verify Button */}
          <button
            onClick={handleVerify}
            disabled={
              isLoading ||
              otpVerified ||
              otp.filter((digit) => digit !== "").length !== 6
            }
            className={`w-full py-3 text-white font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center shadow-md ${isLoading || otpVerified
              ? "bg-gradient-to-r from-blue-700 to-blue-800"
              : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
              } ${otp.filter((digit) => digit !== "").length !== 6
                ? "opacity-50 cursor-not-allowed"
                : ""
              }`}
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Vérification en cours...
              </>
            ) : otpVerified ? (
              <>
                <svg
                  className="w-5 h-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Vérifié avec succès
              </>
            ) : (
              <>
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Vérifier l'e-mail
              </>
            )}
          </button>

          {/* Change Email Option */}
          {!otpVerified && (
            <div className="text-center">
              <button
                onClick={() => router.back()}
                className="text-gray-600 hover:text-gray-800 text-sm"
              >
                ← Utiliser une autre adresse e-mail
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
