import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./App.css";

import Student from "./component/Student";
import Select from "./component/Select";
import Result from "./component/Result";

function App() {

  const [students, setStudents] = useState([]);

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedSem, setSelectedSem] = useState(null);


  return (

    <BrowserRouter>

      <Routes>
        <Route
          path="/"
          element={
            <Student
              students={students}
              setStudents={setStudents}
            />
          }
        />

        <Route
          path="/select"
          element={
            <Select
              students={students}
              setSelectedStudent={setSelectedStudent}
              setSelectedSem={setSelectedSem}
            />
          }
        />

        <Route
          path="/result"
          element={
            <Result
              selectedStudent={selectedStudent}
              selectedSem={selectedSem}
            />
          }
        />

      </Routes>

    </BrowserRouter>

  );
}

export default App;