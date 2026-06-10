import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <div className="flex-1 pt-16">{children}</div>
      <Footer />
    </>
  );
}
