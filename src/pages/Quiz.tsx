import { useState, useEffect } from "react";
import { motion } from "framer-motion";

type ImageQuestion = {
	id: number;
	image: string; // image URL or data URI
	answerCalories: number; // integer calories
	hint?: string;
};

const initialQuestions: ImageQuestion[] = [
	{ id: 1, image: 'https://kakduxyggmyilrovvvva.supabase.co/storage/v1/object/public/quiz_images/cheeseburger.avif', answerCalories: 313 },
	{ id: 2, image: 'https://kakduxyggmyilrovvvva.supabase.co/storage/v1/object/public/quiz_images/banana.png', answerCalories: 105 },
	{ id: 3, image: 'https://kakduxyggmyilrovvvva.supabase.co/storage/v1/object/public/quiz_images/spaghetti.jpg', answerCalories: 400 },
	{ id: 4, image: 'https://kakduxyggmyilrovvvva.supabase.co/storage/v1/object/public/quiz_images/almond.jpg', answerCalories: 165 },
	{ id: 5, image: 'https://kakduxyggmyilrovvvva.supabase.co/storage/v1/object/public/quiz_images/bagel.jpg', answerCalories: 350 },
	{ id: 6, image: 'https://kakduxyggmyilrovvvva.supabase.co/storage/v1/object/public/quiz_images/papajohns.webp', answerCalories: 320 },
	{ id: 7, image: 'https://kakduxyggmyilrovvvva.supabase.co/storage/v1/object/public/quiz_images/twoeggs.jpg', answerCalories: 180 },
	{ id: 8, image: 'https://kakduxyggmyilrovvvva.supabase.co/storage/v1/object/public/quiz_images/subway.png', answerCalories: 1000 },
	{ id: 9, image: 'https://kakduxyggmyilrovvvva.supabase.co/storage/v1/object/public/quiz_images/orange.jpg', answerCalories: 45 },
	{ id: 10, image: 'https://kakduxyggmyilrovvvva.supabase.co/storage/v1/object/public/quiz_images/chicken.jpg', answerCalories: 200 },
	{ id: 11, image: 'https://kakduxyggmyilrovvvva.supabase.co/storage/v1/object/public/quiz_images/cashews.jpeg', answerCalories: 160 },
	{ id: 12, image: 'https://kakduxyggmyilrovvvva.supabase.co/storage/v1/object/public/quiz_images/mozzerellasticks.jpg', answerCalories: 300 },
	{ id: 13, image: 'https://kakduxyggmyilrovvvva.supabase.co/storage/v1/object/public/quiz_images/pintoficecream.jpg', answerCalories: 1000 },
	{ id: 14, image: 'https://kakduxyggmyilrovvvva.supabase.co/storage/v1/object/public/quiz_images/cucumber.jpg', answerCalories: 20 },
	{ id: 15, image: 'https://kakduxyggmyilrovvvva.supabase.co/storage/v1/object/public/quiz_images/steak.jpg', answerCalories: 550 },
	{ id: 16, image: 'https://kakduxyggmyilrovvvva.supabase.co/storage/v1/object/public/quiz_images/pbandjsandwich.jpeg', answerCalories: 450 },
	{ id: 17, image: 'https://kakduxyggmyilrovvvva.supabase.co/storage/v1/object/public/quiz_images/peanutbutter.png', answerCalories: 190 },
	{ id: 18, image: 'https://kakduxyggmyilrovvvva.supabase.co/storage/v1/object/public/quiz_images/ramen.jpeg', answerCalories: 500 },
	{ id: 19, image: 'https://kakduxyggmyilrovvvva.supabase.co/storage/v1/object/public/quiz_images/fries.png', answerCalories: 365 },
	{ id: 20, image: 'https://kakduxyggmyilrovvvva.supabase.co/storage/v1/object/public/quiz_images/cupofrice.jpg', answerCalories: 205 },
	{ id: 21, image: 'https://kakduxyggmyilrovvvva.supabase.co/storage/v1/object/public/quiz_images/taco.webp', answerCalories: 250 },
	{ id: 22, image: 'https://kakduxyggmyilrovvvva.supabase.co/storage/v1/object/public/quiz_images/pancake.jpg', answerCalories: 520 },
	{ id: 23, image: 'https://kakduxyggmyilrovvvva.supabase.co/storage/v1/object/public/quiz_images/lays.jpg', answerCalories: 160 },
	{ id: 24, image: 'https://kakduxyggmyilrovvvva.supabase.co/storage/v1/object/public/quiz_images/salad.webp', answerCalories: 120 },
	{ id: 25, image: 'https://kakduxyggmyilrovvvva.supabase.co/storage/v1/object/public/quiz_images/nerds.webp', answerCalories: 200 },
	{ id: 26, image: 'https://kakduxyggmyilrovvvva.supabase.co/storage/v1/object/public/quiz_images/curry.jpg', answerCalories: 600 },
	{ id: 27, image: 'https://kakduxyggmyilrovvvva.supabase.co/storage/v1/object/public/quiz_images/ribs.jpg', answerCalories: 700 },
	{ id: 28, image: 'https://kakduxyggmyilrovvvva.supabase.co/storage/v1/object/public/quiz_images/panda.jpg', answerCalories: 350 },
	{ id: 29, image: 'https://kakduxyggmyilrovvvva.supabase.co/storage/v1/object/public/quiz_images/avocado.avif', answerCalories: 240 },
	{ id: 30, image: 'https://kakduxyggmyilrovvvva.supabase.co/storage/v1/object/public/quiz_images/grapes.png', answerCalories: 62 },
];

