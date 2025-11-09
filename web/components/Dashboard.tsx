import Assessment from './Assessment';
import RecommendationPanel from './RecommendationPanel';
import { DiagnosticsProvider, useMasterySnapshot } from '../state/diagnostics';

const MasterySummary = () => {
  const snapshot = useMasterySnapshot();
  const topicEntries = Object.entries(snapshot.byTopic);
  const difficultyEntries = Object.entries(snapshot.byDifficulty);

  return (
    <section className="mastery-summary">
      <h3>Current Mastery Levels</h3>
      {topicEntries.length ? (
        <div className="mastery-grid">
          <div>
            <h4>By Topic</h4>
            <ul>
              {topicEntries.map(([topic, performance]) => (
                <li key={topic}>
                  <strong>{topic}</strong>:{' '}
                  {`${(performance.accuracy * 100).toFixed(0)}% (${performance.correct}/${performance.total})`}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4>By Difficulty</h4>
            <ul>
              {difficultyEntries.map(([difficulty, performance]) => (
                <li key={difficulty}>
                  <strong>{difficulty}</strong>:{' '}
                  {`${(performance.accuracy * 100).toFixed(0)}% (${performance.correct}/${performance.total})`}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <p>Complete at least one assessment question to populate mastery analytics.</p>
      )}
    </section>
  );
};

export const Dashboard = () => {
  return (
    <DiagnosticsProvider>
      <div className="diagnostics-dashboard">
        <header>
          <h1>CFA Readiness Diagnostics</h1>
          <p>
            Track your mastery, surface weak spots, and receive targeted recommendations to streamline CFA Level I
            preparation.
          </p>
        </header>

        <main>
          <div className="dashboard-content">
            <div className="left-column">
              <Assessment />
            </div>
            <div className="right-column">
              <MasterySummary />
              <RecommendationPanel />
            </div>
          </div>
        </main>
      </div>
    </DiagnosticsProvider>
  );
};

export default Dashboard;
