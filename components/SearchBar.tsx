"use client";
import { Search, X } from "lucide-react";
import { CATEGORIES } from "@/lib/constants";

interface Props {
  search: string;
  onSearch: (v: string) => void;
  category: string;
  onCategory: (v: string) => void;
}

export default function SearchBar({
  search,
  onSearch,
  category,
  onCategory,
}: Props) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        marginBottom: 16,
      }}
    >
      {/* Search input - full width */}
      <div style={{ position: "relative" }}>
        <Search
          size={14}
          style={{
            position: "absolute",
            left: 13,
            top: "50%",
            transform: "translateY(-50%)",
            color: "#555",
          }}
        />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search expenses…"
          style={{
            width: "100%",
            paddingLeft: 36,
            paddingRight: search ? 36 : 14,
            paddingTop: 11,
            paddingBottom: 11,
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 10,
            color: "#f0e8d8",
            fontFamily: "inherit",
            boxSizing: "border-box",
          }}
          onFocus={(e) => (e.target.style.borderColor = "rgba(212,168,83,0.4)")}
          onBlur={(e) =>
            (e.target.style.borderColor = "rgba(255,255,255,0.08)")
          }
        />
        {search && (
          <button
            onClick={() => onSearch("")}
            style={{
              position: "absolute",
              right: 10,
              top: "50%",
              transform: "translateY(-50%)",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#555",
              display: "flex",
            }}
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Category filter - full width */}
      <select
        value={category}
        onChange={(e) => onCategory(e.target.value)}
        style={{
          width: "100%",
          padding: "11px 14px",
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 10,
          color: category === "all" ? "#555" : "#f0e8d8",
          fontFamily: "inherit",
          boxSizing: "border-box",
        }}
      >
        <option value="all">All categories</option>
        {CATEGORIES.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
    </div>
  );
}
