import { useQuiz } from './hooks/useQuiz'
import HomeScreen from './components/HomeScreen'
import ExploreScreen from './components/ExploreScreen'
import QuizContainer from './components/QuizContainer'

export default function App() {
  const quiz = useQuiz()

  if (quiz.appPhase === 'home') {
    return (
      <HomeScreen
        onExplore={quiz.startExplore}
        onDireto={quiz.startDireto}
        onBussola={quiz.startBussola}
      />
    )
  }

  if (quiz.appPhase === 'explore') {
    return <ExploreScreen onBack={quiz.goHome} />
  }

  return <QuizContainer quiz={quiz} />
}
