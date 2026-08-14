function Result({
  selectedStudent,
  selectedSem
}) {


  function gradesys(mark, internal) {

    if (internal < 16) {
      return ["F", 0];
    }


    if (mark >= 85)
      return ["A", 10];

    if (mark >= 70)
      return ["B", 9];

    if (mark >= 60)
      return ["C", 7];

    if (mark >= 40)
      return ["D", 6];

    return ["F", 0];

  }


  if (
    !selectedStudent ||
    !selectedSem
  ) {

    return (

      <div className="form">

        <h2>
          Result Not Found
        </h2>

      </div>

    );

  }


  let totalPoints = 0;
  let totalCredits = 0;


  selectedSem.subjects.forEach(
    (subject) => {

      const total =
        subject.internal +
        subject.external;


      const grade =
        gradesys(
          total,
          subject.internal
        );


      totalPoints =
        totalPoints +
        subject.credit * grade[1];


      totalCredits =
        totalCredits +
        subject.credit;

    }
  );


  const gpa =
    totalPoints /
    totalCredits;


  return (

    <div className="form">

      <h1>MARKSHEET</h1>


      <h3>
        Name : {selectedStudent.name}
      </h3>


      <h4>
        SAP ID : {selectedStudent.sapid}
      </h4>


      <h4>
        Roll No : {selectedStudent.rollNo}
      </h4>


      <h4>
        Semester : {selectedSem.sem}
      </h4>


      <table border="1">

        <thead>

          <tr>

            <th>Subject</th>
            <th>Credit</th>
            <th>Internal</th>
            <th>External</th>
            <th>Total</th>
            <th>Grade</th>
      
          </tr>

        </thead>


        <tbody>

          {selectedSem.subjects.map(
            (subject, index) => {

              const total =
                subject.internal +
                subject.external;


              const grade =
                gradesys(
                  total,
                  subject.internal
                );


              return (

                <tr key={index}>

                  <td>
                    {subject.name}
                  </td>

                  <td>
                    {subject.credit}
                  </td>

                  <td>
                    {subject.internal}
                  </td>

                  <td>
                    {subject.external}
                  </td>

                  <td>
                    {total}
                  </td>

                  <td>
                    {grade[0]}
                  </td>

           

                </tr>

              );

            }
          )}

        </tbody>

      </table>


      <h3>
        GPA : {gpa.toFixed(2)}
      </h3>

    </div>

  );

}

export default Result;