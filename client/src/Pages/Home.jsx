
 
import React from 'react'
import Hero from '../components/HeroSection'
import DoctorsList from '../components/Doctorslist'
import { useUser } from '../utils/usersystem';

const Home = () => {
  const { data, isLoading, isError } = useUser();
  return (
    <div>
        <Hero />
        <DoctorsList />
    </div>
  )
}

export default Home