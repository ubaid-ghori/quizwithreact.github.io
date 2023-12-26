import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';

import './App.css';

function App() {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);

  useEffect(() => {
    fetchQuestions();
  }, []);

  function fetchQuestions() {
    fetch('https://opentdb.com/api.php?amount=10&category=9&difficulty=medium&type=multiple')
      .then((res) => res.json())
      .then((res) => {
        const formattedQuestions = res.results.map((q) => {
          const options = [...q.incorrect_answers, q.correct_answer];
          options.sort(() => Math.random() - 0.5);
          return {
            ...q,
            options,
          };
        });
        setQuestions(formattedQuestions);
      })
      .catch((error) => console.error('Error fetching questions:', error));
  }

  function next() {
    setCurrentIndex(currentIndex + 1);
    setSelectedOption(null);
  }

  function restart() {
    setCurrentIndex(0);
    setSelectedOption(null);
  }

  function handleOptionClick(option) {
    setSelectedOption(option);
  }

  if (!questions || !questions.length) {
    return <div>Loading...</div>;
  }

  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <div className="quiz-container">
          <div className="question-container">
            <h2 className="question-number">{currentIndex + 1}.</h2>
            <h2 className="question-text">{currentQuestion.question}</h2>
          </div>
          <div className="options-container">
            {currentQuestion.options.map((option, optionIndex) => (
              <button
                key={optionIndex}
                onClick={() => handleOptionClick(option)}
                className={`option-button ${selectedOption === option ? 'selected' : ''}`}
                disabled={selectedOption !== null}
              >
                {option}
              </button>
            ))}
          </div>
          <div className="button-container">
            {isLastQuestion ? (
              <button className="restart-button" onClick={restart}>
                Restart
              </button>
            ) : (
              <button className="next-button" onClick={next} disabled={selectedOption === null}>
                Next
              </button>
            )}
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;
