import { useState, FormEvent, ChangeEvent } from "react";

function App(): JSX.Element {
	const [email, setEmail] = useState<string>("");
	const [message, setMessage] = useState<string>("");

	const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
		e.preventDefault();
		if (email && email.includes("@")) {
			console.log(`Email submitted: ${email}`);
			setMessage(`Thank you! We've added ${email} to our waitlist.`);
			setEmail("");
		} else {
			setMessage("Please enter a valid email address.");
		}
	};

	const handleEmailChange = (e: ChangeEvent<HTMLInputElement>): void => {
		setEmail(e.target.value);
	};

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
					<h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-[#f2f2f2] leading-tight mb-6 tracking-tighter">
						The Ultimate
						<br />
						<span className="highlight inline-block bg-[#ffe082] text-[#1a1a1a] py-1 px-4 rounded-lg transform -rotate-2 mt-2">
							Games Marketplace
						</span>
					</h1>
					<p className="subtitle text-lg md:text-xl max-w-2xl leading-relaxed mb-10">
						Discover, trade, and play unique games from independent creators worldwide.
						<br />
						Truly own your assets.
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
						/>
						<button
							type="submit"
							className="bg-white text-black py-3 px-6 rounded-lg font-medium text-base hover:bg-[#dcdcdc] focus:outline-none transition-colors whitespace-nowrap"
						>
							Join the Waitlist &rarr;
						</button>
					</form>
					{message && <p className="form-message mt-6 text-[#ffe082] text-sm">{message}</p>}
				</main>

				<footer className="main-footer pt-12 pb-8 border-t border-[#2a2a2a] text-sm">
					<div className="footer-content flex flex-col md:flex-row justify-between gap-10 mb-10">
						<div className="footer-left md:max-w-xs">
							<div className="logo flex items-center gap-3 text-lg font-semibold text-[#f2f2f2] mb-4">
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
							<p className="leading-relaxed mb-4">
								The games marketplace that gets the job done. Simple, powerful, and works on
								any platform.
							</p>
							<div className="social-links flex gap-4">
								<a
									href="#"
									aria-label="X (formerly Twitter)"
									className="hover:text-[#f2f2f2] transition-colors"
								>
									<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
										<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
									</svg>
								</a>
								<a
									href="#"
									aria-label="Reddit"
									className="hover:text-[#f2f2f2] transition-colors"
								>
									<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
										<path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
									</svg>
								</a>
							</div>
						</div>
					</div>
					<div className="footer-bottom pt-8 border-t border-[#2a2a2a] text-center">
						<p>&copy; 2025 NoPlace Games, All Rights Reserved</p>
					</div>
				</footer>
			</div>
		</div>
	);
}

export default App;
