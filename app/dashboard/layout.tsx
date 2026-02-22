import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  return (
    <div style={{ minHeight: "100vh", background: "#080812" }}>
      <Navbar user={session.user} />
      <main
        style={{ maxWidth: 1152, margin: "0 auto", padding: "20px 16px 40px" }}
      >
        {children}
      </main>
    </div>
  );
}
