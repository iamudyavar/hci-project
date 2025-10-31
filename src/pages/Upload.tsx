import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NavLink } from "react-router-dom";

// Types for our components
interface NutritionalInfo {
	food: string;
	confidence: string;
	calories: number;
	macros: {
		protein: number;
		carbs: number;
		fat: number;
		fiber?: number;
	};
	details: string;
	healthRating: string;
	ingredients?: string[];
	servingSize?: string;
	nutritionalHighlights?: string;
}

export default function Upload() {
	const [user] = useState(() => {
		const storedUser = localStorage.getItem("userSession");
		return storedUser ? JSON.parse(storedUser) : null;
	});

	const [selectedImage, setSelectedImage] = useState<string | null>(null);
	const [imageFile, setImageFile] = useState<File | null>(null);
	const [userGuess, setUserGuess] = useState<string>("");
	const [aiPrediction, setAiPrediction] = useState<NutritionalInfo | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			setImageFile(file);
			const reader = new FileReader();
			reader.onload = (e) => {
				setSelectedImage(e.target?.result as string);
			};
			reader.readAsDataURL(file);
			setAiPrediction(null);
			setUserGuess("");
		}
	};

	const analyzeImage = async () => {
		if (!imageFile || !selectedImage) {
			setError("No image selected");
			return;
		}

		setLoading(true);
		setError(null);

		try {
			console.log("Analyzing image...");

			// Convert file to base64
			const base64Data = selectedImage.split(',')[1]; // Remove data:image/jpeg;base64, prefix
			const mimeType = imageFile.type;

			const numericUserGuess = userGuess !== "" ? Number(userGuess) : null;

			const response = await fetch('/api/project', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					action: 'analyzeFood',
					payload: {
						imageData: base64Data,
						mimeType: mimeType,
						userId: user?.id || null,
						userGuess: numericUserGuess
					}
				})
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.message || 'Analysis failed');
			}

			if (data.success && data.analysis) {
				setAiPrediction(data.analysis);
				console.log("Analysis completed:", data.analysis);
			} else {
				throw new Error('Invalid response format');
			}

		} catch (err: any) {
			console.error('Analysis failed:', err);
			setError(`Analysis failed: ${err.message || 'Unknown error occurred'}`);
		} finally {
			setLoading(false);
		}
	};

	const resetUpload = () => {
		setSelectedImage(null);
		setImageFile(null);
		setUserGuess("");
		setAiPrediction(null);
		setError(null);
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	};

	// Check if user has completed quiz3
	const canUpload = user?.quiz3;

	if (!canUpload) {
		return (
			<div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					className="text-center text-white max-w-md"
				>
					<h2 className="text-2xl font-bold mb-4">Upload Locked</h2>
					<p className="text-gray-300 mb-6">
						Please complete all three quizzes before you can upload food images.
					</p>
					<motion.div
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						className="inline-block"
					>
						<NavLink
							to="/quiz"
							className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors inline-block"
						>
							Take Quiz
						</NavLink>
					</motion.div>
				</motion.div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-900 text-white p-4">
			<div className="max-w-6xl mx-auto">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					className="text-center mb-8"
				>
					<h1 className="text-3xl font-bold mb-2">AI Nutrition Analyzer</h1>
					<p className="text-gray-300">
						Upload a food image and get detailed nutritional analysis from AI
					</p>
				</motion.div>

				{error && (
					<div className="bg-red-900 border border-red-700 text-red-100 p-4 rounded-lg mb-6">
						{error}
					</div>
				)}

				<div className="grid gap-8 lg:grid-cols-2">
					{/* Upload Section */}
					<motion.div
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						className="bg-gray-800 p-6 rounded-lg"
					>
						<h2 className="text-xl font-bold mb-4">Upload Food Image</h2>

						<div className="space-y-4">
							<div>
								<input
									ref={fileInputRef}
									type="file"
									accept="image/*"
									onChange={handleImageUpload}
									className="hidden"
									id="image-upload"
								/>
								<label
									htmlFor="image-upload"
									className="block w-full p-6 border-2 border-dashed border-gray-600 rounded-lg text-center cursor-pointer hover:border-blue-500 transition-colors"
								>
									<span className="text-3xl mb-3 block">🍽️</span>
									<span className="text-lg">Click to select food image</span>
									<p className="text-sm text-gray-400 mt-2">JPG, PNG, or WebP images supported</p>
								</label>
							</div>

							{selectedImage && (
								<div className="space-y-4">
									<div className="relative">
										<img
											src={selectedImage}
											alt="Selected food"
											className="w-full max-w-md mx-auto rounded-lg shadow-lg"
										/>
									</div>

									<div>
										<label className="block text-sm font-medium mb-2">
											Your calorie estimate:
										</label>
										<input
											type="number"
											value={userGuess}
											onChange={(e) => setUserGuess(e.target.value)}
											placeholder="Enter your guess"
											className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
										/>
									</div>

									<div className="flex gap-3">
										<motion.button
											whileHover={{ scale: 1.05 }}
											whileTap={{ scale: 0.95 }}
											onClick={analyzeImage}
											disabled={loading}
											className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
										>
											{loading ? (
												<>
													<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
													Analyzing...
												</>
											) : (
												<>
													🤖 Analyze Nutrition
												</>
											)}
										</motion.button>
										<motion.button
											whileHover={{ scale: 1.05 }}
											whileTap={{ scale: 0.95 }}
											onClick={resetUpload}
											className="bg-gray-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-700 transition-colors"
										>
											Reset
										</motion.button>
									</div>
								</div>
							)}
						</div>
					</motion.div>

					{/* Results Section */}
					<motion.div
						initial={{ opacity: 0, x: 20 }}
						animate={{ opacity: 1, x: 0 }}
						className="bg-gray-800 p-6 rounded-lg"
					>
						<h2 className="text-xl font-bold mb-4">Nutritional Analysis</h2>

						<AnimatePresence mode="wait">
							{!selectedImage && (
								<motion.div
									key="no-image"
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0 }}
									className="text-center py-12 text-gray-400"
								>
									<span className="text-4xl mb-4 block">📊</span>
									<p className="text-lg">Upload an image to see detailed nutritional analysis</p>
									<p className="text-sm mt-2">Powered by Google Gemini</p>
								</motion.div>
							)}

							{selectedImage && !aiPrediction && !loading && (
								<motion.div
									key="waiting"
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0 }}
									className="text-center py-12 text-gray-400"
								>
									<span className="text-4xl mb-4 block">🎯</span>
									<p className="text-lg">Click "Analyze Nutrition" to get started</p>
									<p className="text-sm mt-2">AI will analyze ingredients, calories, and macros</p>
								</motion.div>
							)}

							{loading && (
								<motion.div
									key="loading"
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0 }}
									className="text-center py-12"
								>
									<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
									<p className="text-gray-300 text-lg">Analyzing nutrition...</p>
									<p className="text-sm text-gray-400 mt-2">Using advanced AI to identify ingredients and calculate nutrients</p>
								</motion.div>
							)}

							{aiPrediction && (
								<motion.div
									key="results"
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0 }}
									className="space-y-4"
								>
									{/* Main Food Info */}
									<div className="bg-gray-700 p-4 rounded-lg">
										<h3 className="font-semibold mb-3 text-lg">Food Identification</h3>
										<div className="space-y-2">
											<p>
												<span className="font-medium">Detected:</span>{" "}
												<span className="text-blue-400 font-semibold">{aiPrediction.food}</span>
											</p>
											<p>
												<span className="font-medium">Confidence:</span>{" "}
												<span className={`font-medium ${aiPrediction.confidence === 'High' ? 'text-green-400' :
													aiPrediction.confidence === 'Medium' ? 'text-yellow-400' : 'text-orange-400'
													}`}>
													{aiPrediction.confidence}
												</span>
											</p>
											{aiPrediction.servingSize && (
												<p>
													<span className="font-medium">Serving Size:</span>{" "}
													<span className="text-gray-300">{aiPrediction.servingSize}</span>
												</p>
											)}
										</div>
									</div>

									{/* Calories */}
									<div className="bg-gray-700 p-4 rounded-lg">
										<h3 className="font-semibold mb-3 text-lg">Calorie Information</h3>
										<div className="text-center">
											<span className="text-4xl font-bold text-yellow-400">{aiPrediction.calories}</span>
											<span className="text-lg text-gray-300 ml-2">calories</span>
										</div>

										{userGuess && (
											<div className="mt-4 p-3 bg-gray-600 rounded-lg">
												<div className="flex justify-between items-center">
													<span className="text-sm">Your Guess:</span>
													<span className="font-semibold text-purple-400">{userGuess} cal</span>
												</div>
												<div className="flex justify-between items-center mt-2">
													<span className="text-sm">Difference:</span>
													<span className={`font-semibold ${Math.abs(parseInt(userGuess) - aiPrediction.calories) <= 50 ? 'text-green-400' : 'text-red-400'
														}`}>
														{Math.abs(parseInt(userGuess) - aiPrediction.calories)} cal
													</span>
												</div>
												<div className="mt-2 text-xs text-gray-400">
													{Math.abs(parseInt(userGuess) - aiPrediction.calories) <= 20
														? "🎯 Excellent estimate!"
														: Math.abs(parseInt(userGuess) - aiPrediction.calories) <= 50
															? "👍 Good estimate!"
															: "📚 Keep practicing!"}
												</div>
											</div>
										)}
									</div>

									{/* Macronutrients */}
									<div className="bg-gray-700 p-4 rounded-lg">
										<h3 className="font-semibold mb-3 text-lg">Macronutrients</h3>
										<div className="grid grid-cols-2 gap-4">
											<div className="text-center p-3 bg-gray-600 rounded-lg">
												<div className="text-2xl font-bold text-red-400">{aiPrediction.macros.protein}g</div>
												<div className="text-sm text-gray-300">Protein</div>
											</div>
											<div className="text-center p-3 bg-gray-600 rounded-lg">
												<div className="text-2xl font-bold text-blue-400">{aiPrediction.macros.carbs}g</div>
												<div className="text-sm text-gray-300">Carbs</div>
											</div>
											<div className="text-center p-3 bg-gray-600 rounded-lg">
												<div className="text-2xl font-bold text-green-400">{aiPrediction.macros.fat}g</div>
												<div className="text-sm text-gray-300">Fat</div>
											</div>
											{aiPrediction.macros.fiber && (
												<div className="text-center p-3 bg-gray-600 rounded-lg">
													<div className="text-2xl font-bold text-orange-400">{aiPrediction.macros.fiber}g</div>
													<div className="text-sm text-gray-300">Fiber</div>
												</div>
											)}
										</div>
									</div>

									{/* Health Rating */}
									<div className="bg-gray-700 p-4 rounded-lg">
										<h3 className="font-semibold mb-3 text-lg">Health Assessment</h3>
										<div className={`p-3 rounded-lg ${aiPrediction.healthRating.toLowerCase().includes('excellent') ? 'bg-green-900 border border-green-600' :
											aiPrediction.healthRating.toLowerCase().includes('good') ? 'bg-blue-900 border border-blue-600' :
												aiPrediction.healthRating.toLowerCase().includes('fair') ? 'bg-yellow-900 border border-yellow-600' :
													'bg-red-900 border border-red-600'
											}`}>
											<p className="text-sm">{aiPrediction.healthRating}</p>
										</div>
									</div>

									{/* Nutritional Highlights */}
									{aiPrediction.nutritionalHighlights && (
										<div className="bg-gray-700 p-4 rounded-lg">
											<h3 className="font-semibold mb-3 text-lg">Nutritional Highlights</h3>
											<p className="text-sm text-green-300">{aiPrediction.nutritionalHighlights}</p>
										</div>
									)}

									{/* Ingredients */}
									{aiPrediction.ingredients && aiPrediction.ingredients.length > 0 && (
										<div className="bg-gray-700 p-4 rounded-lg">
											<h3 className="font-semibold mb-3 text-lg">Detected Ingredients</h3>
											<div className="flex flex-wrap gap-2">
												{aiPrediction.ingredients.map((ingredient, index) => (
													<span
														key={index}
														className="px-3 py-1 bg-blue-900 text-blue-200 rounded-full text-sm"
													>
														{ingredient}
													</span>
												))}
											</div>
										</div>
									)}

									{/* Detailed Analysis */}
									<div className="bg-gray-700 p-4 rounded-lg">
										<h3 className="font-semibold mb-3 text-lg">Detailed Analysis</h3>
										<p className="text-sm text-gray-300 leading-relaxed">{aiPrediction.details}</p>
									</div>

									<div className="text-xs text-gray-500 bg-gray-700 p-3 rounded-lg border-l-4 border-blue-500">
										<p className="mb-1">
											<strong>AI Analysis:</strong> Results generated by Google Gemini AI based on visual analysis.
										</p>
										<p>Nutritional values are estimates. Actual values may vary based on preparation methods, portion sizes, and specific ingredients used.</p>
									</div>
								</motion.div>
							)}
						</AnimatePresence>
					</motion.div>
				</div>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.5 }}
					className="mt-8 text-center"
				>
					<motion.a
						href="/"
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						className="inline-block bg-gray-700 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-600 transition-colors"
					>
						← Back to Home
					</motion.a>
				</motion.div>
			</div>
		</div>
	);
}