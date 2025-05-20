import React from 'react'
import Header from '../components/Header'
import AboutSection from '../components/AboutSection'
import ModulesSection from '../components/ModulesSection'
import ProblemSolutionSection from '../components/ProblemSolutionSection'
import BenefitsSection from '../components/BenefitsSection'
import TechStackSection from '../components/TechStackSection'
import Footer from '../components/Footer'

const Home = () => {
  return (
    <>
        <Header/>
        <AboutSection/>
        <ModulesSection/>
        <BenefitsSection/>
        <ProblemSolutionSection/>
        <TechStackSection/>
        <Footer/>
    </>
  )
}

export default Home