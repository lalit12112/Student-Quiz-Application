import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import styled from "styled-components";

const PageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: #3a3a3a;
`;

const Container = styled.div`
  width: 100%;
  max-width: 600px;
  padding: 2rem;
  background: #2e2e2e;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  text-align: center;
  color: #fff;
`;

const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: 1.5rem;
`;

const QuizListContainer = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
`;

const QuizItem = styled.li`
  margin: 1rem 0;
`;

const QuizLink = styled(Link)`
  text-decoration: none;
  color: #007bff;
  font-size: 1.2rem;

  &:hover {
    text-decoration: underline;
  }
`;

const AddQuizLink = styled(Link)`
  display: inline-block;
  margin-top: 2rem;
  padding: 0.75rem;
  background: #28a745;
  color: #fff;
  border-radius: 4px;
  text-decoration: none;
  font-size: 1rem;

  &:hover {
    background: #218838;
  }
`;

function QuizList({ mode }) {
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    const fetchQuizzes = async () => {
      const res = await axios.get("http://localhost:5000/api/quiz");
      setQuizzes(res.data);
    };

    fetchQuizzes();
  }, []);

  return (
    <PageContainer>
      <Container>
        <Title>Quiz List</Title>
        <QuizListContainer>
          {quizzes.map((quiz) => (
            <QuizItem key={quiz.id}>
              <QuizLink to={`/quiz/${quiz.id}`}>{quiz.title}</QuizLink>
            </QuizItem>
          ))}
        </QuizListContainer>
        {mode === "teacher" && (
          <AddQuizLink to="/add-quiz">Add a new quiz</AddQuizLink>
        )}
      </Container>
    </PageContainer>
  );
}

export default QuizList;
