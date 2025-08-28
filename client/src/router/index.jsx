import { createBrowserRouter } from "react-router-dom";
import App from "../App.jsx";
import DoctorDetails from "../Pages/DoctorDetails.jsx";
import Home from "../Pages/Home.jsx";
import AllDoctors from "../Pages/AllDoctors.jsx";
import About from "../components/About.jsx";
import Contact from "../Pages/Contact.jsx";
import ProfileSection from "../Pages/Profilesection.jsx";
import Register from "../Pages/Register.jsx";
import Login from "../Pages/Login.jsx";
import MyAppointments from "../Pages/MyAppointments.jsx";
import AllApoointments from "../Pages/Admin/AllApoointments.jsx";
import AllListedDoctors from "../Pages/Admin/AllDoctors.jsx";
import AddDoctor from "../Pages/Admin/AddDoctor.jsx";
import DoctorAppointments from "../Pages/DoctorAppointments.jsx";
import Dashboard from "../Pages/Dashboard.jsx";
import MainDashboard from "../Pages/Admin/MainDashboard.jsx";
import DoctorTimeSlotManager from "../Pages/DoctorTimeSlotManager.jsx";



const router = createBrowserRouter([
    {
        path :"/",
        element :<App />,
        children:[
            {
            path:"",
            element:<Home />
            },
            {
                path :"doctordetails/:id",
                element : <DoctorDetails />
            },
            {
                path : "alldoctors/:id",
                element : <AllDoctors />
            },
            {
                path : "about-us",
                element : <About />
            },
            {
                path : "contact-us",
                element : <Contact />
            },
            {
                path : "my-profile",
                element : <ProfileSection />
            },
            {
                path : "register",
                element : <Register />
            },
            {
                path : 'login',
                element : <Login />
            },
            {
                path : "/myappointments",
                element : <MyAppointments />
            },
            {
                path : "/doctor-appointments",
                element : <DoctorAppointments />
            },
            {
                path : "/docotor-timeslots-manager",
                element : <DoctorTimeSlotManager />
            },
            {
                path : "/dashboard",
                element : <Dashboard />,
                children : [
                    {
                    path : "",
                    element : <MainDashboard />
                    },
                    {
                        path : "allmyappointments",
                        element : <AllApoointments />
                    },
                    {
                        path : "alldoctors",
                        element : <AllListedDoctors />
                    },
                    {
                        path : "adddoctor",
                        element : <AddDoctor />
                    }
                ]
            }
        ]
    }
])

export default router