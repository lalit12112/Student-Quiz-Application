import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import styled from "styled-components";
import Quiz from "./components/Quiz";
import QuizList from "./components/Quizlist";
import AddQuiz from "./components/Addquiz";
import ToggleBar from "./components/Togglebar";

const PageContainer = styled.div`
  width: 500px;
  margin-left: 530px;

  color: #fff;
`;

function App() {
  const [mode, setMode] = useState("student"); // Default to student mode

  return (
    <Router>
      <PageContainer>
        <ToggleBar mode={mode} setMode={setMode} />
        <Routes>
          <Route path="/" element={<QuizList mode={mode} />} />
          <Route path="/quiz/:id" element={<Quiz />} />
          {mode === "teacher" && (
            <Route path="/add-quiz" element={<AddQuiz />} />
          )}
        </Routes>
      </PageContainer>
    </Router>
  );
}

export default App;
