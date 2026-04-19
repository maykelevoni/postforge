import "@/app/globals.css";
import "@/app/(landing)/landing.css";

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-gray-950 text-base text-gray-200 antialiased" style={{ fontFamily: "'Nacelle', Inter, system-ui, sans-serif" }}>
      {children}
    </div>
  );
}
