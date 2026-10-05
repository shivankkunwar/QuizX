// End-to-end smoke test against a running site (default: production).
//   BASE=http://localhost:3000 npm run smoke
// Creates one real quiz, so it uses one of the day's free quizzes for a fresh user ID.
import { chromium } from 'playwright-core';

const BASE = process.env.BASE || 'https://quiz.shvnk.in';
const browser = await chromium.launch({ channel: process.env.CI ? undefined : 'chrome' });
const page = await browser.newPage();
const failures = [];
const check = (name, ok, info = '') => {
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${info ? `  (${info})` : ''}`);
  if (!ok) failures.push(name);
};
page.on('pageerror', e => check(`no page errors: ${e.message}`, false));
const dialogs = [];
page.on('dialog', d => { dialogs.push(d.message()); d.accept(); });

try {
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.getByText(/\d+\/\d+ left/).first().waitFor({ timeout: 20_000 }); // hydrated + backend reachable

  // Every marquee chip (both rendered copies) fills the input
  const chips = page.locator('.scroller button');
  let dead = 0;
  for (let i = 0; i < await chips.count(); i++) {
    await page.locator('textarea').fill('');
    await chips.nth(i).dispatchEvent('click');
    if ((await page.locator('textarea').inputValue()).length < 20) dead++;
  }
  check('all topic chips fill the input', dead === 0, `${await chips.count()} chips, ${dead} dead`);

  await page.locator('textarea').fill('history');
  await page.locator('textarea').press('Enter');
  await page.waitForURL(/\/prepare/);
  await page.waitForSelector('text=Refine (optional)', { timeout: 60_000 });
  check('topic refinement suggestions', true);

  await page.click('button:text("Start Quiz")');
  await page.waitForURL(/\/quiz\/[^/]+$/, { timeout: 90_000 });
  const quizUrl = page.url();
  await page.waitForSelector('text=Question 1 of 5', { timeout: 20_000 });
  check('quiz generated with 5 questions', true);

  for (let i = 0; i < 5; i++) {
    await page.waitForSelector(`text=Question ${i + 1} of 5`);
    await page.locator('main button').first().click();
    await page.waitForTimeout(700);
    const next = page.locator('button:text("Next Question"), button:text("Finish Quiz")').first();
    const box = await next.boundingBox();
    if (!box || box.y > page.viewportSize().height) await page.click('button:has-text("Explanation")');
    await next.click();
  }
  await page.waitForURL(/\/results\?score=\d+&total=5/);
  const score = new URL(page.url()).searchParams.get('score');
  check('results page', true, `${score}/5`);

  await page.click('a:text("Home")');
  await page.waitForSelector(`#history-section >> text=${score}/5 correct`, { timeout: 15_000 });
  check('history shows the quiz with its score', true);
  await page.locator('#history-section button[aria-label="Review"]').first().click();
  await page.waitForURL(quizUrl);
  check('review reopens the quiz', true);

  // BYOK path calls Gemini directly from the browser; a bad key must surface Google's error
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.click('button:has-text("BYOK")');
  await page.fill('input[type=password]', 'invalid-key-for-smoke-test');
  await page.click('button:text("Save")');
  await page.goto(`${BASE}/prepare?topic=photosynthesis`, { waitUntil: 'networkidle' });
  await page.click('button:text("Start Quiz")');
  for (let i = 0; i < 30 && !dialogs.length; i++) await page.waitForTimeout(500);
  const msg = dialogs.at(-1) || 'no alert shown';
  check('BYOK reaches Gemini', /API key/i.test(msg), msg.slice(0, 80));
} catch (e) {
  check(`unexpected: ${e.message.split('\n')[0]}`, false);
} finally {
  await browser.close();
}
process.exit(failures.length ? 1 : 0);
