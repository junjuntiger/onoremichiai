import { useState } from 'react';
import { Home } from './components/Home';
import { AnswerForm } from './components/AnswerForm';
import { PhraseView } from './components/PhraseView';

type View = 'home' | 'answer' | 'phrase';

interface AnswerContext {
  questionIndex: number;
  questions: string[];
}

export default function App() {
  const [view, setView] = useState<View>('home');
  const [answerContext, setAnswerContext] = useState<AnswerContext | null>(null);
  const [currentPhrase, setCurrentPhrase] = useState('');

  const handleStartAnswer = (index: number, questions: string[]) => {
    setAnswerContext({ questionIndex: index, questions });
    setView('answer');
  };

  const handlePhraseReady = (phrase: string) => {
    setCurrentPhrase(phrase);
    setView('phrase');
  };

  return (
    <>
      {view === 'home' && <Home onStartAnswer={handleStartAnswer} />}
      {view === 'answer' && answerContext && (
        <AnswerForm
          questionIndex={answerContext.questionIndex}
          questions={answerContext.questions}
          onBack={() => setView('home')}
          onPhraseReady={handlePhraseReady}
        />
      )}
      {view === 'phrase' && (
        <PhraseView
          phrase={currentPhrase}
          onBack={() => setView('home')}
        />
      )}
    </>
  );
}