// Utility: shuffle and pick N unique questions
function shuffleArray<T>(arr: T[]): T[] {
	const a = arr.slice();
	for (let i = a.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[a[i], a[j]] = [a[j], a[i]];
	}
	return a;
}

function pickRandomQuestions(count: number): ImageQuestion[] {
	const shuffled = shuffleArray(initialQuestions);
	return shuffled.slice(0, Math.min(count, shuffled.length));
}

// Generate or load 3 disjoint sets of questions (10 each) and persist in localStorage
function getOrCreateQuizSets() {
	const key = 'quizSets';
	try {
		const raw = localStorage.getItem(key);
		if (raw) {
			const parsed = JSON.parse(raw) as number[][]; // arrays of IDs
			// validate
			if (Array.isArray(parsed) && parsed.length === 3) return parsed;
		}
	} catch (e) {
		// ignore and recreate
	}

	// create 3 disjoint sets
	const ids = initialQuestions.map((q) => q.id);
	const shuffled = shuffleArray(ids);
	const sets: number[][] = [[], [], []];
	for (let i = 0; i < 3; i++) {
		sets[i] = shuffled.slice(i * 10, i * 10 + 10);
	}
	try {
		localStorage.setItem(key, JSON.stringify(sets));
	} catch (e) {
		// ignore
	}
	return sets;
}


