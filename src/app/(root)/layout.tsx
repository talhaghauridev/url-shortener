import Footer from "@/components/shared/Footer";
import Header from "@/components/shared/Header";

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <main className="min-h-screen">
        <Header />
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default AppLayout;
