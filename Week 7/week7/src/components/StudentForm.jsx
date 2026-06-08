function StudentForm({ students, setStudents }) {
  const addStudent = () => {
    const rollNo = document.getElementById("rollNo").value;
    const name = document.getElementById("name").value;

    if (rollNo === "" || name === "") {
      alert("Enter all details");
      return;
    }

    const newStudent = {
      rollNo,
      name,
    };

    setStudents([...students, newStudent]);

    document.getElementById("rollNo").value = "";
    document.getElementById("name").value = "";
  };

  return (
    <div className="form-container">
      <input
        type="text"
        id="rollNo"
        placeholder="Enter Roll Number"
      />

      <input
        type="text"
        id="name"
        placeholder="Enter Student Name"
      />

      <button onClick={addStudent}>
        Add Student
      </button>
    </div>
  );
}

export default StudentForm;