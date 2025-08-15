import Cockpit from "@/components/Cockpit";

export const runtime = 'edge';

export default async function PreparePage({
	searchParams,
}: {
	searchParams: Promise<{ topic?: string | string[] }>
}) {
	const resolvedSearchParams = await searchParams;
	const rawTopic = resolvedSearchParams?.topic;
	const topic = Array.isArray(rawTopic) ? rawTopic[0] ?? "" : rawTopic ?? "";
	return <Cockpit initialTopic={topic} />;
}