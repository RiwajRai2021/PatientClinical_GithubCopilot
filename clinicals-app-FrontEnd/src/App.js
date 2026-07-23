import './App.css';
import { BrowserRouter } from 'react-router-dom';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Home from './Components/Home';
import AddPatient from './Components/AddPatient';
import AddClinicals from './Components/AddClinicals';
import AddPatientData from './Components/AddPatientData';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/addPatient" element={<AddPatient />} />
          <Route path="/addClinicals/:patientId" element={<AddClinicals />} />
          <Route path="/addclinicals/:patientId" element={<AddClinicals />} />
          <Route path="/addPatientData/:patientId" element={<AddPatientData />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default App;
