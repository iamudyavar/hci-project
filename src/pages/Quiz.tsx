import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

type ImageQuestion = {
	id: number;
	image: string; // image URL or data URI
	answerCalories: number; // integer calories
	hint?: string;
};

// Single cheeseburger question (direct URL)

export default function Quiz(): JSX.Element {
	const [index, setIndex] = useState<number>(0);
	const [guess, setGuess] = useState<string>("");
	const [score, setScore] = useState<number>(0);
	const [completed, setCompleted] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const [questions, setQuestions] = useState<ImageQuestion[]>([
		{ id: 1, image: 'https://kakduxyggmyilrovvvva.supabase.co/storage/v1/object/public/quiz_images/cheeseburger.avif', answerCalories: 313 }
	]);
	const navigate = useNavigate();

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

	// No remote loading needed — questions initialized above

	const submitGuess = () => {
		setError(null);
		const numeric = parseInt(guess, 10);
		if (Number.isNaN(numeric) || numeric <= 0) {
			setError("Please enter a valid calorie number");
			return;
		}

		// scoring: within 10% -> full point, within 20% -> 0.5 point
		const diff = Math.abs(numeric - current.answerCalories);
		const pct = diff / current.answerCalories;
		if (pct <= 0.1) {
			setScore((s) => s + 1);
		} else if (pct <= 0.2) {
			setScore((s) => s + 0.5);
		}

		// next
		if (index < questions.length - 1) {
			setIndex((i) => i + 1);
			setGuess("");
		} else {
			finishQuiz();
		}
	};

	const finishQuiz = () => {
		setCompleted(true);
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

	const restart = () => {
		setIndex(0);
		setGuess("");
		setScore(0);
		setCompleted(false);
		setError(null);
		localStorage.removeItem("calorieQuizProgress");
		// re-initialize questions to ensure setter is used and quiz restarts
		setQuestions([{ id: 1, image: 'https://kakduxyggmyilrovvvva.supabase.co/storage/v1/object/public/quiz_images/cheeseburger.avif', answerCalories: 313 }]);
	};

	return (
		<div className="min-h-screen bg-gray-900 text-white p-6">
			<div className="max-w-5xl mx-auto bg-gray-800 rounded-lg p-6 shadow-lg">
				<motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
					<h1 className="text-2xl font-bold mb-2">Calorie Guessing Quiz</h1>
					<p className="text-gray-300 mb-4">Guess the calories for each food image. Score increases for closer estimates.</p>
				</motion.div>

				<div>
					<AnimatePresence mode="wait">
						{!completed ? (
							<motion.div key={`img-${index}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
								<div className="bg-gray-700 rounded-lg overflow-hidden flex items-center justify-center p-4">
									{/* Bigger, responsive image: allow larger max-height on bigger screens */}
									<img
										src={current.image}
										alt={`food-${current.id}`}
										className="w-full h-auto max-h-[360px] sm:max-h-[480px] md:max-h-[640px] lg:max-h-[720px] object-contain"
									/>
								</div>

								<div className="mt-4 grid gap-4">
									<div className="flex items-center justify-between">
										<div className="text-sm text-gray-400">Question {index + 1} of {questions.length}</div>
										<div className="text-sm text-gray-400">Score: {score}</div>
									</div>

									<div>
										<label className="block text-sm font-medium mb-2">Your calorie estimate</label>
										<input
											type="text"
											inputMode="numeric"
											pattern="[0-9]*"
											value={guess}
											onChange={(e) => setGuess(e.target.value.replace(/[^0-9]/g, ''))}
											placeholder="e.g. 450"
											className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
										/>
										{error && <div className="text-red-400 text-sm mt-2">{error}</div>}
									</div>

									<div className="flex gap-3">
										<button onClick={submitGuess} className="ml-auto bg-blue-600 text-white px-4 py-2 rounded-lg">Submit</button>
										<button onClick={() => { setGuess(""); setError(null); }} className="bg-gray-600 text-white px-4 py-2 rounded-lg">Clear</button>
									</div>
								</div>
							</motion.div>
						) : (
							<motion.div key="complete" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="text-center space-y-4">
								<div className="bg-gray-700 p-6 rounded-lg">
									<h2 className="text-2xl font-bold">Quiz Complete</h2>
										  <p className="text-gray-300 mt-2">Final Score: {score} / {questions.length}</p>
								</div>

								<div className="flex justify-center gap-3">
									<button onClick={() => navigate('/')} className="bg-green-600 px-4 py-2 rounded-lg text-white">Back to Home</button>
									<button onClick={restart} className="bg-gray-600 px-4 py-2 rounded-lg text-white">Retry Quiz</button>
								</div>
							</motion.div>
						)}
					</AnimatePresence>
				</div>
			</div>
		</div>
	);
}
