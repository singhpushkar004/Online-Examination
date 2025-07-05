import React from 'react';

import { Container } from 'react-bootstrap';
import Header from '../components/Header';
import Footer from '../components/Footer';

const AboutPage = () => {
  return (
   <>
   <Header/>
         <div className="about-page py-5 text-white">
      <Container>
        <h1 className="mb-4 text-center animate__animated animate__fadeInDown">About ExamPrep Project</h1>
        <p className="lead animate__animated animate__fadeInUp">
          The ExamPrep System is a web-based application developed to streamline and digitize the examination process for universities and academic institutions. It automates the entire examination lifecycle — from student registration, question management, exam conduction, to report generation.
        </p>

       
       <div className="row mt-5">
        
        <div className="col-sm-6">
           <h3 className="">Project Objectives</h3>
           <ul>
          <li>Conduct internet-based examinations efficiently.</li>
          <li>Maintain accurate student marks and examination data.</li>
          <li>Generate real-time and scheduled reports by center and date.</li>
          <li>Minimize supervision effort and cost for examinations.</li>
          <li>Ensure fast access to results and data insights.</li>
        </ul>
        </div>
        <div className="col-sm-6">
           <h3 className="">Client</h3>
        <p>
          <strong>SoftPro India Computer Technologies Pvt. Ltd</strong><br />
          Kapoorthala, Lucknow
        </p>
        </div>
       </div>
      <div className="row">
        <div className="col-sm-6">
          <h3 className="mt-5">Technologies Used</h3>
        <ul>
          <li><strong>Frontend:</strong> React.js, Bootstrap, HTML5, CSS3</li>
          <li><strong>Backend:</strong> Node.js with Express</li>
          <li><strong>Database:</strong> MongoDB</li>
          <li><strong>IDE:</strong> VS Code</li>
        </ul>
        </div>
        <div className="col-sm-6">
          <h3 className="mt-5">Future Scope</h3>
        <p>
          The ExamPrep system has great potential for future enhancements, such as adaptive testing, AI-based evaluation, multimedia integration, LMS integration, advanced analytics, and real-time monitoring for remote proctoring.
        </p>
        </div>
      </div>

        
      </Container>
    </div>
    <Footer/>
   </>
  );
};

export default AboutPage;
