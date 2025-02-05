import Navbar from "./Navbar";

// app/dashboard/layout.tsx
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />

      {/* Konten utama */}
      <div className="pt-40 mx-4 md:mx-10">
        {children}
      </div>
    </>
  );
}
