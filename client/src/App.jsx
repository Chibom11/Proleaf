import { useState } from 'react'
import {BrowserRouter,Route,Routes} from 'react-router-dom'
import LandingPage from '../components/LandingPage'
import {Toaster} from 'react-hot-toast'
import LoginUser from '../components/LoginUser'
import YTSummary from '../features/YTSummary'
import WelcomePage from '../components/WelcomePage'
import RegisterPage from '../components/RegisterPage'
import PdfUpload from '../features/PdfUpload'
import PdfSideBar from '../components/PdfSidebar'

function App() {
 

  return (
  <>
    <BrowserRouter>
      <Toaster/>
  
        <Routes>
          <Route path='/' element={<LandingPage/>}/>
          <Route path='/register' element={<RegisterPage/>}/>
           <Route path='/login' element={<LoginUser/>}/>
           <Route path='/welcome-page' element={<WelcomePage/>}/>
           <Route path='/summary' element={<YTSummary/>}/>
           
           <Route path='/pdf' element={<PdfSideBar/>}>
            <Route path='pdfuploads/:id' element={<PdfUpload/>}/>
           </Route>
          
        </Routes>
      
    </BrowserRouter>
  </>
  
  )
}

export default App
