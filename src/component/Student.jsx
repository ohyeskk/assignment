import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Student({ students, setStudents }) {

  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [sapid, setSapid] = useState("");
  const [rollNo, setRollNo] = useState("");

  const [sem, setSem] = useState("");
  const [subject, setSubject] = useState("");
  const [credit, setCredit] = useState("");
  const [internal, setInternal] = useState("");
  const [external, setExternal] = useState("");

  const [semesters, setSemesters] = useState([]);


  function addSubject() {

    if (
      sem === "" ||
      subject === "" ||
      credit === "" ||
      internal === "" ||
      external === ""
    ) {
      return;
    }

    const newSubject = {
      name: subject,
      credit: Number(credit),
      internal: Number(internal),
      external: Number(external)
    };


    const semesterExists = semesters.find(
      (semester) =>
        semester.sem === Number(sem)
    );


    if (semesterExists) {

      const updatedSemesters =
        semesters.map((semester) => {

          if (semester.sem === Number(sem)) {

            return {
              ...semester,

              subjects: [
                ...semester.subjects,
                newSubject
              ]
            };

          }

          return semester;

        });

      setSemesters(updatedSemesters);

    }

    else {

      const newSemester = {
        sem: Number(sem),

        subjects: [
          newSubject
        ]
      };

      setSemesters([
        ...semesters,
        newSemester
      ]);

    }


    setSubject("");
    setCredit("");
    setInternal("");
    setExternal("");

  }


  function addMoreStudent() {

    if (
      name === "" ||
      sapid === "" ||
      rollNo === ""
    ) {
      return;
    }


    const newStudent = {

      name: name,
      sapid: sapid,
      rollNo: rollNo,
      semesters: semesters

    };


    setStudents([
      ...students,
      newStudent
    ]);


    setName("");
    setSapid("");
    setRollNo("");

    setSem("");
    setSubject("");
    setCredit("");
    setInternal("");
    setExternal("");

    setSemesters([]);

  }


  return (

    <div className="form">

      <h1>Enter Details</h1>


      <h2>Student Profile</h2>


      <label>Name : </label>

      <input
        type="text"
        value={name}
        onChange={(e) =>
          setName(e.target.value)
        }
      />

      <br />
      <br />


      <label>SAP ID : </label>

      <input
        type="text"
        value={sapid}
        onChange={(e) =>
          setSapid(e.target.value)
        }
      />

      <br />
      <br />


      <label>Roll No : </label>

      <input
        type="text"
        value={rollNo}
        onChange={(e) =>
          setRollNo(e.target.value)
        }
      />

      <br />
      <br />


      <h2>Add Marks</h2>


      <label>Semester : </label>

      <input
        type="number"
        value={sem}
        onChange={(e) =>
          setSem(e.target.value)
        }
      />

      <br />
      <br />


      <label>Subject : </label>

      <input
        type="text"
        value={subject}
        onChange={(e) =>
          setSubject(e.target.value)
        }
      />

      <br />
      <br />


      <label>Credit : </label>

      <input
        type="number"
        value={credit}
        onChange={(e) =>
          setCredit(e.target.value)
        }
      />

      <br />
      <br />


      <label>Internal : </label>

      <input
        type="number"
        value={internal}
        onChange={(e) =>
          setInternal(e.target.value)
        }
      />

      <br />
      <br />


      <label>External : </label>

      <input
        type="number"
        value={external}
        onChange={(e) =>
          setExternal(e.target.value)
        }
      />

      <br />
      <br />


      <button onClick={addSubject}>
        Add Subject
      </button>


      <br />
      <br />


      <button onClick={addMoreStudent}>
        Add Student
      </button>


      <br />
      <br />


      <button onClick={() => navigate("/select")}>
        Next
      </button>

    </div>

  );

}

export default Student;