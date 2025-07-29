import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import BlogPost from "./BlogPost";

function App(): JSX.Element {
	const [email, setEmail] = useState<string>("");
	const [message, setMessage] = useState<string>("");
	const [loading, setLoading] = useState<boolean>(false);
	const [waitlistCount, setWaitlistCount] = useState<number | null>(null);
	const [currentPage, setCurrentPage] = useState<string>("home");

	// Check URL path on mount
	useEffect(() => {
		const path = window.location.pathname;
		if (path === "/blog/how-do-we-do-it") {
			setCurrentPage("blog");
		}
	}, []);

	// Handle navigation
	const navigateToHome = () => {
		window.history.pushState({}, "", "/");
		setCurrentPage("home");
	};

	const navigateToBlog = () => {
		window.history.pushState({}, "", "/blog/how-do-we-do-it");
		setCurrentPage("blog");
	};

	// Fetch waitlist count on mount
	useEffect(() => {
		const fetchCount = async () => {
			try {
				const res = await fetch("/api/waitlist", { method: "GET" });
				const data = await res.json();
				if (typeof data.count === "number") setWaitlistCount(data.count);
			} catch {
				setWaitlistCount(null);
			}
		};
		fetchCount();
	}, []);

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!email || !email.includes("@")) {
			setMessage("Please enter a valid email address.");
			return;
		}

		setLoading(true);
		try {
			const res = await fetch("/api/waitlist", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email }),
			});

			const data = await res.json();

			if (res.ok) {
				setMessage(
					`We've added ${email} to our waitlist. Thank you for your contribution! It helps us build credibility, raise funding, and bring in partners. If you know someone who’d care, please share it with them too.`
				);
				setEmail("");
			} else if (res.status === 409) {
				setMessage("This email is already on the waitlist. Thank you for your interest!");
			} else {
				setMessage(data.message || "Something went wrong.");
			}
			// Update count after submit (success or duplicate)
			if (typeof data.count === "number") setWaitlistCount(data.count);
		} catch (err) {
			setMessage("Network error. Please try again later.");
		} finally {
			setLoading(false);
		}
	};

	const handleEmailChange = (e: ChangeEvent<HTMLInputElement>): void => {
		setEmail(e.target.value);
	};

	if (currentPage === "blog") {
		return <BlogPost onNavigateHome={navigateToHome} />;
	}

	return (
		<div className="bg-[#0a0a0a] text-[#e2e2e2] min-h-screen flex flex-col font-sans">
			<div className="container mx-auto px-4">
				<header className="main-header py-6 border-b border-[#2a2a2a] flex justify-between items-center">
					<div className="logo flex items-center gap-3 text-xl font-semibold text-[#f2f2f2]">
						<svg
							width="28"
							height="28"
							viewBox="0 0 24 24"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M12 2L2 7L12 12L22 7L12 2Z"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
							<path
								d="M2 17L12 22L22 17"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
							<path
								d="M2 12L12 17L22 12"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						</svg>
						<span>NoPlace Games</span>
					</div>
				</header>

				<main className="hero flex-grow flex flex-col justify-center items-center text-center py-16 md:py-24">
					<div className="flex flex-col items-center w-full gap-8">
						<button
							onClick={navigateToBlog}
							className="bg-[#1c1c1c] border border-white text-[#c2c2c2] text-base py-2 px-6 rounded-full hover:border-[#f2f2f2] hover:text-white transition-all cursor-pointer"
						>
							Read how we're building a resilient payment system &rarr;
						</button>

						<h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-[#f2f2f2] leading-tight tracking-tighter">
							Where Games
							<br />
							<span className="highlight inline-block bg-[#ffe082] text-[#1a1a1a] py-1 px-4 rounded-lg transform -rotate-2 mt-2">
								Find Their Place
							</span>
						</h1>
						<p className="subtitle text-lg md:text-xl max-w-2xl leading-relaxed">
							A digital marketplace where creators sell freely and players own completely.
							<br />
							No censorship. No takedowns. Just games.
						</p>
						<form
							className="waitlist-form flex flex-col sm:flex-row gap-3 w-full max-w-md"
							onSubmit={handleSubmit}
						>
							<input
								type="email"
								placeholder="Enter your email"
								value={email}
								onChange={handleEmailChange}
								className="bg-[#1c1c1c] border border-[#2a2a2a] text-[#e2e2e2] py-3 px-4 rounded-lg text-base w-full focus:outline-none focus:border-[#f2f2f2] transition-colors"
								disabled={loading}
							/>
							<button
								type="submit"
								className="bg-white text-black py-3 px-6 rounded-lg font-medium text-base hover:bg-[#dcdcdc] focus:outline-none transition-colors whitespace-nowrap cursor-pointer flex items-center justify-center"
								disabled={loading}
							>
								{loading ? (
									<svg
										className="animate-spin mr-2 h-5 w-5 text-black"
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
									>
										<circle
											className="opacity-25"
											cx="12"
											cy="12"
											r="10"
											stroke="currentColor"
											strokeWidth="4"
										></circle>
										<path
											className="opacity-75"
											fill="currentColor"
											d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
										></path>
									</svg>
								) : null}
								{loading ? "Joining..." : "Join the Waitlist →"}
							</button>
						</form>
						{typeof waitlistCount === "number" && (
							<div className="flex items-center justify-center">
								<span
									className="inline-block w-3 h-3 rounded-full mr-2"
									style={{ backgroundColor: "#ffe082" }}
									aria-hidden="true"
								></span>
								<span className="text-[#ffe082] font-medium text-base">
									{waitlistCount} people have already joined
								</span>
							</div>
						)}
						{message && (
							<p className="form-message text-[#ffe082] text-sm mx-2 sm:mx-4 md:mx-auto max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
								{message}
							</p>
						)}
					</div>
				</main>

				<footer className="main-footer pt-12 pb-8 border-t border-[#2a2a2a] text-sm">
					<div className="footer-content flex flex-col md:flex-row justify-between gap-8 mb-8">
						<div className="footer-left md:max-w-xs flex flex-col gap-3">
							<div className="logo flex items-center gap-3 text-lg font-semibold text-[#f2f2f2]">
								<svg
									width="28"
									height="28"
									viewBox="0 0 24 24"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M12 2L2 7L12 12L22 7L12 2Z"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
									<path
										d="M2 17L12 22L22 17"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
									<path
										d="M2 12L12 17L22 12"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
								</svg>
								<span>NoPlace Games</span>
							</div>
							<p className="leading-relaxed">Every game deserves a place.</p>
							<p>&copy; 2025 NoPlace Games, All Rights Reserved</p>
						</div>
					</div>
				</footer>
			</div>
		</div>
	);
}

export default App;
