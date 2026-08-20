import { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "../api/authApi";
import { useAppDispatch } from "../store/hooks";
import { showToast } from "../store/slices/uiSlice";

export function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetToken, setResetToken] = useState("");
  const dispatch = useAppDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await forgotPassword({ email });
      if (res.resetToken) {
        setResetToken(res.resetToken);
      }
      dispatch(showToast({ message: res.message, type: "success" }));
    } catch (err: any) {
      dispatch(showToast({ message: err.response?.data?.message || "Failed to process request", type: "error" }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 dark:bg-gray-900 transition-colors">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 border border-gray-100 dark:border-gray-700 space-y-6">
        
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mx-auto text-2xl shadow-inner">
            🔑
          </div>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white">Forgot Password?</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Enter your registered email address and we'll help you generate a secure reset token.
          </p>
        </div>

        {resetToken ? (
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl text-xs space-y-3">
            <span className="font-bold text-emerald-800 dark:text-emerald-300 block">
              ✅ Reset Token Ready
            </span>
            <p className="text-gray-600 dark:text-gray-300 font-mono bg-white dark:bg-gray-900 p-2.5 rounded-xl break-all">
              {resetToken}
            </p>
            <Link
              to={`/reset-password?token=${resetToken}`}
              className="block w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl text-center shadow-md"
            >
              Proceed to Reset Password →
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-2xl transition shadow-lg shadow-indigo-200 dark:shadow-none text-sm disabled:opacity-50"
            >
              {loading ? "Sending Instructions..." : "Send Reset Instructions"}
            </button>
          </form>
        )}

        <p className="text-center text-xs text-gray-500">
          Remember your password?{" "}
          <Link to="/login" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">
            Back to Sign In
          </Link>
        </p>

      </div>
    </div>
  );
}

export default ForgotPasswordPage;
