import { Outlet } from "react-router-dom";
import Doctorslist from "./components/Doctorslist";
import Footer from "./components/Footer";
import Hero from "./components/HeroSection";
import Navbar from "./components/Navbar";
import { ToastContainer } from "react-toastify";

function App() {

  return (
    <div className="flex lg:container lg:mx-auto md:mx-auto md:container w-full p-2 flex-col px-8 ">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
      <ToastContainer />
    </div>
  );
}

export default App;