import { redirect } from "next/navigation";
import { auth } from "@/auth";
import Sidebar from "@/components/layout/sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/sign-in");
  }

  return (
    <>
      <Sidebar />
      <main
        style={{
          marginTop: "56px",
          minHeight: "100vh",
          backgroundColor: "#0a0a0a",
          color: "#f5f5f5",
        }}
      >
        {children}
      </main>
    </>
  );
}
