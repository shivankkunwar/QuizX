import Cockpit from "@/components/Cockpit";

export default function PreparePage({ searchParams }: { searchParams: { topic?: string } }) {
  const topic = (searchParams?.topic || "").toString();
  return <Cockpit initialTopic={topic} />;
}