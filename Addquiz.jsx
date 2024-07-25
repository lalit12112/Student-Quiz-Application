import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const Container = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
  background: #2e2e2e;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  color: #fff;
`;

const Title = styled.h1`
  font-size: 2rem;
  text-align: center;
  margin-bottom: 1.5rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: bold;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
`;

const OptionGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const OptionLabel = styled(Label)`
  font-weight: normal;
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
`;

const Button = styled.button`
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

const AddQuestionButton = styled(Button)`
  background: #28a745;

  &:hover {
    background: #218838;
  }
`;

function AddQuiz() {
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState([
    { questionText: "", options: ["", "", "", ""], correctOptionIndex: 0 },
  ]);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newQuiz = { title, questions };
    await axios.post("http://localhost:5000/api/quiz", newQuiz);
    navigate("/");
  };

  const handleQuestionChange = (e, index) => {
    const newQuestions = [...questions];
    newQuestions[index].questionText = e.target.value;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (e, qIndex, oIndex) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[oIndex] = e.target.value;
    setQuestions(newQuestions);
  };

  const handleCorrectOptionChange = (e, qIndex) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].correctOptionIndex = parseInt(e.target.value, 10);
    setQuestions(newQuestions);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { questionText: "", options: ["", "", "", ""], correctOptionIndex: 0 },
    ]);
  };

  return (
    <Container>
      <Title>Add a New Quiz</Title>
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>Title:</Label>
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </FormGroup>
        {questions.map((question, qIndex) => (
          <FormGroup key={qIndex}>
            <Label>Question {qIndex + 1}:</Label>
            <Input
              type="text"
              value={question.questionText}
              onChange={(e) => handleQuestionChange(e, qIndex)}
              required
            />
            <OptionGroup>
              {question.options.map((option, oIndex) => (
                <FormGroup key={oIndex}>
                  <OptionLabel>Option {oIndex + 1}:</OptionLabel>
                  <Input
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionChange(e, qIndex, oIndex)}
                    required
                  />
                </FormGroup>
              ))}
            </OptionGroup>
            <FormGroup>
              <Label>Correct Option:</Label>
              <Select
                value={question.correctOptionIndex}
                onChange={(e) => handleCorrectOptionChange(e, qIndex)}
              >
                {question.options.map((option, oIndex) => (
                  <option key={oIndex} value={oIndex}>
                    {`Option ${oIndex + 1}`}
                  </option>
                ))}
              </Select>
            </FormGroup>
          </FormGroup>
        ))}
        <AddQuestionButton type="button" onClick={addQuestion}>
          Add Question
        </AddQuestionButton>
        <Button type="submit">Add Quiz</Button>
      </Form>
    </Container>
  );
}

export default AddQuiz;
