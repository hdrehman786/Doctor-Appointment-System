import dermatologist from "../assets/Dermatologist.svg";
import gastronenterologist from "../assets/Gastroenterologist.svg"
import generalphysician from "../assets/General_physician.svg"
import gyneclogist from "../assets/Gynecologist.svg"
import neurologist from "../assets/Neurologist.svg"
import pediatrician from "../assets/Pediatricians.svg"
import { Link } from "react-router-dom";
import { useUser } from "../utils/usersystem";

const Hero = () => {

  const { data, isLoading, isError } = useUser();

  const doctorsList = [
    {
      name: "Dermatologist",
      image: dermatologist,
    },
    {
      name: "Gastroenterologist",
      image: gastronenterologist,
    },
    {
      name: "General physician",
      image: generalphysician,
    },
    {
      name: "Gynecologist",
      image: gyneclogist,
    },
    {
      name: "Neurologist",
      image: neurologist,
    },
    {
      name: "Pediatrician",
      image: pediatrician,
    },
  ];



  return (
    <div className="mt-3 w-full">
      <div className="flex flex-col-reverse lg:h-96 h-auto overflow-hidden rounded-lg bg-[#20B2AA] md:flex-row">

        <div className="flex w-full  h-96 flex-col justify-center p-8 text-center md:w-1/2 md:p-12 md:text-left">
          <h1 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            Book Appointment <br /> With Trusted Doctors
          </h1>
          <p className="mt-4 text-sm text-white sm:text-base">
            Simply browse through our list of healthcare professionals and book appointments seamlessly.
          </p>
          {
            data?.success ? (
              <Link to={"/alldoctors/All"} className="mt-6 self-center rounded-full bg-white px-6 py-2 text-black transition hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#20B2AA] md:self-start">
                Book Appointment
              </Link>
            ) : (
              <Link to={"/register"} className="mt-6 self-center rounded-full bg-white px-6 py-2 text-black transition hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#20B2AA] md:self-start">
                Create Account
              </Link>
            )
          }

        </div>

        <div className=" h-full w-full flex items-center justify-center md:h-auto md:w-1/2">
          <img
            className=" h-full object-contain object-bottom"
            src="https://res.cloudinary.com/dyjpecyav/image/upload/v1756206943/doctor_wali_image_wvd9np.png"
            alt="Doctor Profile"
          />
        </div>

      </div>

      <div className=" flex justify-center items-center my-20 flex-col">
        <div className=" flex justify-center items-center flex-col">
          <h1 className=" font-semibold text-3xl my-4 ">Find By Specialiy</h1>
          <p className=" text-center text-gray-700 font-medium">
            Simplify for specialists base on your specific health concerns and <br />
            prefrences.Our comprehensive listings make it easy to find the <br /> right doctor for you.
          </p>
        </div>
        <div className=" flex gap-6 mt-12 flex-wrap">
          {
            doctorsList.map((data, index) => (
              <Link to={`alldoctors/${data.name}`} key={index} className=" flex flex-col gap-2 mx-auto items-center justify-center">
                <img className=" h-25 w-25" src={data.image} alt={data.name} />
                <span className=" text-gray-700 text-sm">{data.name}</span>
              </Link>
            ))
          }
        </div>
      </div>
    </div>
  );
};

export default Hero;