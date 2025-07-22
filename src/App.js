import "./App.css";
import "animate.css";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./components/Header";
import SellerHeader from "./components/SellerHeader";
import Footer from "./components/Footer";
import { Toaster } from "react-hot-toast";
import { ContextProvider } from "./context";
import { UserProvider } from "./context/UserContext";
import { CartProvider } from "./context/CartContext";
import { SellerProvider } from "./context/SellerContext";

function App() {
  const location = useLocation();
  const isSellerPanel = location.pathname.includes("seller");
  const isAdminLogin = location.pathname === "/admin-login";

  return (
    <ContextProvider>
      <UserProvider>
        <CartProvider>
          <SellerProvider>
            <Toaster
              position="top-center"
              reverseOrder={false}
              containerStyle={{
                marginTop: "4rem",
                fontWeight: "500",
              }}
            />
            {!isAdminLogin && (isSellerPanel ? <SellerHeader /> : <Header />)}
            <main
              className={`${
                isAdminLogin
                  ? "min-h-screen"
                  : "min-h-[calc(100vh-120px)] pt-16 "
              }`}
            >
              <Outlet />
            </main>
            {/* <Footer /> */}
          </SellerProvider>
        </CartProvider>
      </UserProvider>
    </ContextProvider>
  );
}

export default App;
