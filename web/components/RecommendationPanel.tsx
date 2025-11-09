import { useMemo } from 'react';
import { questionBank, Question } from '../data/questions';
import {
  useDiagnostics,
  useMasterySnapshot,
  useRecentResponses,
  useDifficultyPerformance,
  useLearningObjectivePerformance,
  PerformanceSummary,
} from '../state/diagnostics';

interface RecommendationCard {
  question: Question;
  reason: string;
}

type AccuracyEntry<T extends { accuracy: number }> = [string, T];

const sortByAccuracyAscending = <T extends { accuracy: number }>(entries: AccuracyEntry<T>[]): AccuracyEntry<T>[] =>
  [...entries].sort((a, b) => a[1].accuracy - b[1].accuracy);

const sanitizeEntries = <T extends { accuracy: number }>(
  entries: [string, T | undefined][]
): AccuracyEntry<T>[] => entries.filter((entry): entry is AccuracyEntry<T> => Boolean(entry[1]));

export const RecommendationPanel = () => {
  const diagnostics = useDiagnostics();
  const masterySnapshot = useMasterySnapshot();
  const recentResponses = useRecentResponses(5);
  const difficultyPerformance = useDifficultyPerformance();
  const learningObjectivePerformance = useLearningObjectivePerformance();

  const recommendationQueue = useMemo<RecommendationCard[]>(() => {
    const state = diagnostics.getState();
    const incorrectIds = new Set(
      state.responses.filter((response) => !response.correct).map((response) => response.questionId)
    );
    const seenIds = new Set(state.responses.map((response) => response.questionId));

    const topicRanking = sortByAccuracyAscending(
      sanitizeEntries(Object.entries(masterySnapshot.byTopic) as [string, PerformanceSummary | undefined][])
    );
    const recommendations: RecommendationCard[] = [];

    topicRanking.forEach(([topic, performance]) => {
      if (performance.total === 0 || performance.accuracy >= 0.8) {
        return;
      }

      const targetQuestion = questionBank.questions.find((question) => {
        if (question.topic !== topic) return false;
        if (!seenIds.has(question.id)) return true;
        return incorrectIds.has(question.id);
      });

      if (targetQuestion) {
        recommendations.push({
          question: targetQuestion,
          reason: `Build proficiency in ${topic} (current accuracy ${(performance.accuracy * 100).toFixed(0)}%).`,
        });
      }
    });

    if (recommendations.length === 0) {
      const firstUnseen = questionBank.questions.find((question) => !seenIds.has(question.id));
      if (firstUnseen) {
        recommendations.push({
          question: firstUnseen,
          reason: 'Introduce a new concept to expand your coverage.',
        });
      }
    }

    return recommendations.slice(0, 5);
  }, [diagnostics, masterySnapshot]);

  const strongestTopics = useMemo(() => {
    const entries = sanitizeEntries(
      Object.entries(masterySnapshot.byTopic) as [string, PerformanceSummary | undefined][]
    ) as AccuracyEntry<PerformanceSummary>[];
    return entries.length
      ? entries
          .filter(([, performance]) => performance.total >= 2)
          .sort((a, b) => b[1].accuracy - a[1].accuracy)
          .slice(0, 3)
      : [];
  }, [masterySnapshot]);

  const weakestDifficulties = useMemo(
    () =>
      sortByAccuracyAscending(
        sanitizeEntries(Object.entries(difficultyPerformance) as [string, PerformanceSummary | undefined][])
      ),
    [difficultyPerformance]
  );

  const objectiveSignals = useMemo(
    () =>
      sortByAccuracyAscending(
        sanitizeEntries(Object.entries(learningObjectivePerformance) as [string, PerformanceSummary | undefined][])
      ).filter(
        ([, performance]) => performance.total > 0
      ),
    [learningObjectivePerformance]
  );

  return (
    <div className="recommendation-panel">
      <header>
        <h3>Performance Diagnostics</h3>
        <p>Target your practice where it matters most based on real-time diagnostic data.</p>
      </header>

      <section>
        <h4>Recent responses</h4>
        {recentResponses.length ? (
          <ul>
            {recentResponses.map((response) => (
              <li key={response.timestamp}>
                <strong>{response.correct ? '✅' : '❌'}</strong> {response.topic} ({response.difficulty}) —{' '}
                {new Date(response.timestamp).toLocaleTimeString()}
              </li>
            ))}
          </ul>
        ) : (
          <p>No attempts yet. Answer a few questions to generate diagnostics.</p>
        )}
      </section>

      <section>
        <h4>Strength highlights</h4>
        {strongestTopics.length ? (
          <ul>
            {strongestTopics.map(([topic, performance]) => (
              <li key={topic}>
                {topic}: {(performance.accuracy * 100).toFixed(0)}% accuracy across {performance.total} questions
              </li>
            ))}
          </ul>
        ) : (
          <p>Keep practicing to uncover your strengths.</p>
        )}
      </section>

      <section>
        <h4>Areas to improve</h4>
        {weakestDifficulties.length ? (
          <ul>
            {weakestDifficulties.map(([difficulty, performance]) => (
              <li key={difficulty}>
                {difficulty}: {(performance.accuracy * 100).toFixed(0)}% accuracy across {performance.total} attempts
              </li>
            ))}
          </ul>
        ) : (
          <p>Not enough data yet. Continue the assessment to reveal focus areas.</p>
        )}
      </section>

      <section>
        <h4>Recommended next steps</h4>
        {recommendationQueue.length ? (
          <ol>
            {recommendationQueue.map(({ question, reason }) => (
              <li key={question.id}>
                <strong>{question.topic}</strong>: {question.prompt}
                <p className="reason">{reason}</p>
              </li>
            ))}
          </ol>
        ) : (
          <p>Fantastic performance! Continue practicing to maintain mastery.</p>
        )}
      </section>

      {objectiveSignals.length > 0 && (
        <section>
          <h4>Learning objective signals</h4>
          <ul>
            {objectiveSignals.slice(0, 5).map(([objectiveId, performance]) => {
              const objective = questionBank.metadata.learningObjectives.find((item) => item.id === objectiveId);
              return (
                <li key={objectiveId}>
                  <strong>{objective?.description ?? objectiveId}</strong>: {(performance.accuracy * 100).toFixed(0)}%
                  accuracy
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </div>
  );
};

export default RecommendationPanel;
