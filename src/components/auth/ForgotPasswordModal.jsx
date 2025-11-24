import { useState } from "react";

const ForgotPasswordModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1); // 1: email → 2: otp → 3: reset password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  // ------------------- API FUNCTIONS ----------------------

  // STEP 1: Send OTP
  const handleSendOtp = async () => {
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/auth/forgot-password/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      setMessage("OTP sent successfully!");
      setStep(2);

    } catch (err) {
      setMessage(err.message);
    }

    setLoading(false);
  };

  // STEP 2: Verify OTP
  const handleVerifyOtp = async () => {
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/auth/forgot-password/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      setMessage("OTP verified!");
      setStep(3);

    } catch (err) {
      setMessage(err.message);
    }

    setLoading(false);
  };

  // STEP 3: Reset Password
  const handleResetPassword = async () => {
    setMessage("");

    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    // Password validation
    const passRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!passRegex.test(newPassword)) {
      setMessage(
        "Password must contain 8+ chars, uppercase, lowercase, number & special character"
      );
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      setMessage("Password reset successful! Redirecting...");
      setTimeout(() => onClose(), 1500);

    } catch (err) {
      setMessage(err.message);
    }

    setLoading(false);
  };

  // Close & reset all state
  const handleClose = () => {
    setStep(1);
    setEmail("");
    setOtp("");
    setNewPassword("");
    setConfirmPassword("");
    setMessage("");
    onClose();
  };

  // --------------------- UI -------------------------
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md p-6 rounded-xl shadow-xl animate-fadeIn">
        <h2 className="text-2xl font-bold text-center mb-4">
          Forgot Password
        </h2>

        {message && (
          <p className="text-center text-red-500 text-sm mb-2">{message}</p>
        )}

        {/* STEP 1 — Enter Email */}
        {step === 1 && (
          <>
            <label className="block text-sm mb-1 font-medium">Email</label>
            <input
              type="email"
              className="w-full border rounded-lg px-3 py-2 mb-4"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your registered email"
            />

            <button
              onClick={handleSendOtp}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </>
        )}

        {/* STEP 2 — Enter OTP */}
        {step === 2 && (
          <>
            <label className="block text-sm mb-1 font-medium">Enter OTP</label>
            <input
              type="text"
              maxLength="6"
              className="w-full border rounded-lg px-3 py-2 mb-4 tracking-widest text-center"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="6-digit OTP"
            />

            <button
              onClick={handleVerifyOtp}
              disabled={loading}
              className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </>
        )}

        {/* STEP 3 — Reset Password */}
        {step === 3 && (
          <>
            <label className="block text-sm mb-1 font-medium">
              New Password
            </label>
            <input
              type="password"
              className="w-full border rounded-lg px-3 py-2 mb-3"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
            />

            <label className="block text-sm mb-1 font-medium">
              Confirm Password
            </label>
            <input
              type="password"
              className="w-full border rounded-lg px-3 py-2 mb-4"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
            />

            <button
              onClick={handleResetPassword}
              disabled={loading}
              className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700"
            >
              {loading ? "Updating..." : "Reset Password"}
            </button>
          </>
        )}

        {/* FOOTER */}
        <button
          className="w-full text-center text-gray-600 mt-4 text-sm underline"
          onClick={handleClose}
        >
          Cancel & Close
        </button>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;
