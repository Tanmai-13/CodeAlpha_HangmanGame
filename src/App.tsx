import { useState, useCallback } from 'react';
import { RotateCcw, Send, Gamepad2, Heart, Check, X, Eye } from 'lucide-react';

const WORDS = ['PYTHON', 'HANGMAN', 'PROGRAM', 'DEVELOPER', 'CODING'];
const MAX_WRONG = 6;

const HANGMAN_STAGES = [
  `   _____
  |     |
        |
        |
        |
        |
=========`,
  `   _____
  |     |
  O     |
        |
        |
        |
=========`,
  `   _____
  |     |
  O     |
  |     |
        |
        |
=========`,
  `   _____
  |     |
  O     |
 /|     |
        |
        |
=========`,
  `   _____
  |     |
  O     |
 /|\\\\   |
        |
        |
=========`,
  `   _____
  |     |
  O     |
 /|\\\\   |
 /      |
        |
=========`,
  `   _____
  |     |
  O     |
 /|\\\\   |
 / \\\\   |
        |
=========`,
];

type GameStatus = 'playing' | 'won' | 'lost' | 'revealed';

function pickRandomWord(): string {
  return WORDS[Math.floor(Math.random() * WORDS.length)];
}

export default function App() {
  const [word, setWord] = useState<string>(() => pickRandomWord());
  const [guessedLetters, setGuessedLetters] = useState<Set<string>>(new Set());
  const [wrongGuesses, setWrongGuesses] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'info' | 'success' | 'error'>('info');
  const [revealed, setRevealed] = useState(false);

  const wrongCount = wrongGuesses.length;

  const status: GameStatus = revealed
    ? 'revealed'
    : wrongCount >= MAX_WRONG
    ? 'lost'
    : word.split('').every((l) => guessedLetters.has(l))
    ? 'won'
    : 'playing';

  // When revealed or lost, show the full word instead of underscores
  const showFullWord = status === 'lost' || status === 'revealed';

  const displayWord = word
    .split('')
    .map((letter) => (showFullWord || guessedLetters.has(letter) ? letter : '_'))
    .join(' ');

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (status !== 'playing') return;

      const guess = input.trim().toUpperCase();

      if (guess === '') {
        setMessage('Please enter a letter.');
        setMessageType('error');
        return;
      }
      if (guess.length !== 1) {
        setMessage('Please enter only ONE letter.');
        setMessageType('error');
        return;
      }
      if (!/^[A-Z]$/.test(guess)) {
        setMessage('Only letters A-Z are allowed.');
        setMessageType('error');
        return;
      }
      if (guessedLetters.has(guess)) {
        setMessage(`You already guessed "${guess}". Try a different letter.`);
        setMessageType('info');
        return;
      }

      setInput('');
      const newGuessed = new Set(guessedLetters);
      newGuessed.add(guess);
      setGuessedLetters(newGuessed);

      if (word.includes(guess)) {
        setMessage(`Nice! "${guess}" is in the word.`);
        setMessageType('success');
      } else {
        setMessage(`Sorry, "${guess}" is not in the word.`);
        setMessageType('error');
        setWrongGuesses([...wrongGuesses, guess]);
      }
    },
    [input, status, guessedLetters, word, wrongGuesses]
  );

  const handleReveal = useCallback(() => {
    if (status !== 'playing') return;
    setRevealed(true);
    setMessage('');
    setMessageType('info');
  }, [status]);

  const handleNewGame = useCallback(() => {
    setWord(pickRandomWord());
    setGuessedLetters(new Set());
    setWrongGuesses([]);
    setInput('');
    setMessage('');
    setMessageType('info');
    setRevealed(false);
  }, []);

  const messageStyles: Record<string, string> = {
    info: 'bg-slate-700/50 text-slate-200 border-slate-600',
    success: 'bg-emerald-900/40 text-emerald-300 border-emerald-700/50',
    error: 'bg-red-900/40 text-red-300 border-red-700/50',
  };

  const inputDisabled = status !== 'playing';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex flex-col items-center px-4 py-8 sm:py-12">
      {/* Header */}
      <header className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-2">
          <Gamepad2 className="w-8 h-8 text-cyan-400" />
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Hangman Game</h1>
        </div>
        <p className="text-slate-400 text-sm sm:text-base">
          CodeAlpha Python Programming Internship &mdash; Task 1
        </p>
      </header>

      <div className="w-full max-w-2xl flex flex-col gap-6">
        {/* Status banners */}
        {status === 'won' && (
          <div className="bg-emerald-900/40 border border-emerald-600/50 rounded-xl px-6 py-4 text-center animate-pulse">
            <p className="text-2xl font-bold text-emerald-300">YOU WIN!</p>
            <p className="text-slate-300 mt-1">
              The word was <span className="font-bold text-emerald-400">{word}</span> &mdash;{' '}
              {wrongCount} wrong guess{wrongCount !== 1 ? 'es' : ''}.
            </p>
          </div>
        )}
        {status === 'lost' && (
          <div className="bg-red-900/40 border border-red-600/50 rounded-xl px-6 py-4 text-center">
            <p className="text-2xl font-bold text-red-300">GAME OVER</p>
            <p className="text-slate-300 mt-1">
              The word was <span className="font-bold text-red-400">{word}</span>. Better luck next time!
            </p>
          </div>
        )}
        {status === 'revealed' && (
          <div className="bg-amber-900/40 border border-amber-600/50 rounded-xl px-6 py-4 text-center">
            <p className="text-xl font-bold text-amber-300">Word Revealed</p>
            <p className="text-slate-300 mt-1">
              The word was <span className="font-bold text-amber-400">{word}</span>.
            </p>
            <p className="text-amber-200 text-sm mt-2">The word was revealed. Try a new game!</p>
          </div>
        )}

        {/* Main game card */}
        <div className="bg-slate-800/60 backdrop-blur border border-slate-700 rounded-2xl p-6 sm:p-8 shadow-2xl">
          {/* Hangman art + lives */}
          <div className="grid sm:grid-cols-2 gap-6 items-center">
            <div className="flex justify-center">
              <pre className="font-mono text-sm sm:text-base text-cyan-400 leading-tight whitespace-pre">
                {HANGMAN_STAGES[wrongCount]}
              </pre>
            </div>
            <div className="flex flex-col items-center gap-3">
              <div className="flex items-center gap-1.5">
                {Array.from({ length: MAX_WRONG }).map((_, i) => (
                  <Heart
                    key={i}
                    className={`w-5 h-5 transition-all duration-300 ${
                      i < MAX_WRONG - wrongCount
                        ? 'text-red-400 fill-red-400'
                        : 'text-slate-700 fill-slate-700'
                    }`}
                  />
                ))}
              </div>
              <p className="text-slate-400 text-sm">
                Remaining attempts:{' '}
                <span className="text-white font-bold text-base">
                  {MAX_WRONG - wrongCount}
                </span>
              </p>
            </div>
          </div>

          {/* Word display */}
          <div className="mt-8 text-center">
            <p className="text-slate-500 text-xs uppercase tracking-widest mb-3">Word</p>
            <p
              className={`font-mono text-3xl sm:text-4xl font-bold tracking-[0.3em] transition-colors ${
                showFullWord ? 'text-amber-400' : 'text-white'
              }`}
              aria-label="Current word progress"
            >
              {displayWord}
            </p>
          </div>

          {/* Wrong guesses */}
          <div className="mt-6 text-center">
            <p className="text-slate-500 text-xs uppercase tracking-widest mb-2">
              Wrong guesses
            </p>
            {wrongGuesses.length > 0 ? (
              <div className="flex flex-wrap justify-center gap-2">
                {wrongGuesses.map((letter) => (
                  <span
                    key={letter}
                    className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-red-900/40 border border-red-700/40 text-red-300 font-bold text-sm"
                  >
                    {letter}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-slate-600 text-sm italic">None yet</p>
            )}
          </div>

          {/* All guessed letters */}
          <div className="mt-4 text-center">
            <p className="text-slate-500 text-xs uppercase tracking-widest mb-2">
              All guessed letters
            </p>
            {guessedLetters.size > 0 ? (
              <div className="flex flex-wrap justify-center gap-1.5">
                {Array.from(guessedLetters).sort().map((letter) => (
                  <span
                    key={letter}
                    className={`inline-flex items-center justify-center w-7 h-7 rounded-md font-bold text-xs ${
                      word.includes(letter)
                        ? 'bg-emerald-900/40 text-emerald-300 border border-emerald-700/40'
                        : 'bg-slate-700 text-slate-400 border border-slate-600'
                    }`}
                  >
                    {letter}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-slate-600 text-sm italic">No guesses yet</p>
            )}
          </div>

          {/* Validation message */}
          {message && status === 'playing' && (
            <div
              className={`mt-6 rounded-lg px-4 py-3 text-center text-sm border ${messageStyles[messageType]}`}
            >
              {message}
            </div>
          )}

          {/* Input form */}
          <form onSubmit={handleSubmit} className="mt-6 flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              maxLength={1}
              placeholder="Enter a letter..."
              disabled={inputDisabled}
              className={`flex-1 bg-slate-900/60 border rounded-xl px-4 py-3 text-white text-lg text-center uppercase font-mono transition-all ${
                inputDisabled
                  ? 'border-slate-700 text-slate-600 cursor-not-allowed opacity-50'
                  : 'border-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent'
              }`}
            />
            <button
              type="submit"
              disabled={inputDisabled}
              className={`inline-flex items-center gap-2 font-bold px-6 py-3 rounded-xl transition-all ${
                inputDisabled
                  ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                  : 'bg-cyan-500 hover:bg-cyan-400 active:scale-95 text-slate-900'
              }`}
            >
              <Send className="w-5 h-5" />
              <span className="hidden sm:inline">Guess</span>
            </button>
          </form>

          {/* Reveal Word button */}
          {status === 'playing' ? (
            <button
              onClick={handleReveal}
              className="mt-3 w-full inline-flex items-center justify-center gap-2 bg-amber-600/80 hover:bg-amber-500 active:scale-95 text-white font-semibold px-6 py-3 rounded-xl transition-all border border-amber-500/50"
            >
              <Eye className="w-5 h-5" />
              Reveal Word
            </button>
          ) : (
            <div className="mt-3 flex items-center justify-center gap-2 text-slate-300">
              {status === 'won' ? (
                <>
                  <Check className="w-5 h-5 text-emerald-400" />
                  <span>Game complete! Start a new game below.</span>
                </>
              ) : (
                <>
                  <X className="w-5 h-5 text-red-400" />
                  <span>Round over! Start a new game below.</span>
                </>
              )}
            </div>
          )}
        </div>

        {/* New Game / Restart button */}
        <button
          onClick={handleNewGame}
          className="inline-flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 active:scale-95 text-white font-semibold px-6 py-3 rounded-xl transition-all w-full border border-slate-600"
        >
          <RotateCcw className="w-5 h-5" />
          {status === 'playing' ? 'Restart Game' : 'New Game'}
        </button>
      </div>

      <footer className="mt-10 text-center text-slate-600 text-xs">
        Built with Python logic concepts: random, while loop, if-else, strings &amp; lists
      </footer>
    </div>
  );
}
