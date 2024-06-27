import Header from "@/components/shared/Header";

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <main className="min-h-screen container">
        <Header />
        {children}
      </main>
      <div className="p-10 text-center bg-gray-800 mt-10">
        Made with 💗 by Talha Ghaui
      </div>
    </div>
  );
};

export default AppLayout;
