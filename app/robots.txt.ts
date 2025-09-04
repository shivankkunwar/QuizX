export const runtime = 'edge';

export async function GET() {
  const robots = `User-agent: *
Allow: /

Sitemap: https://quizx-5z2.pages.dev/sitemap.xml`;

  return new Response(robots, {
    status: 200,
    headers: { "Content-Type": "text/plain" }
  });
}
