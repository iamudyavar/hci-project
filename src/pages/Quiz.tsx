import { useState, useEffect } from "react";
import { motion } from "framer-motion";

type ImageQuestion = {
	id: number;
	image: string; // image URL or data URI
	answerCalories: number; // integer calories
	hint?: string;
};

type QuizResultItem = {
	questionId: number;
	image: string;
	answerCalories: number;
	userGuess: number;
	correct: boolean; // within scoring threshold
	timeSeconds: number; // time taken to answer this question
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
	{ id: 28, image: 'https://kakduxyggmyilrovvvva.supabase.co/storage/v1/object/public/quiz_images/panda.jpg', answerCalories: 910 },
	{ id: 29, image: 'https://kakduxyggmyilrovvvva.supabase.co/storage/v1/object/public/quiz_images/avocado.avif', answerCalories: 240 },
	{ id: 30, image: 'https://kakduxyggmyilrovvvva.supabase.co/storage/v1/object/public/quiz_images/grapes.png', answerCalories: 62 },
];


// Get fixed sets of questions (same for all users) - 3 disjoint sets of 10 questions each
// Quiz 1: Questions 1-10 (IDs 1-10)
// Quiz 2: Questions 11-20 (IDs 11-20)
// Quiz 3: Questions 21-30 (IDs 21-30)
function getQuizSets() {
	// Fixed sets - all users get the same questions in the same order
	const allIds = initialQuestions.map((q) => q.id);
	const sets: number[][] = [[], [], []];
	
	// Divide the 30 questions into 3 sets of 10
	for (let i = 0; i < 3; i++) {
		sets[i] = allIds.slice(i * 10, i * 10 + 10);
	}
	
	return sets;
}


// Derive a human-friendly name from an image URL's filename
function getFoodNameFromUrl(url: string): string {
	try {
		let file = url;
		try {
			const u = new URL(url);
			file = u.pathname.split('/').pop() || url;
		} catch {
			file = url.split('/').pop() || url;
		}
		file = file.split('?')[0].split('#')[0];
		const base = file.replace(/\.[a-z0-9]+$/i, '');
		const cleaned = base.replace(/[-_]+/g, ' ').replace(/\s+/g, ' ').trim();
		if (!cleaned) return 'Item';
		// If there are already spaces, just title-case the words
		if (cleaned.includes(' ')) {
			return cleaned
				.split(' ')
				.map((w) => titleCaseWord(w))
				.join(' ');
		}
		// Otherwise, attempt to segment using known tokens from dataset
		const segmented = segmentKnownTokens(cleaned.toLowerCase());
		return segmented.map((t) => titleCaseWord(t)).join(' ');
	} catch {
		return 'Item';
	}
}

function titleCaseWord(w: string): string {
	const lower = w.toLowerCase();
	if (lower === 'of' || lower === 'and' || lower === 'with') return lower;
	if (lower === 'pb') return 'PB';
	if (lower === 'j') return 'J';
	return w ? w[0].toUpperCase() + w.slice(1).toLowerCase() : w;
}

function segmentKnownTokens(text: string): string[] {
	const tokens = [
		// keep common single tokens first to avoid over-splitting
		'cheeseburger', 'banana', 'spaghetti', 'almond', 'bagel', 'subway', 'orange', 'chicken', 'cashews',
		// handle misspelling in filename
		'mozzerella', 'mozzarella', 'sticks', 'pint', 'of', 'ice', 'cream', 'cucumber', 'steak', 'pb', 'and', 'j', 'sandwich',
		'peanut', 'butter', 'ramen', 'fries', 'cup', 'rice', 'taco', 'pancake', 'lays', 'salad', 'nerds', 'curry', 'ribs', 'panda', 'avocado', 'grapes',
		'papa', 'johns', 'pizza', 'slice', 'two', 'eggs'
	];

	const byLengthDesc = [...tokens].sort((a, b) => b.length - a.length);

	const result: string[] = [];
	let i = 0;
	while (i < text.length) {
		let matched = '';
		for (const tok of byLengthDesc) {
			if (text.startsWith(tok, i)) {
				matched = tok;
				break;
			}
		}
		if (matched) {
			result.push(matched);
			i += matched.length;
			continue;
		}
		// no token matched, accumulate a character until next match
		// group consecutive non-matching chars as one token to avoid spaces every char
		let j = i + 1;
		while (j < text.length) {
			if (byLengthDesc.some((t) => text.startsWith(t, j + 1 - t.length))) {
				break;
			}
			j++;
		}
		result.push(text.slice(i, j));
		i = j;
	}

	// collapse any tiny artifacts like empty strings
	return result.filter((t) => t.length > 0);
}


