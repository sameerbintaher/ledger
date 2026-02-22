"use client";
import { signOut } from "next-auth/react";
import Link from "next/link";

interface Props {
  user: { name?: string | null; email?: string | null; image?: string | null };
}

export default function Navbar({ user }: Props) {
  const initials = user.name?.charAt(0).toUpperCase() || "?";

  return (
    <header style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(8,8,18,0.85)", backdropFilter: "blur(20px)", position: "sticky", top: 0, zIndex: 50 }}>
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div style={{ width: 28, height: 28, background: "linear-gradient(135deg,#D4A853,#B8864A)", borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "#0f0f1a", fontSize: 14, fontWeight: 900 }}>L</span>
          </div>
          <span style={{ fontFamily: "'Cormorant Garamond',Georgia,serif", fontSize: 20, color: "#f0e8d8", letterSpacing: "0.06em" }}>LEDGER</span>
        </Link>

        <div className="flex items-center gap-4">
          <span className="text-sm hidden sm:block" style={{ color: "#444" }}>{user.email}</span>
          {user.image ? (
            <img src={user.image} alt="" className="w-7 h-7 rounded-full" style={{ border: "1px solid rgba(212,168,83,0.3)" }} />
          ) : (
            <div style={{ width: 30, height: 30, borderRadius: "50%", background: "linear-gradient(135deg,#D4A853,#B8864A)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#0f0f1a" }}>
              {initials}
            </div>
          )}
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="text-sm transition-colors"
            style={{ color: "#444", background: "none", border: "none", cursor: "pointer" }}
            onMouseEnter={e => (e.currentTarget.style.color = "#D4A853")}
            onMouseLeave={e => (e.currentTarget.style.color = "#444")}
          >
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
}
