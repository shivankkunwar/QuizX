export async function GET() {
  const base = "https://quizx-5z2.pages.dev";
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${base}/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </url>
</urlset>`;
  return new Response(sitemap, { status: 200, headers: { "Content-Type": "application/xml" } });
}

