import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header from "../components/Header/Header";
import Routers from "../routes/Routers";
import Footer from "../components/Footer/Footer";

const Layout = () => {
  const { pathname } = useLocation();

  // Start every new page at the top instead of keeping the old scroll position
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main key={pathname} className="flex-1 animate-page-in">
        <Routers />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
