export interface ContentAnalysis {
  hasCode: boolean;
  hasKatex: boolean;
  hasInlineCode: boolean;
  length: number;
  isLong: boolean;
  codeBlocks: string[];
  mathExpressions: string[];
}

export function analyzeContent(text: string): ContentAnalysis {
  const codeBlockRegex = /```[\s\S]*?```/g;
  const inlineCodeRegex = /`[^`]+`/g;
  const katexRegex = /\\\([\s\S]*?\\\)|\$\$[\s\S]*?\$\$/g;

  const codeBlocks = text.match(codeBlockRegex) || [];
  const mathExpressions = text.match(katexRegex) || [];

  return {
    hasCode: codeBlockRegex.test(text),
    hasKatex: katexRegex.test(text),
    hasInlineCode: inlineCodeRegex.test(text),
    length: text.length,
    isLong: text.length > 80,
    codeBlocks,
    mathExpressions
  };
}

export function getLayoutType(options: { A: string; B: string; C: string; D: string }): 'grid-2x2' | 'vertical-compact' | 'vertical-cards' {
  const optionTexts = Object.values(options);
  const analyses = optionTexts.map(analyzeContent);

  const hasLongContent = analyses.some(a => a.isLong);
  const hasCode = analyses.some(a => a.hasCode);
  const allShort = analyses.every(a => a.length < 30);

  if (hasLongContent || hasCode) return 'vertical-cards';
  if (allShort) return 'grid-2x2';
  return 'vertical-compact';
}



