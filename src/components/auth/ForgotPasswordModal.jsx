import { useState } from "react";
import api from "../../services/api";

const ForgotPasswordModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  // STEP 1 — Send OTP
  const handleSendOtp = async () => {
    setLoading(true);
    setMessage("");

    const res = await api.sendOtp(email);

    if (res.message === "OTP sent to your email") {
      setMessage("OTP sent successfully!");
      setStep(2);
    } else {
      setMessage(res.message || "Something went wrong");
    }

    setLoading(false);
  };

  // STEP 2 — Verify OTP
  const handleVerifyOtp = async () => {
    setLoading(true);
    setMessage("");

    const res = await api.verifyOtp(email, otp);

    if (res.message === "OTP verified") {
      setMessage("OTP verified!");
      setStep(3);
    } else {
      setMessage(res.message || "Invalid OTP");
    }

    setLoading(false);
  };

  // STEP 3 — Reset Password
  const handleResetPassword = async () => {
    setMessage("");

    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    const passRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!passRegex.test(newPassword)) {
      setMessage(
        "Password must contain 8+ chars, uppercase, lowercase, number & special character"
      );
      return;
    }

    setLoading(true);

    const res = await api.resetPassword(email, newPassword);

    if (res.message === "Password reset successful") {
      setMessage("Password updated successfully!");
      setTimeout(() => onClose(), 1500);
    } else {
      setMessage(res.message || "Something went wrong");
    }

    setLoading(false);
  };

  // RESET UI
  const handleClose = () => {
    setStep(1);
    setEmail("");
    setOtp("");
    setNewPassword("");
    setConfirmPassword("");
    setMessage("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md p-6 rounded-xl shadow-xl">
        <h2 className="text-2xl font-bold text-center mb-4">Forgot Password</h2>

        {message && (
          <p className="text-center text-red-500 text-sm mb-3">{message}</p>
        )}

        {/* STEP 1 — Email */}
        {step === 1 && (
          <>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              className="w-full border rounded-lg px-3 py-2 mb-4"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />

            <button
              onClick={handleSendOtp}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg cursor-pointer"
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </>
        )}

        {/* STEP 2 — OTP */}
        {step === 2 && (
          <>
            <label className="block text-sm font-medium mb-1">Enter OTP</label>
            <input
              type="text"
              maxLength="6"
              className="w-full border rounded-lg px-3 py-2 mb-4 text-center tracking-widest"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter 6-digit OTP"
            />

            <button
              onClick={handleVerifyOtp}
              disabled={loading}
              className="w-full bg-green-600 text-white py-2 rounded-lg cursor-pointer"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </>
        )}

        {/* STEP 3 — New Password */}
        {step === 3 && (
          <>
            <label className="block text-sm font-medium mb-1">
              New Password
            </label>
            <input
              type="password"
              className="w-full border rounded-lg px-3 py-2 mb-3"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
            />

            <label className="block text-sm font-medium mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              className="w-full border rounded-lg px-3 py-2 mb-4"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm password"
            />

            <button
              onClick={handleResetPassword}
              disabled={loading}
              className="w-full bg-purple-600 text-white py-2 rounded-lg cursor-pointer"
            >
              {loading ? "Updating..." : "Reset Password"}
            </button>
          </>
        )}

        <button
          className="w-full text-center text-gray-600 mt-4 text-sm underline cursor-pointer"
          onClick={handleClose}
        >
          Cancel & Close
        </button>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;

