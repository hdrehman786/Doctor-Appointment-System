import { Outlet } from "react-router-dom";
import Doctorslist from "./components/Doctorslist";
import Footer from "./components/Footer";
import Hero from "./components/HeroSection";
import Navbar from "./components/Navbar";
import { ToastContainer } from "react-toastify";
import { useMutation } from "@tanstack/react-query";
import { expireOutDate, setExpiredAppointments } from "./utils/usersystem";
import { useEffect } from "react";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

function App() {
  const expiredFunctionSet = useMutation(
    {
      mutationFn: setExpiredAppointments,
      onSuccess: (data) => {
      },
      onError: (error) => {
        console.error("Error updating expired appointments:", error);
      }
    }
  )

  const expireOutDatedFunction = useMutation({
    mutationFn:expireOutDate,
    onSuccess:(data)=>{
      console.log(data)
    },
    onError : (error)=>{
      console.log(error)
    }
  })



  useEffect(() => {
    expiredFunctionSet.mutate();
    expireOutDatedFunction.mutate();
  }, []);
  return (
    <div className="flex lg:container lg:mx-auto md:mx-auto md:container w-full p-2 flex-col px-8 ">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
      <ToastContainer />
      <ReactQueryDevtools initialIsOpen={false} />
    </div>
  );
}

export default App;