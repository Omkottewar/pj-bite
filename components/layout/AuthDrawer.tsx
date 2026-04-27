"use client";

import { useState, useEffect } from "react";
import { 
  X, Mail, ArrowRight, ShieldCheck, 
  Leaf, Loader2, CheckCircle2 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { signIn } from "next-auth/react";
import Image from "next/image";

interface AuthDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthDrawer({ isOpen, onClose }: AuthDrawerProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Note: This matches your existing credentials provider logic
    // You can extend this to send a Magic Link or OTP if needed
    try {
      const res = await signIn("credentials", {
        email,
        password: "default_password_logic", // Placeholder if you use OTP-only
        redirect: false,
      });
      if (res?.ok) {
        setIsSuccess(true);
        setTimeout(() => {
          onClose();
          window.location.reload();
        }, 2000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />

          {/* Drawer Wrapper */}
          <div className="fixed inset-0 z-[101] flex items-end sm:items-center justify-center pointer-events-none">
            <motion.div
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="bg-white w-full max-w-lg rounded-t-[2.5rem] sm:rounded-[2.5rem] p-8 sm:p-10 pointer-events-auto shadow-2xl relative overflow-hidden"
            >
              {/* Close Button */}
              <button 
                onClick={onClose}
                className="absolute top-6 right-6 p-2.5 rounded-full bg-brand-bg hover:bg-brand-primary/10 text-brand-text-muted hover:text-brand-primary transition-all"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Success State */}
              <AnimatePresence mode="wait">
                {isSuccess ? (
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="py-12 text-center"
                  >
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle2 className="w-10 h-10 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-black text-brand-text mb-2">Welcome Back!</h2>
                    <p className="text-brand-text-muted font-medium">Logged in successfully. Refreshing site...</p>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-8"
                  >
                    {/* Header */}
                    <div className="text-center sm:text-left">
                      <div className="flex items-center justify-center sm:justify-start gap-2 text-brand-primary font-black text-xs uppercase tracking-widest mb-3">
                        <Leaf className="w-4 h-4" /> PJ BITE AUTHENTICATION
                      </div>
                      <h2 className="text-3xl font-black text-brand-text font-serif leading-tight">
                        Experience Freshness <br />
                        <span className="text-brand-primary">at Your Fingertips.</span>
                      </h2>
                    </div>

                    {/* Google Login (Dynamic) */}
                    <button
                      onClick={() => signIn("google")}
                      className="w-full h-14 bg-white border border-[#E8E6E1] rounded-2xl flex items-center justify-center gap-4 hover:bg-brand-bg transition-all premium-shadow group"
                    >
                      <div className="relative w-6 h-6">
                        <Image src="/google.png" alt="Google" fill className="object-contain" />
                      </div>
                      <span className="text-sm font-black text-brand-text uppercase tracking-widest">Continue with Google</span>
                    </button>

                    {/* Divider */}
                    <div className="relative py-4">
                      <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#E8E6E1]"></div></div>
                      <div className="relative flex justify-center text-xs font-black uppercase tracking-[0.2em]"><span className="bg-white px-4 text-brand-text-muted/50">OR EMAIL</span></div>
                    </div>

                    {/* Email Form */}
                    <form onSubmit={handleEmailLogin} className="space-y-4">
                      <div className="relative group">
                        <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-text-muted/50 group-focus-within:text-brand-primary transition-colors" />
                        <input 
                          type="email" 
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="your.email@example.com"
                          className="w-full pl-14 pr-6 py-4.5 bg-brand-bg/50 border border-[#E8E6E1] rounded-2xl text-sm font-bold focus:bg-white focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary outline-none transition-all placeholder:font-medium placeholder:text-brand-text-muted/40" 
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full h-14 bg-brand-primary hover:bg-[#164a20] text-white font-black text-sm rounded-2xl transition-all flex items-center justify-center gap-2.5 premium-shadow shadow-brand-primary/20 disabled:opacity-50 uppercase tracking-widest"
                      >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verify Identity"}
                        {!loading && <ArrowRight className="w-5 h-5" />}
                      </button>
                    </form>

                    {/* Security Badge */}
                    <p className="flex items-center justify-center gap-2 text-[10px] font-black text-brand-text-muted/60 uppercase tracking-widest border-t border-[#F0EDE8]/50 pt-8 mt-4">
                       <ShieldCheck className="w-4 h-4 text-brand-primary/50" /> 
                       Encrypted & Secure Login
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Decorative Element */}
              <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-brand-primary/5 blur-3xl rounded-full" />
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
