import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Select({
  students,
  setSelectedStudent,
  setSelectedSem
}) {

  const navigate = useNavigate();

  const [sapid, setSapid] = useState("");
  const [sem, setSem] = useState("");


  const selectedStudent = students.find(
    (student) =>
      student.sapid === sapid
  );


  function showResult() {

    if (
      sapid === "" ||
      sem === "" ||
      !selectedStudent
    ) {
      return;
    }


    const semester =
      selectedStudent.semesters.find(
        (semester) =>
          semester.sem === Number(sem)
      );


    if (!semester) {
      return;
    }


    setSelectedStudent(selectedStudent);

    setSelectedSem(semester);

    navigate("/result");

  }


  return (

    <div className="form">

      <h1>Select Result</h1>


      <label>SAP ID : </label>

      <select
        value={sapid}
        onChange={(e) => {

          setSapid(e.target.value);

          setSem("");

        }}
      >

        <option value="">
          Select Student
        </option>


        {students.map(
          (student, index) => (

            <option
              key={index}
              value={student.sapid}
            >

              {student.name} - {student.sapid}

            </option>

          )
        )}

      </select>


      <br />
      <br />


      <label>Semester : </label>

      <select
        value={sem}
        onChange={(e) =>
          setSem(e.target.value)
        }
      >

        <option value="">
          Select Semester
        </option>


        {selectedStudent &&
          selectedStudent.semesters.map(
            (semester, index) => (

              <option
                key={index}
                value={semester.sem}
              >

                Semester {semester.sem}

              </option>

            )
          )
        }

      </select>


      <br />
      <br />


      <button onClick={showResult}>
        Show Result
      </button>

    </div>

  );

}

export default Select;