export default function Quiz(): JSX.Element {
	const [index, setIndex] = useState<number>(0);
	const [guess, setGuess] = useState<string>("");
	const [score, setScore] = useState<number>(0);
	const [completed, setCompleted] = useState<boolean>(false);
	const [started, setStarted] = useState<boolean>(false);
	const [quizMode, setQuizMode] = useState<1 | 2 | 3 | null>(null);
	const [aiFeedback, setAiFeedback] = useState<string | null>(null);
	const [answered, setAnswered] = useState<boolean>(false);
	const [loadingFeedback, setLoadingFeedback] = useState<boolean>(false);
	const [nextImageReady, setNextImageReady] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const [questions, setQuestions] = useState<ImageQuestion[]>(initialQuestions);

	// Load progress
	useEffect(() => {
		const saved = localStorage.getItem("calorieQuizProgress");
		if (saved) {
			try {
				const p = JSON.parse(saved);
				if (typeof p.index === "number") setIndex(p.index);
				if (typeof p.score === "number") setScore(p.score);
				if (typeof p.guess === "string") setGuess(p.guess);
			} catch (e) {
				// ignore
			}
		}
	}, []);

	useEffect(() => {
		localStorage.setItem(
			"calorieQuizProgress",
			JSON.stringify({ index, score, guess })
		);
	}, [index, score, guess]);

	const current = questions[index];

	// Helpers to read/write quiz completion state. Prefer userSession stored object, fallback to individual localStorage keys.
	function readQuizFlags() {
		try {
			const stored = localStorage.getItem('userSession');
			if (stored) {
				const u = JSON.parse(stored);
				return {
					quiz1: !!u.quiz1,
					quiz2: !!u.quiz2,
					quiz3: !!u.quiz3,
				};
			}
		} catch (e) {
			// ignore
		}
		// fallback to explicit keys
		return {
			quiz1: localStorage.getItem('quiz1Complete') === 'true',
			quiz2: localStorage.getItem('quiz2Complete') === 'true',
			quiz3: localStorage.getItem('quiz3Complete') === 'true',
		};
	}

	function writeQuizFlag(mode: 1 | 2 | 3) {
		// update userSession if exists
		try {
			const stored = localStorage.getItem('userSession');
			if (stored) {
				const u = JSON.parse(stored);
				if (mode === 1) u.quiz1 = true;
				if (mode === 2) u.quiz2 = true;
				if (mode === 3) u.quiz3 = true;
				localStorage.setItem('userSession', JSON.stringify(u));
			}
		} catch (e) {
			// ignore
		}
		// also set explicit keys
		if (mode === 1) localStorage.setItem('quiz1Complete', 'true');
		if (mode === 2) localStorage.setItem('quiz2Complete', 'true');
		if (mode === 3) localStorage.setItem('quiz3Complete', 'true');
	}

	// Ensure index is always within range if questions change or saved index is invalid
	useEffect(() => {
		if (index >= questions.length) {
			setIndex(Math.max(0, questions.length - 1));
		}
	}, [index, questions.length]);

	// No remote loading needed — questions initialized above

	const submitGuess = async () => {
		setError(null);
		const numeric = parseInt(guess, 10);
		if (Number.isNaN(numeric) || numeric <= 0) {
			setError("Please enter a valid calorie number");
			return;
		}

		// scoring: if within 10% -> full 10 points; otherwise 0 points
		const diff = Math.abs(numeric - current.answerCalories);
		const pct = diff / current.answerCalories;
		if (pct <= 0.1) {
			setScore((s) => s + 10);
		} else {
			// no points
		}

		// For quiz mode 2 (AI feedback) show feedback after submit and require user to press Next.
		if (quizMode === 2) {
			setAnswered(true);
			setLoadingFeedback(true);
			// while waiting for feedback, mark next image as not ready so user cannot advance too fast
			setNextImageReady(false);
			setAiFeedback(null);
			try {
				// try calling a server endpoint for AI feedback (if implemented). Fallback to simple heuristic message.
				const res = await fetch("/api/project", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ action: "aiFeedback", payload: { image: current.image, guess: numeric } }),
				});
				if (res.ok) {
					const data = await res.json();
					if (data?.feedback) setAiFeedback(String(data.feedback));
					else setAiFeedback(getHeuristicFeedback(pct, numeric, current.answerCalories));
				} else {
					setAiFeedback(getHeuristicFeedback(pct, numeric, current.answerCalories));
				}
			} catch (e) {
				setAiFeedback(getHeuristicFeedback(pct, numeric, current.answerCalories));
			} finally {
				setLoadingFeedback(false);
				// Preload the next image so the Next button only enables when it's ready
				const nextIdx = index + 1;
				if (nextIdx < questions.length) {
					const nextUrl = questions[nextIdx].image;
					const img = new Image();
					img.onload = () => setNextImageReady(true);
					img.onerror = () => setNextImageReady(true); // allow progression even on error
					img.src = nextUrl;
				} else {
					// last question, enable immediately
					setNextImageReady(true);
				}
			}
		} else {
			// next immediately for non-AI modes
			if (index < questions.length - 1) {
				setIndex((i) => i + 1);
				setGuess("");
			} else {
				finishQuiz();
			}
		}
	};

	// Called when user presses Next after seeing AI feedback
	const nextAfterFeedback = () => {
		setAnswered(false);
		setAiFeedback(null);
		setGuess("");
		if (index < questions.length - 1) {
			setIndex((i) => i + 1);
		} else {
			finishQuiz();
		}
	};

	function getHeuristicFeedback(pct: number, guess: number, actual: number) {
		if (pct <= 0.1) return `Great — your estimate of ${guess} is within 10% of the true value (${actual}).`;
		return `Your estimate of ${guess} differs from the true value (${actual}) by ${(pct * 100).toFixed(0)}%. Try to look for portion size cues.`;
	}

	const finishQuiz = () => {
		setCompleted(true);
		// mark this quiz as completed so next quiz unlocks
		if (quizMode) writeQuizFlag(quizMode);
		// mark quiz3 in userSession
		try {
			const storedUser = localStorage.getItem("userSession");
			if (storedUser) {
				const user = JSON.parse(storedUser);
				user.quiz3 = true;
				localStorage.setItem("userSession", JSON.stringify(user));
			}
		} catch (e) {
			// ignore
		}
		localStorage.removeItem("calorieQuizProgress");
	};



	const handleDone = () => {
		// Reset to start screen so user can pick quiz or exit
		setStarted(false);
		setQuizMode(null);
		setIndex(0);
		setGuess("");
		setScore(0);
		setCompleted(false);
		setAnswered(false);
		setAiFeedback(null);
		setQuestions(initialQuestions);
	};

	function startQuiz(mode: 1 | 2 | 3) {
		setQuizMode(mode);
		// ensure 3 disjoint sets exist and load the set for this mode
		const sets = getOrCreateQuizSets();
		const idsForMode = sets[mode - 1] || [];
		const picked = initialQuestions.filter((q) => idsForMode.includes(q.id));
		// fallback if sets are incomplete
		if (picked.length < 10) {
			const extra = pickRandomQuestions(10 - picked.length);
			setQuestions([...picked, ...extra]);
		} else {
			setQuestions(picked);
		}
		setIndex(0);
		setGuess("");
		setScore(0);
		setCompleted(false);
		setStarted(true);
		setAnswered(false);
		setAiFeedback(null);
	}

	return (
		<div className="min-h-screen bg-gray-900 text-white p-6">
			<div className="max-w-5xl mx-auto bg-gray-800 rounded-lg p-6 shadow-lg">
				<motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
					<h1 className="text-2xl font-bold mb-2">Calorie Guessing Quiz</h1>
				</motion.div>

				<div>
					{!started ? (
						<div className="text-center py-12">
							<h3 className="text-lg text-gray-200 mb-4">Choose quiz mode</h3>
							<div className="flex gap-3 justify-center mb-6">
								{(() => {
									const flags = readQuizFlags();
									return (
										<>
											<button onClick={() => startQuiz(1)} className="px-4 py-2 rounded-lg bg-gray-700 text-white cursor-pointer">Quiz 1 (Baseline)</button>
											<button onClick={() => startQuiz(2)} disabled={!flags.quiz1} className={`px-4 py-2 rounded-lg ${flags.quiz1 ? 'bg-blue-600 text-white cursor-pointer' : 'bg-gray-600 text-gray-400 cursor-not-allowed'}`}>Quiz 2 (AI feedback)</button>
											<button onClick={() => startQuiz(3)} disabled={!flags.quiz2} className={`px-4 py-2 rounded-lg ${flags.quiz2 ? 'bg-green-600 text-white cursor-pointer' : 'bg-gray-600 text-gray-400 cursor-not-allowed'}`}>Quiz 3 (Assessment)</button>
										</>
									);
								})()}
							</div>
							<p className="text-sm text-gray-400">Quiz 1 and 3 collect baseline and improvement scores. Quiz 2 gives AI feedback after each question.</p>
						</div>
					) : !completed ? (
						<div>
							{/* Fixed-height frame so input below doesn't shift when images differ */}
							<div className="bg-gray-700 rounded-lg overflow-hidden flex items-center justify-center p-4 h-[360px] sm:h-[480px] md:h-[640px] lg:h-[720px]">
								<img
									src={current.image}
									alt={`food-${current.id}`}
									className="max-h-full max-w-full object-contain"
								/>
							</div>

							<div className="mt-4 grid gap-4">
								<div className="flex items-center justify-between">
									<div className="text-lg font-semibold text-gray-200">Question {index + 1} of {questions.length}</div>
									<div className="text-lg font-semibold text-gray-200">Score: {score}/100</div>
								</div>

								<div>
									<label className="block text-sm font-medium mb-2">Your calorie estimate</label>
									<input
										type="text"
										inputMode="numeric"
										pattern="[0-9]*"
										value={guess}
										onChange={(e) => setGuess(e.target.value.replace(/[^0-9]/g, ''))}
										onKeyDown={(e) => {
										if (e.key === 'Enter') {
											e.preventDefault();
											// If user is viewing AI feedback (answered) in Quiz 2, Enter should act as "Next"
											if (answered && quizMode === 2) {
												// Only advance if feedback finished loading and next image is ready
												if (!loadingFeedback && nextImageReady) {
													nextAfterFeedback();
												}
												return;
											}
											// otherwise treat Enter as submit
											submitGuess();
										}
										}}
										className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
									/>
									{error && <div className="text-red-400 text-sm mt-2">{error}</div>}
								</div>

								<div className="flex gap-3">
									{!answered && <button onClick={submitGuess} className="ml-auto bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer">Submit</button>}
									{answered && quizMode === 2 && (
										<div className="ml-auto text-right">
											{loadingFeedback ? (
												<div className="text-sm text-gray-400">Loading feedback...</div>
											) : (
												<>
													{aiFeedback && <div className="text-left text-gray-200 mb-2">{aiFeedback}</div>}
													<button onClick={nextAfterFeedback} disabled={!nextImageReady} className={`px-4 py-2 rounded-lg ${nextImageReady ? 'bg-blue-600 text-white cursor-pointer' : 'bg-gray-600 text-gray-400 cursor-not-allowed'}`}>
														Next
													</button>
													{!nextImageReady && <div className="text-sm text-gray-400 mt-2">Preparing next image…</div>}
												</>
											)}
										</div>
									)}
								</div>
							</div>
						</div>
					) : (
						<motion.div key="complete" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="text-center space-y-4">
							<div className="bg-gray-700 p-6 rounded-lg">
								<h2 className="text-2xl font-bold">Quiz Complete</h2>
									<p className="text-gray-300 mt-2">Final Score: {score} / {questions.length * 10}</p>
							</div>

							<div className="flex justify-center">
								<button onClick={handleDone} className="bg-blue-600 px-6 py-3 rounded-lg text-white cursor-pointer">Done</button>
							</div>
						</motion.div>
					)}
				</div>
			</div>
		</div>
	);
}
