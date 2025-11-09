import { useCallback, useMemo, useState } from 'react';
import { questionBank, Question, DifficultyLevel } from '../data/questions';
import { useDiagnostics, useMasterySnapshot, ResponseRecord } from '../state/diagnostics';

const difficultyOrder: DifficultyLevel[] = ['easy', 'medium', 'hard'];

const getNextDifficulty = (current: DifficultyLevel, direction: 1 | -1): DifficultyLevel => {
  const index = difficultyOrder.indexOf(current);
  const nextIndex = Math.min(Math.max(index + direction, 0), difficultyOrder.length - 1);
  return difficultyOrder[nextIndex];
};

const findQuestion = (
  difficulty: DifficultyLevel,
  askedIds: Set<string>,
  topic?: string
): Question | undefined => {
  return questionBank.questions.find(
    (question) =>
      question.difficulty === difficulty &&
      !askedIds.has(question.id) &&
      (!topic || question.topic === topic)
  );
};

const fallbackQuestion = (askedIds: Set<string>): Question | undefined =>
  questionBank.questions.find((question) => !askedIds.has(question.id));

export const Assessment = () => {
  const diagnostics = useDiagnostics();
  const masterySnapshot = useMasterySnapshot();
  const [askedQuestions, setAskedQuestions] = useState<string[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question | undefined>(() => {
    const initialSet = questionBank.questions.filter((question) => question.difficulty === 'medium');
    return initialSet[Math.floor(Math.random() * initialSet.length)] ?? questionBank.questions[0];
  });
  const [lastResponse, setLastResponse] = useState<ResponseRecord | null>(null);
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null);

  const askedIds = useMemo(() => new Set(askedQuestions), [askedQuestions]);

  const selectNextQuestion = useCallback(
    (previousResponse?: ResponseRecord | null) => {
      if (!previousResponse && currentQuestion && !askedIds.has(currentQuestion.id)) {
        return currentQuestion;
      }

      const targetDifficulty = previousResponse
        ? getNextDifficulty(previousResponse.difficulty, previousResponse.correct ? 1 : -1)
        : 'medium';

      const candidateByTopic = previousResponse
        ? findQuestion(targetDifficulty, askedIds, currentQuestion?.topic)
        : findQuestion(targetDifficulty, askedIds);

      if (candidateByTopic) {
        return candidateByTopic;
      }

      const candidateAnyDifficulty = findQuestion(targetDifficulty, askedIds) ?? fallbackQuestion(askedIds);
      return candidateAnyDifficulty ?? questionBank.questions[0];
    },
    [askedIds, currentQuestion]
  );

  const handleChoiceSelection = (choiceId: string) => {
    if (!currentQuestion) {
      return;
    }

    const record = diagnostics.recordResponse(currentQuestion, choiceId);
    setLastResponse(record);
    setSelectedChoiceId(choiceId);
    setAskedQuestions((prev) => (prev.includes(currentQuestion.id) ? prev : [...prev, currentQuestion.id]));
  };

  const handleNextQuestion = () => {
    const next = selectNextQuestion(lastResponse);
    setCurrentQuestion(next);
    setSelectedChoiceId(null);
  };

  const hasAnswered = selectedChoiceId !== null;
  const isCorrect = hasAnswered && currentQuestion?.answerId === selectedChoiceId;
  const answeredCount = askedQuestions.length;

  return (
    <div className="assessment">
      <header>
        <h2>Adaptive Assessment</h2>
        <p>
          Answer questions to diagnose your mastery across CFA Level I topics. Difficulty will adjust based on
          your responses.
        </p>
      </header>

      {currentQuestion ? (
        <section className="question-card">
          <h3>{currentQuestion.prompt}</h3>
          <ul className="choices">
            {currentQuestion.choices.map((choice) => {
              const isSelected = selectedChoiceId === choice.id;
              const isAnswer = currentQuestion.answerId === choice.id;
              return (
                <li key={choice.id}>
                  <button
                    type="button"
                    onClick={() => handleChoiceSelection(choice.id)}
                    disabled={hasAnswered}
                    className={`choice-button ${isSelected ? 'selected' : ''} ${
                      hasAnswered && isAnswer ? 'correct' : hasAnswered && isSelected ? 'incorrect' : ''
                    }`}
                  >
                    {choice.label}
                  </button>
                </li>
              );
            })}
          </ul>

          {hasAnswered && (
            <div className="feedback">
              <p className={isCorrect ? 'correct' : 'incorrect'}>
                {isCorrect ? 'Great job! That is correct.' : 'Not quite. Review the rationale below and try another.'}
              </p>
              {currentQuestion.rationale && <p className="rationale">{currentQuestion.rationale}</p>}
              <button type="button" onClick={handleNextQuestion} className="next-question">
                Next Question
              </button>
            </div>
          )}
        </section>
      ) : (
        <p>No questions available.</p>
      )}

      <aside className="assessment-summary">
        <h4>Progress overview</h4>
        <ul>
          <li>Total questions answered: {answeredCount}</li>
          <li>
            Strongest topic:{' '}
            {(() => {
              const entries = Object.entries(masterySnapshot.byTopic);
              if (!entries.length) return 'N/A';
              const [topic] = entries.reduce((best, entry) => (entry[1].accuracy > best[1].accuracy ? entry : best));
              return topic;
            })()}
          </li>
          <li>
            Toughest difficulty:{' '}
            {(() => {
              const entries = Object.entries(masterySnapshot.byDifficulty);
              if (!entries.length) return 'N/A';
              const [difficulty] = entries.reduce((worst, entry) =>
                entry[1].accuracy < worst[1].accuracy ? entry : worst
              );
              return difficulty;
            })()}
          </li>
        </ul>
      </aside>
    </div>
  );
};

export default Assessment;
