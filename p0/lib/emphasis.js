/**
 * Smart Word Emphasis Engine
 *
 * Parses a user's sentence and classifies each word into one of three tiers:
 *   - power:    Action verbs, important nouns/adjectives — shown large & bold
 *   - normal:   Regular content words — shown at standard weight
 *   - quiet:    Connectors, articles, prepositions — shown small & muted
 *
 * The goal: make the sentence feel like an editorial headline, not a plain string.
 */

// Words that almost always carry emotional or action weight
const POWER_VERBS = new Set([
  'ship', 'finish', 'launch', 'fix', 'start', 'close', 'nail', 'crush',
  'build', 'write', 'prep', 'prepare', 'complete', 'deliver', 'present',
  'solve', 'tackle', 'create', 'design', 'push', 'send', 'submit',
  'review', 'approve', 'decide', 'commit', 'execute', 'focus', 'win',
  'lead', 'drive', 'land', 'hire', 'cut', 'kill', 'dominate', 'own',
  'master', 'conquer', 'ace', 'smash', 'wrap', 'lock', 'secure',
  'define', 'refine', 'polish', 'test', 'validate', 'prove', 'pitch',
  'negotiate', 'sign', 'release', 'deploy', 'migrate', 'scale',
  'optimize', 'automate', 'simplify', 'restructure', 'overhaul',
  'revamp', 'redesign', 'rethink', 'reimagine', 'prioritize'
]);

// Adjectives/adverbs that carry emotional weight
const POWER_ADJECTIVES = new Set([
  'hard', 'important', 'final', 'big', 'critical', 'key', 'main',
  'urgent', 'crucial', 'essential', 'major', 'tough', 'bold',
  'massive', 'epic', 'killer', 'core', 'top', 'first', 'last',
  'new', 'best', 'great', 'real', 'full', 'deep', 'high', 'fast',
  'serious', 'strategic', 'ambitious', 'ultimate', 'breakthrough',
  'quarterly', 'annual', 'weekly', 'daily'
]);

// Words that should always be quiet (articles, prepositions, conjunctions)
const QUIET_WORDS = new Set([
  'the', 'a', 'an', 'for', 'with', 'to', 'and', 'or', 'but', 'in',
  'on', 'at', 'of', 'by', 'from', 'up', 'out', 'into', 'about',
  'is', 'are', 'was', 'be', 'my', 'our', 'your', 'its', 'this',
  'that', 'it', 'as', 'so', 'if', 'not', 'no', 'do', 'has', 'have',
  'before', 'after', 'during', 'between', 'through', 'over', 'under'
]);

// Common nouns that indicate "the thing" — objects of tasks
const TASK_NOUNS = new Set([
  'design', 'review', 'deck', 'pitch', 'report', 'analysis', 'plan',
  'brief', 'presentation', 'proposal', 'strategy', 'roadmap', 'spec',
  'prototype', 'mockup', 'wireframe', 'budget', 'contract', 'deal',
  'meeting', 'conversation', 'discussion', 'interview', 'onboarding',
  'redesign', 'research', 'experiment', 'launch', 'release', 'sprint',
  'feature', 'bug', 'issue', 'ticket', 'project', 'product', 'team',
  'client', 'user', 'customer', 'partner', 'investor', 'board',
  'email', 'doc', 'document', 'article', 'post', 'page', 'site',
  'app', 'api', 'dashboard', 'flow', 'system', 'process', 'pipeline',
  'checkout', 'signup', 'login', 'homepage', 'landing', 'campaign',
  'brand', 'logo', 'copy', 'content', 'video', 'ad', 'funnel',
  'metrics', 'data', 'insights', 'feedback', 'survey', 'audit',
  'migration', 'integration', 'deployment', 'infrastructure'
]);

/**
 * Classify each word in a sentence.
 *
 * Returns an array of { word, type, isFirstOfPhrase } objects where type
 * is 'power', 'normal', or 'quiet'.
 *
 * Also detects compound phrases: if a quiet word sits between two power words
 * (like "design review"), the phrase stays connected.
 */
function classifyWords(sentence) {
  const words = sentence.trim().split(/\s+/);
  if (words.length === 0) return [];

  // First pass: classify each word individually
  const classified = words.map((word, index) => {
    const clean = word.toLowerCase().replace(/[^a-z'-]/g, '');
    let type = 'normal';

    if (QUIET_WORDS.has(clean)) {
      type = 'quiet';
    } else if (POWER_VERBS.has(clean)) {
      type = 'power';
    } else if (POWER_ADJECTIVES.has(clean)) {
      type = 'power';
    } else if (TASK_NOUNS.has(clean)) {
      type = 'power';
    }

    return { word, clean, type, index };
  });

  // Second pass: promote words adjacent to power words
  // This catches compound phrases like "onboarding redesign", "user research"
  for (let i = 0; i < classified.length; i++) {
    if (classified[i].type === 'normal') {
      const prevIsPower = i > 0 && classified[i - 1].type === 'power';
      const nextIsPower = i < classified.length - 1 && classified[i + 1].type === 'power';
      if (prevIsPower || nextIsPower) {
        // Promote normal words next to power words (but not quiet words)
        classified[i].type = 'power';
      }
    }
  }

  // Special case: if the first word is a verb (action sentence), ensure it's power
  if (classified.length > 0) {
    const firstClean = classified[0].clean;
    // First word of an imperative sentence is usually the action verb
    if (classified[0].type === 'normal' && firstClean.length > 2) {
      classified[0].type = 'power';
    }
  }

  // Ensure we always have at least some power words (pick the longest non-quiet words)
  const hasPower = classified.some(w => w.type === 'power');
  if (!hasPower) {
    const sortedByLength = [...classified]
      .filter(w => w.type !== 'quiet')
      .sort((a, b) => b.clean.length - a.clean.length);
    // Promote the top 2 longest words
    sortedByLength.slice(0, 2).forEach(w => {
      classified[w.index].type = 'power';
    });
  }

  return classified.map(({ word, type }) => ({ word, type }));
}

/**
 * Group classified words into "phrases" for layout purposes.
 * Consecutive words of the same type get grouped together.
 * This helps typography treatments lay out power phrases on their own lines.
 */
function groupIntoPhrases(classifiedWords) {
  if (classifiedWords.length === 0) return [];

  const groups = [];
  let currentGroup = {
    type: classifiedWords[0].type,
    words: [classifiedWords[0].word]
  };

  for (let i = 1; i < classifiedWords.length; i++) {
    const word = classifiedWords[i];
    if (word.type === currentGroup.type) {
      currentGroup.words.push(word.word);
    } else {
      groups.push(currentGroup);
      currentGroup = { type: word.type, words: [word.word] };
    }
  }
  groups.push(currentGroup);

  return groups;
}
