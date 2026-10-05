export function getLayoutType(options: { A: string; B: string; C: string; D: string }): "grid-2x2" | "vertical-compact" | "vertical-cards" {
  const texts = Object.values(options);
  if (texts.some(t => t.length > 80 || /```[\s\S]*?```/.test(t))) return "vertical-cards";
  if (texts.every(t => t.length < 30)) return "grid-2x2";
  return "vertical-compact";
}
