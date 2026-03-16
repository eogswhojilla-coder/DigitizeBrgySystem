// import React, { useState } from "react";
// import { Link } from "@inertiajs/react";

// export default function ForgotPasswordPage() {
//   const [email, setEmail] = useState("");
//   const [status, setStatus] = useState("");
//   const [errors, setErrors] = useState({});
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setStatus("");
//     setErrors({});
//     setLoading(true);
//     try {
//       const csrf = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
//       const response = await fetch("/auth/forgot-password", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "X-CSRF-TOKEN": csrf || "",
//         },
//         body: JSON.stringify({ email }),
//       });
//       const data = await response.json();
//       if (response.ok) {
//         setStatus("A password reset link has been sent to your email.");
//       } else if (data.errors) {
//         setErrors(data.errors);
//       } else {
//         setStatus(data.message || "Something went wrong.");
//       }
//     } catch (err) {
//       setStatus("Network error. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-900 via-blue-900 to-indigo-800 px-4">
//       <div className="w-full max-w-md bg-white/10 backdrop-blur-md rounded-2xl shadow-xl p-8">
//         <h2 className="text-2xl font-bold text-white mb-2 text-center">Forgot Password</h2>
//         <p className="text-sm text-indigo-100 mb-6 text-center">
//           Enter your email address and we'll send you a link to reset your password.
//         </p>
//         {status && (
//           <div className="mb-4 text-center text-green-300 font-medium">{status}</div>
//         )}
//         <form onSubmit={handleSubmit} className="space-y-5">
//           <div>
//             <label htmlFor="email" className="block text-indigo-100 text-sm font-semibold mb-1">
//               Email Address
//             </label>
//             <input
//               id="email"
//               type="email"
//               className={`w-full px-4 py-3 rounded-lg bg-white/20 text-white border ${errors.email ? "border-red-400" : "border-white/20"} focus:outline-none focus:ring-2 focus:ring-indigo-400`}
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//               autoFocus
//               autoComplete="email"
//               placeholder="your@email.com"
//             />
//             {errors.email && (
//               <p className="text-red-300 text-xs mt-1">{errors.email[0]}</p>
//             )}
//           </div>
//           <button
//             type="submit"
//             className="w-full py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition disabled:opacity-60"
//             disabled={loading}
//           >
//             {loading ? "Sending..." : "Send Reset Link"}
//           </button>
//         </form>
//         <div className="mt-6 text-center">
//           <Link href="/auth/login" className="text-indigo-200 hover:text-white text-sm font-medium">
//             Back to Login
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// }
