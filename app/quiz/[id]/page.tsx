import QuizScreen from "@/components/QuizScreen";

export default function QuizPage({ params }: { params: { id: string } }) {
  return <QuizScreen quizId={params.id} />;
}