export default function Quiz(): JSX.Element {
	const [user] = useState<any>(() => {
		const storedUser = localStorage.getItem("userSession");
		return storedUser ? JSON.parse(storedUser) : null;
	});
	const [index, setIndex] = useState<number>(0);
	const [guess, setGuess] = useState<string>("");
	const [score, setScore] = useState<number>(0);
	const [scoreMax, setScoreMax] = useState<number>(10);
	const [completed, setCompleted] = useState<boolean>(false);
	const [started, setStarted] = useState<boolean>(false);
	const [quizMode, setQuizMode] = useState<1 | 2 | 3 | null>(null);
	const [aiFeedback, setAiFeedback] = useState<string | null>(null);
	const [answered, setAnswered] = useState<boolean>(false);
	const [loadingFeedback, setLoadingFeedback] = useState<boolean>(false);
	const [nextImageReady, setNextImageReady] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const [questions, setQuestions] = useState<ImageQuestion[]>(initialQuestions);
	const [results, setResults] = useState<QuizResultItem[]>([]);
	const [questionStartTime, setQuestionStartTime] = useState<number | null>(null);

	// Fetch quiz scores from Supabase on mount - this is the source of truth
	const [dbScores, setDbScores] = useState<any>(null);
	const [quizFlags, setQuizFlags] = useState<{ quiz1: boolean; quiz2: boolean; quiz3: boolean }>({
		quiz1: true,   // Quiz 1 is always unlocked
		quiz2: false,  // Quiz 2 locked until Quiz 1 is completed
		quiz3: false   // Quiz 3 locked until Quiz 2 is completed
	});

	// Fetch quiz data on mount and clean up old user data
	useEffect(() => {
		if (user?.id) {
			// Clean up all old quiz sets from localStorage (no longer needed with fixed sets)
			const keysToRemove: string[] = [];
			for (let i = 0; i < localStorage.length; i++) {
				const key = localStorage.key(i);
				if (key && key.startsWith('quizSets_')) {
					keysToRemove.push(key);
				}
			}
			keysToRemove.forEach(key => localStorage.removeItem(key));
			
			// Fetch fresh quiz data
			fetch('/api/project', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					action: 'getQuizScores',
					payload: { userId: user.id }
				})
			})
			.then(res => res.json())
			.then(data => {
				if (data.success) {
					console.log('[Quiz] Received quiz data:', data);
					if (data.scores) setDbScores(data.scores);
					if (data.quizFlags) {
						console.log('[Quiz] Setting quizFlags:', data.quizFlags);
						setQuizFlags(data.quizFlags);
					}
				}
			})
			.catch(err => console.error('Failed to fetch quiz scores:', err));
		}
	}, [user?.id]);

	const current = questions[index] || questions[0];

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

		// scoring: if within 10% -> +1 point; otherwise 0 points
		const diff = Math.abs(numeric - current.answerCalories);
		const pct = diff / current.answerCalories;
		if (pct <= 0.1) {
			setScore((s) => s + 1);
		} else {
			// no points
		}

		// Calculate time taken for this question
		const now = Date.now();
		const timeSeconds = questionStartTime ? (now - questionStartTime) / 1000 : 0;

		// record this question's result
		setResults((prev) => [
			...prev,
			{
				questionId: current.id,
				image: current.image,
				answerCalories: current.answerCalories,
				userGuess: numeric,
				correct: pct <= 0.1,
				timeSeconds,
			},
		]);

		// For quiz mode 2 (AI feedback) show feedback after submit and require user to press Next.
		if (quizMode === 2) {
			setAnswered(true);
			setLoadingFeedback(true);
			// while waiting for feedback, mark next image as not ready so user cannot advance too fast
			setNextImageReady(false);
			setAiFeedback(null);
			try {
				const res = await fetch("/api/project", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ action: "aiFeedback", payload: { image: current.image, guess: numeric, answerCalories: current.answerCalories } }),
				});
				if (res.ok) {
					const data = await res.json();
					if (data?.feedback) {
						setAiFeedback(String(data.feedback));
					} else {
						setAiFeedback("AI feedback unavailable.");
					}
				} else {
					setAiFeedback("AI feedback unavailable.");
				}
			} catch (e) {
				console.error("AI feedback error:", e);
				setAiFeedback("AI feedback unavailable.");
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
				setQuestionStartTime(Date.now()); // reset timer for next question
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
			setQuestionStartTime(Date.now()); // reset timer for next question
		} else {
			finishQuiz();
		}
	};

	const finishQuiz = async () => {
		setCompleted(true);
		
		const max = questions.length; // 1 point per correct, out of 10
		setScoreMax(max);
		
		// Update quiz3 flag in userSession for Upload page unlock
		if (quizMode === 3) {
			try {
				const storedUser = localStorage.getItem("userSession");
				if (storedUser) {
					const parsedUser = JSON.parse(storedUser);
					parsedUser.quiz3 = true;
					localStorage.setItem("userSession", JSON.stringify(parsedUser));
				}
			} catch (e) {
				// ignore
			}
		}

		// Save score to Supabase - this is the source of truth
		if (user?.id && quizMode && results.length > 0) {
			try {
				const totalTime = results.reduce((sum, r) => sum + r.timeSeconds, 0);
				const avgTime = totalTime / results.length;

				const response = await fetch('/api/project', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						action: 'saveQuizScore',
						payload: {
							userId: user.id,
							quizNumber: quizMode,
							score,
							avgTime,
							results
						}
					})
				});
				
				if (response.ok) {
					// Mark quiz as complete in users table
					await fetch('/api/project', {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({
							action: 'markQuizComplete',
							payload: {
								userId: user.id,
								quizNumber: quizMode
							}
						})
					});

					// Refresh database scores and flags after saving
					const scoresResponse = await fetch('/api/project', {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({
							action: 'getQuizScores',
							payload: { userId: user.id }
						})
					});
					const scoresData = await scoresResponse.json();
					if (scoresData.success) {
						if (scoresData.scores) setDbScores(scoresData.scores);
						if (scoresData.quizFlags) setQuizFlags(scoresData.quizFlags);
					}
				}
			} catch (err) {
				console.error('Failed to save quiz score to database:', err);
				// Don't block completion if save fails
			}
		}
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
		// If the quiz has already been completed (check database), show stored score instead of restarting
		if (dbScores) {
			const details = dbScores[`quiz${mode}_details`];
			const score = dbScores[`score${mode}`];
			
			if (details && typeof score === 'number') {
				// Reconstruct results from database
				const reconstructedResults = details.questions.map((q: any, idx: number) => ({
					questionId: q.questionId,
					image: initialQuestions.find(iq => iq.id === q.questionId)?.image || '',
					answerCalories: q.answerCalories,
					userGuess: q.userGuess,
					correct: details.correct[idx] === 1,
					timeSeconds: details.times[idx]
				}));
				
				// Reconstruct questions array from results
				const reconstructedQuestions = reconstructedResults
					.map((r: QuizResultItem) => initialQuestions.find((q) => q.id === r.questionId))
					.filter((q: ImageQuestion | undefined): q is ImageQuestion => q !== undefined);
				
				setScore(score);
				setScoreMax(10);
				setResults(reconstructedResults);
				setQuestions(reconstructedQuestions.length > 0 ? reconstructedQuestions : initialQuestions);
				setCompleted(true);
				setStarted(true);
				setAnswered(false);
				setAiFeedback(null);
				setGuess("");
				return; // show completion view
			}
		}

		// Get fixed sets of questions (same for all users)
		const sets = getQuizSets();
		const idsForMode = sets[mode - 1] || [];
		const picked = initialQuestions.filter((q) => idsForMode.includes(q.id));
		const finalQs = picked.length >= 10 ? picked : initialQuestions.slice(0, 10);
		setQuestions(finalQs);
		setScoreMax(finalQs.length);
		setIndex(0);
		setGuess("");
		setScore(0);
		setResults([]);
		setCompleted(false);
		setStarted(true);
		setAnswered(false);
		setAiFeedback(null);
		setQuestionStartTime(Date.now()); // start timer for first question
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
							<div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
								<button onClick={() => startQuiz(1)} className="px-4 py-2 rounded-lg bg-gray-700 text-white cursor-pointer">Quiz 1 (Baseline)</button>
								<button onClick={() => startQuiz(2)} disabled={!quizFlags.quiz1} className={`px-4 py-2 rounded-lg ${quizFlags.quiz1 ? 'bg-blue-600 text-white cursor-pointer' : 'bg-gray-600 text-gray-400 cursor-not-allowed'}`}>Quiz 2 (AI feedback)</button>
								<button onClick={() => startQuiz(3)} disabled={!quizFlags.quiz2} className={`px-4 py-2 rounded-lg ${quizFlags.quiz2 ? 'bg-green-600 text-white cursor-pointer' : 'bg-gray-600 text-gray-400 cursor-not-allowed'}`}>Quiz 3 (Assessment)</button>
							</div>
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
									<div className="text-lg font-semibold text-gray-200">Score: {score}/{scoreMax}</div>
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
								<p className="text-gray-300 mt-2">Final Score: {score} / {scoreMax}</p>
								{results.length > 0 && (() => {
									const totalTime = results.reduce((sum, r) => sum + r.timeSeconds, 0);
									const avgTime = (totalTime / results.length).toFixed(1);
									return <p className="text-gray-300 mt-2">Average Time: {avgTime}s</p>;
								})()}
							</div>

						{/* Per-question results list */}
						{results.length > 0 && (
							<div className="bg-gray-800 p-4 rounded-lg text-left">
								<h3 className="text-lg font-semibold mb-3">Your Answers</h3>
								<ul className="space-y-3">
									{results.map((r, i) => (
										<li key={`${r.questionId}-${i}`} className="flex items-center gap-4 bg-gray-700 rounded-md p-3">
											<img src={r.image} alt={`q${i + 1}`} className="w-20 h-20 object-cover rounded" />
											<div className="flex-1">
												<div className="flex items-center justify-between">
											<span className="text-gray-200 font-medium">{getFoodNameFromUrl(r.image)}</span>
													<span className={r.correct ? 'text-green-400' : 'text-red-400'}>{r.correct ? 'Correct' : 'Wrong'}</span>
												</div>
											<div className={`text-sm mt-1 ${r.correct ? 'text-green-400' : 'text-red-400'}`}>Your guess: {r.userGuess} cal</div>
											<div className="text-sm text-gray-400">Answer: {r.answerCalories} cal</div>
											<div className="text-sm text-gray-400">Time: {r.timeSeconds.toFixed(1)}s</div>
											</div>
										</li>
									))}
								</ul>
							</div>
						)}

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
