import { useState } from "react";
import StudentForm from "./components/StudentForm";
import StudentList from "./components/StudentList";
import "./App.css";

function App() {
  const [students, setStudents] = useState([]);

  return (
    <div className="container">
      <h1>Student Management System</h1>

      <StudentForm
        students={students}
        setStudents={setStudents}
      />

      <StudentList students={students} />
    </div>
  );
}

export default App;