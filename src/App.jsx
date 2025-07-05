import { useState } from 'react'

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
import AdminHome from './pages/admin/AdminHome'
import EmailForm from './pages/sendMail'
import ChangePassword from './pages/user/ChangePassword'
import AdminMessageList from './pages/admin/AdminMessageList'
import ExamineeProfile from './pages/user/ExamineeProfile'
import SessionMgmt from './pages/admin/SessionMgmt'
import Branch from './pages/admin/Branch'
import SubjectModule from './pages/admin/SubjectModule'
import DeclareExam from './pages/admin/DeclareExam'

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
          <Route path='/email' element={<EmailForm/>}></Route>
          {/* admin Route */}
          <Route path='/adlogin' element={<AdminLogin/>}></Route>
          <Route path='/admin' element={<AdminDashboard/>}>
          <Route index element={<AdminHome/>}></Route>
            <Route path='session' element={<SessionMgmt/>}></Route>
            <Route path='branch' element={<Branch/>}></Route>
            <Route path='subject' element={<SubjectModule/>}></Route>
            <Route path='examini' element={<ExamineeModule/>}></Route>
            <Route path='question' element={<QuestionBankModule/>}></Route>
            <Route path='examination' element={<ExaminationModule/>}></Route>
            <Route path='reports' element={<ReportGenerationModule/>}></Route>
            <Route path='administrator' element={<AdministratorModule/>}></Route>
            <Route path='marks' element={<MarksUploadModule/>}></Route>
            <Route path='message' element={<AdminMessageList/>}></Route>
            <Route path='result' element={<DeclareExam/>}></Route>
          </Route>

          {/* student route */}
          <Route path='/student/' element={<Dashboard/>}>
            <Route index element={<StudentDashboard/>}></Route>
            <Route path='exam' element={<MyExam/>}></Route>
            <Route path='result' element={<MyResults/>}></Route>
            <Route path='change-password' element={<ChangePassword/>}></Route>
            <Route path="attempt" element={<AttemptExam />} />
            <Route path="profile" element={<ExamineeProfile />} />

          </Route>
        x
        </Routes>
      </Router>
    
    </>
  )
}

export default App
