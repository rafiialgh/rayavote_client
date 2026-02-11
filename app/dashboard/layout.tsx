import Navbar from "./Navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />

      <div className="mx-4 md:mx-10">
        {children}
      </div>
    </>
  );
}
