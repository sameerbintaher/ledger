"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import Link from "next/link";

function VerifyContent() {
  const params = useSearchParams();
  const token = params.get("token");
  const success = params.get("success");
  const error = params.get("error");

  const [status, setStatus] = useState<"loading" | "success" | "error" | "pending">("pending");

  useEffect(() => {
    // Came back from API redirect with ?success=true
    if (success === "true") {
      setStatus("success");
      return;
    }
    // Came back from API redirect with ?error=...
    if (error) {
      setStatus("error");
      return;
    }
    // Has a token in URL — redirect to the API route which will verify + redirect back
    if (token) {
      setStatus("loading");
      window.location.href = `/api/verify-email?token=${token}`;
      return;
    }
    // No token, no result — freshly landed after registration
    setStatus("pending");
  }, [token, success, error]);

  const states = {
    pending: {
      icon: "✉️",
      iconBg: "rgba(212,168,83,0.1)",
      iconBorder: "rgba(212,168,83,0.3)",
      iconColor: "#D4A853",
      title: "Check your email",
      message: "We sent a verification link to your email address. Click it to activate your account.",
      sub: "Didn't receive it? Check your spam folder.",
      action: null,
    },
    loading: {
      icon: "⏳",
      iconBg: "rgba(212,168,83,0.1)",
      iconBorder: "rgba(212,168,83,0.3)",
      iconColor: "#D4A853",
      title: "Verifying…",
      message: "Please wait while we verify your email address.",
      sub: "",
      action: null,
    },
    success: {
      icon: "✓",
      iconBg: "rgba(107,201,160,0.1)",
      iconBorder: "rgba(107,201,160,0.3)",
      iconColor: "#6BC9A0",
      title: "Email verified!",
      message: "Your account is now active. You can sign in to Ledger.",
      sub: "",
      action: { label: "SIGN IN", href: "/login" },
    },
    error: {
      icon: "✕",
      iconBg: "rgba(224,112,112,0.1)",
      iconBorder: "rgba(224,112,112,0.3)",
      iconColor: "#E07070",
      title: "Link expired or invalid",
      message: "This verification link is no longer valid. Please register again or request a new link.",
      sub: "",
      action: { label: "REGISTER AGAIN", href: "/register" },
    },
  };

  const s = states[status];

  return (
    <div style={{ minHeight: "100vh", background: "#080812", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: "-20%", right: "-10%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle,rgba(212,168,83,0.07) 0%,transparent 70%)", pointerEvents: "none" }} />

      <div style={{ width: "100%", maxWidth: 400, position: "relative", textAlign: "center" }}>
        {/* Logo */}
        <div style={{ marginBottom: 36 }}>
          <div style={{ width: 40, height: 40, background: "linear-gradient(135deg,#D4A853,#B8864A)", borderRadius: 10, display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
            <span style={{ color: "#0f0f1a", fontSize: 20, fontWeight: 900 }}>L</span>
          </div>
          <div style={{ fontFamily: "Georgia,serif", fontSize: 22, color: "#f0e8d8", letterSpacing: "0.06em" }}>LEDGER</div>
        </div>

        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, overflow: "hidden", boxShadow: "0 40px 80px rgba(0,0,0,0.4)" }}>
          <div style={{ height: 1, background: "linear-gradient(90deg,transparent,#D4A853,transparent)" }} />
          <div style={{ padding: "40px 32px" }}>
            {/* Icon */}
            <div style={{
              width: 64, height: 64, borderRadius: "50%", margin: "0 auto 24px",
              background: s.iconBg, border: `1px solid ${s.iconBorder}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 26, color: s.iconColor,
            }}>
              {s.icon}
            </div>

            <h2 style={{ fontFamily: "Georgia,serif", fontSize: 24, color: "#f0e8d8", margin: "0 0 12px", fontWeight: 400 }}>
              {s.title}
            </h2>
            <p style={{ color: "#888", fontSize: 14, lineHeight: 1.6, margin: "0 0 8px" }}>
              {s.message}
            </p>
            {s.sub && (
              <p style={{ color: "#555", fontSize: 12, margin: "0 0 24px" }}>{s.sub}</p>
            )}

            {s.action && (
              <Link href={s.action.href} style={{
                display: "inline-block", marginTop: 24,
                background: "linear-gradient(135deg,#D4A853,#B8864A)",
                color: "#0f0f1a", textDecoration: "none",
                fontWeight: 700, fontSize: 13, letterSpacing: "0.06em",
                padding: "13px 32px", borderRadius: 10,
              }}>
                {s.action.label}
              </Link>
            )}

            {status === "pending" && (
              <Link href="/login" style={{ display: "block", marginTop: 24, fontSize: 13, color: "#555", textDecoration: "none" }}>
                Back to sign in
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense>
      <VerifyContent />
    </Suspense>
  );
}
