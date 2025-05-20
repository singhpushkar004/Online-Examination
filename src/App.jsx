import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter as Router, Routes , Route } from 'react-router'
import Home from './pages/Home'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import SignUpPage from './pages/SignUpPage'
import LoginPage from './pages/LoginPage'
import AdminDashboard from './pages/admin/AdminDashboard'
import ExamineeModule from './pages/admin/ExamineeModule'
import QuestionBankModule from './pages/admin/QuestionBankModule'
import ExaminationModule from './pages/admin/ExaminationModule'
import ReportGenerationModule from './pages/admin/ReportGenerationModule'
import AdministratorModule from './pages/admin/AdministratorModule '
import MarksUploadModule from './pages/admin/MarksUploadModule'
import StudentDashboard from './pages/user/StudentDashboard'
import Dashboard from './pages/user/Dashboard'
import MyExam from './pages/user/MyExam'
import MyResults from './pages/user/MyResults'
import DummyExam from './pages/user/DummyExam'
import AttemptExam from './pages/user/AttemptExam'
import AdminLogin from './pages/admin/AdminLogin'

function App() {
 
  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<Home/>}></Route>
          <Route path='/about' element={<AboutPage/>}></Route>
          <Route path='/contact' element={<ContactPage/>}></Route>
          <Route path='/signup' element={<SignUpPage/>}></Route>
          <Route path='/login' element={<LoginPage/>}></Route>
          {/* admin Route */}
          <Route path='/adlogin' element={<AdminLogin/>}></Route>
          <Route path='/admin' element={<AdminDashboard/>}>
            <Route path='examini' element={<ExamineeModule/>}></Route>
            <Route path='question' element={<QuestionBankModule/>}></Route>
            <Route path='examination' element={<ExaminationModule/>}></Route>
            <Route path='reports' element={<ReportGenerationModule/>}></Route>
            <Route path='administrator' element={<AdministratorModule/>}></Route>
            <Route path='marks' element={<MarksUploadModule/>}></Route>
          </Route>

          {/* student route */}
          <Route path='/student/' element={<Dashboard/>}>
            <Route index element={<StudentDashboard/>}></Route>
            <Route path='exam' element={<MyExam/>}></Route>
            <Route path='result' element={<MyResults/>}></Route>
            {/* <Route path='attempt' element={<DummyExam/>}></Route> */}
            <Route path="attempt" element={<AttemptExam />} />
          </Route>
        x
        </Routes>
      </Router>
    
    </>
  )
}

export default App
