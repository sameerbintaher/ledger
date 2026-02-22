"use client";
import { Search, X } from "lucide-react";
import { CATEGORIES } from "@/lib/constants";

interface Props {
  search: string;
  onSearch: (v: string) => void;
  category: string;
  onCategory: (v: string) => void;
}

export default function SearchBar({ search, onSearch, category, onCategory }: Props) {
  return (
    <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
      {/* Search input */}
      <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
        <Search size={14} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#555" }} />
        <input
          type="text"
          value={search}
          onChange={e => onSearch(e.target.value)}
          placeholder="Search by title, tag, or note…"
          style={{
            width: "100%", paddingLeft: 38, paddingRight: search ? 36 : 14,
            paddingTop: 10, paddingBottom: 10,
            background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 10, color: "#f0e8d8", fontSize: 13, fontFamily: "inherit",
            boxSizing: "border-box",
          }}
          onFocus={e => e.target.style.borderColor = "rgba(212,168,83,0.4)"}
          onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.08)"}
        />
        {search && (
          <button onClick={() => onSearch("")} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#555", display: "flex" }}>
            <X size={14} />
          </button>
        )}
      </div>

      {/* Category filter */}
      <select
        value={category}
        onChange={e => onCategory(e.target.value)}
        style={{
          padding: "10px 14px", background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10,
          color: category === "all" ? "#555" : "#f0e8d8", fontSize: 13, fontFamily: "inherit",
        }}
      >
        <option value="all">All categories</option>
        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
      </select>
    </div>
  );
}
