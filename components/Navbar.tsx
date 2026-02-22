"use client";
import { signOut } from "next-auth/react";
import Link from "next/link";

interface Props {
  user: { name?: string | null; email?: string | null; image?: string | null };
}

export default function Navbar({ user }: Props) {
  const initials = user.name?.charAt(0).toUpperCase() || "?";

  return (
    <header
      style={{
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        background: "rgba(8,8,18,0.9)",
        backdropFilter: "blur(20px)",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
    >
      <div
        style={{
          maxWidth: 1152,
          margin: "0 auto",
          padding: "0 16px",
          height: 52,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Link
          href="/dashboard"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            textDecoration: "none",
          }}
        >
          <div
            style={{
              width: 26,
              height: 26,
              background: "linear-gradient(135deg,#D4A853,#B8864A)",
              borderRadius: 6,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <span style={{ color: "#0f0f1a", fontSize: 13, fontWeight: 900 }}>
              L
            </span>
          </div>
          <span
            style={{
              fontFamily: "'Cormorant Garamond',Georgia,serif",
              fontSize: 18,
              color: "#f0e8d8",
              letterSpacing: "0.06em",
            }}
          >
            LEDGER
          </span>
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {user.image ? (
            <img
              src={user.image}
              alt=""
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                border: "1px solid rgba(212,168,83,0.3)",
                flexShrink: 0,
              }}
            />
          ) : (
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                background: "linear-gradient(135deg,#D4A853,#B8864A)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 12,
                fontWeight: 700,
                color: "#0f0f1a",
                flexShrink: 0,
              }}
            >
              {initials}
            </div>
          )}
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            style={{
              color: "#555",
              background: "none",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 8,
              cursor: "pointer",
              fontSize: 12,
              padding: "5px 10px",
              fontFamily: "inherit",
            }}
          >
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
}
