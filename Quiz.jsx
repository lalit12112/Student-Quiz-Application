import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";

const Container = styled.div`
  width: 500px;
  padding: 2rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  color: #fff;
`;

const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: 1.5rem;
`;

const Question = styled.div`
  margin-bottom: 1.5rem;
`;

const Options = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const Option = styled.li`
  margin: 0.5rem 0;
`;

const SubmitButton = styled.button`
  padding: 0.75rem;
  background: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;

  &:hover {
    background: #0056b3;
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const Result = styled.div`
  text-align: center;
`;

function Quiz() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(null); // State to hold quiz score

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/quiz/${id}`);
        setQuiz(res.data);
      } catch (error) {
        console.error("Error fetching quiz:", error);
      }
    };

    fetchQuiz();
  }, [id]);

  const handleAnswerSelect = (questionIndex, optionIndex) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionIndex]: optionIndex,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setShowResults(true);

    // Calculate score
    const calculatedScore = Object.keys(answers).reduce(
      (acc, questionIndex) => {
        const selectedOptionIndex = answers[questionIndex];
        return (
          acc +
          (quiz.questions[questionIndex].correctOptionIndex ===
          selectedOptionIndex
            ? 1
            : 0)
        );
      },
      0
    );

    setScore(calculatedScore);

    // Send quiz score to backend
    try {
      const response = await axios.post(
        `http://localhost:5000/api/quiz/${id}/score`,
        {
          userId: 2, // Replace with actual user ID (from authentication)
          score: calculatedScore,
        }
      );

      console.log("Quiz score saved:", response.data);
    } catch (error) {
      console.error("Error saving quiz score:", error);
    }
  };

  const handleGoBack = () => {
    navigate("/");
  };

  if (!quiz) return <div>Loading...</div>;
  if (showResults) {
    return (
      <Result>
        <Title>Quiz Results</Title>
        <p>
          Your score: {score} / {quiz.questions.length}
        </p>
        <SubmitButton onClick={handleGoBack}>Go Back to Quiz List</SubmitButton>
      </Result>
    );
  }

  return (
    <Container>
      <Title>{quiz.title}</Title>
      <form onSubmit={handleSubmit}>
        {quiz.questions.map((question, questionIndex) => (
          <Question key={questionIndex}>
            <h3>{question.questionText}</h3>
            <Options>
              {question.options.map((option, optionIndex) => (
                <Option key={optionIndex}>
                  <label>
                    <input
                      type="radio"
                      name={`question${questionIndex}`}
                      value={optionIndex}
                      checked={answers[questionIndex] === optionIndex}
                      onChange={() =>
                        handleAnswerSelect(questionIndex, optionIndex)
                      }
                    />
                    {option}
                  </label>
                </Option>
              ))}
            </Options>
          </Question>
        ))}
        <SubmitButton type="submit">Submit Answers</SubmitButton>
      </form>
    </Container>
  );
}

export default Quiz;
