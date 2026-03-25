/**
 * Smart Word Emphasis Engine for P0
 *
 * Parses a sentence into three parts:
 *   before — leading connector words (small, italic)
 *   main   — the core power phrase (HUGE, bold)
 *   after  — trailing context (small, italic)
 *
 * Examples:
 *   "Ship the onboarding redesign"
 *     → before: ""  main: "Ship"  after: "the onboarding redesign"
 *
 *   "Have the hard conversation with the team"
 *     → before: "have the"  main: "hard conversation"  after: "with the team"
 */

const ACTION_VERBS = new Set([
  'ship', 'finish', 'launch', 'fix', 'start', 'close', 'nail', 'prep',
  'write', 'build', 'send', 'complete', 'submit', 'review', 'push',
  'deploy', 'present', 'draft', 'create', 'design', 'hire', 'fire',
  'kill', 'crush', 'solve', 'release', 'test', 'migrate', 'refactor',
  'scale', 'optimize', 'implement', 'deliver', 'execute', 'negotiate',
  'finalize', 'prepare', 'organize', 'schedule', 'restructure',
  'automate', 'prioritize', 'delegate', 'resolve', 'run', 'break',
  'clean', 'delete', 'remove', 'add', 'update', 'setup', 'configure',
  'debug', 'integrate', 'publish', 'announce', 'pitch', 'tackle',
  'decide', 'commit', 'win', 'land', 'wrap', 'secure', 'lock',
  'define', 'refine', 'polish', 'validate', 'prove', 'sign'
]);

const CONNECTORS = new Set([
  'the', 'a', 'an', 'for', 'with', 'to', 'and', 'or', 'of', 'in',
  'on', 'at', 'by', 'my', 'our', 'your', 'this', 'that', 'its',
  'i', 'me', 'we', 'they', 'he', 'she', 'it',
  'have', 'has', 'had', 'get', 'got', 'do', 'does', 'did',
  'make', 'take', 'keep', 'go', 'going', 'need', 'needs',
  'want', 'wants', 'be', 'been', 'being', 'is', 'are', 'was', 'were',
  'will', 'can', 'should', 'must', 'would', 'could',
  'but', 'so', 'if', 'then', 'up', 'about', 'into', 'through',
  'from', 'all', 'every', 'not', 'no', 'just', 'also', 'out',
  'really', 'very', 'some', 'more', 'most', 'than', 'when', 'while',
  'still', 'only', 'even', 'before', 'after', 'during', 'between',
  'over', 'under', 'as'
]);

function _cleanWord(w) {
  return w.toLowerCase().replace(/[^a-z'-]/g, '');
}

function parseEmphasis(sentence) {
  const words = sentence.trim().split(/\s+/).filter(Boolean);

  if (!words.length) return { before: '', main: '', after: '' };
  if (words.length <= 2) return { before: '', main: words.join(' '), after: '' };

  const isVerb = w => ACTION_VERBS.has(_cleanWord(w));
  const isConn = w => CONNECTORS.has(_cleanWord(w));

  // Case 1: first word is a strong action verb → it becomes the hero
  if (isVerb(words[0])) {
    return {
      before: '',
      main: words[0],
      after: words.slice(1).join(' ')
    };
  }

  // Case 2: find the longest consecutive run of non-connector words
  let bestStart = 0;
  let bestLen = 0;
  let runStart = -1;

  for (let i = 0; i <= words.length; i++) {
    if (i < words.length && !isConn(words[i])) {
      if (runStart === -1) runStart = i;
    } else {
      if (runStart !== -1) {
        const len = i - runStart;
        if (len > bestLen) {
          bestStart = runStart;
          bestLen = len;
        }
        runStart = -1;
      }
    }
  }

  // Fallback: if everything is connectors, just make it all main
  if (bestLen === 0) {
    return { before: '', main: words.join(' '), after: '' };
  }

  return {
    before: words.slice(0, bestStart).join(' '),
    main: words.slice(bestStart, bestStart + bestLen).join(' '),
    after: words.slice(bestStart + bestLen).join(' ')
  };
}
