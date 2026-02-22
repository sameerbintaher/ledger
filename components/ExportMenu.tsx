"use client";
import { useState, useRef, useEffect } from "react";
import { Download, ChevronDown } from "lucide-react";
import { Expense } from "@/app/dashboard/page";
import { format } from "date-fns";

interface Props {
  expenses: Expense[];
  month: string;
}

export default function ExportMenu({ expenses, month }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function exportCSV() {
    const rows = [
      ["Date", "Title", "Category", "Amount", "Tags", "Notes", "Recurrence"],
      ...expenses.map((e) => [
        format(new Date(e.date), "yyyy-MM-dd"),
        e.title,
        e.category,
        e.amount.toFixed(2),
        e.tags.join(";"),
        e.notes || "",
        e.recurrence || "none",
      ]),
    ];
    const csv = rows
      .map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ledger-${month}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setOpen(false);
  }

  async function exportPDF() {
    const { default: jsPDF } = await import("jspdf");
    const { default: autoTable } = await import("jspdf-autotable");
    const doc = new jsPDF();
    const total = expenses.reduce((s, e) => s + e.amount, 0);

    doc.setFillColor(8, 8, 18);
    doc.rect(0, 0, 210, 297, "F");
    doc.setTextColor(212, 168, 83);
    doc.setFontSize(22);
    doc.text("LEDGER", 14, 20);
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text(`Expense Report — ${month}`, 14, 30);
    doc.text(
      `Total: $${total.toFixed(2)} · ${expenses.length} transactions`,
      14,
      38
    );

    autoTable(doc, {
      startY: 46,
      head: [["Date", "Title", "Category", "Amount", "Tags"]],
      body: expenses.map((e) => [
        format(new Date(e.date), "MMM d, yyyy"),
        e.title,
        e.category,
        `$${e.amount.toFixed(2)}`,
        e.tags.join(", "),
      ]),
      styles: {
        fillColor: [15, 15, 26],
        textColor: [200, 192, 180],
        fontSize: 9,
      },
      headStyles: {
        fillColor: [22, 22, 40],
        textColor: [212, 168, 83],
        fontStyle: "bold",
      },
      alternateRowStyles: { fillColor: [12, 12, 22] },
      theme: "grid",
    });

    doc.save(`ledger-${month}.pdf`);
    setOpen(false);
  }

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 5,
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 10,
          padding: "8px 12px",
          cursor: "pointer",
          color: "#888",
          fontSize: 13,
          fontFamily: "inherit",
        }}
      >
        <Download size={14} />
        <span>Export</span>
        <ChevronDown
          size={12}
          style={{
            transform: open ? "rotate(180deg)" : "none",
            transition: "0.2s",
          }}
        />
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            right: 0,
            zIndex: 100,
            background: "#161628",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 12,
            overflow: "hidden",
            minWidth: 150,
            boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
          }}
        >
          {[
            { label: "Export as CSV", fn: exportCSV },
            { label: "Export as PDF", fn: exportPDF },
          ].map((item) => (
            <button
              key={item.label}
              onClick={item.fn}
              style={{
                display: "block",
                width: "100%",
                padding: "13px 16px",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#c8c0b4",
                fontSize: 13,
                fontFamily: "inherit",
                textAlign: "left",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "rgba(212,168,83,0.08)")
              }
              onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
