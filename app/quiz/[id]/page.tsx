import QuizScreen from "@/components/QuizScreen";

export default async function QuizPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;
  return <QuizScreen quizId={id} />;
}


