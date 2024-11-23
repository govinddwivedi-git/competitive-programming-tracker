import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import FormSection from "./components/Signup/FormSection";
import TextSection from "./components/Signup/TextSection";
import Dashboard from "./components/Dashboard/Dashboard";
import bgImage from "./assets/images/bg-intro-desktop.png";
import HandleForm from "./components/Usernames/HandleForm";
import HandleText from "./components/Usernames/HandleText";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route
          path="/signup"
          element={
            <div className="flex justify-center items-center h-screen p-5 bg-red-500 bg-cover bg-center text-center text-white" style={{ backgroundImage: `url(${bgImage})` }}>
              <TextSection />
              <FormSection />
            </div>
          }
        />
        <Route
          path="/handle-form"
          element={
            <div className="flex justify-center items-center h-screen p-5 bg-pink-500 bg-cover bg-center text-center text-white" style={{ backgroundImage: `url(${bgImage})` }}>
              <HandleText />
              <HandleForm />
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
