import { useState } from 'react';
import { Home } from './components/Home';

type View = 'home';

export default function App() {
  const [view] = useState<View>('home');
  const [_selectedQuestion, setSelectedQuestion] = useState<{
    index: number;
    questions: string[];
  } | null>(null);

  const handleStartAnswer = (index: number, questions: string[]) => {
    setSelectedQuestion({ index, questions });
    // TODO: navigate to answer view in next phase
    console.log('問いを選択:', index, questions[index]);
  };

  return (
    <>
      {view === 'home' && <Home onStartAnswer={handleStartAnswer} />}
    </>
  );
}
