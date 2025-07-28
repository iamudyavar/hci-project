import { useState, FC, FormEvent, ChangeEvent } from "react";

const GitHubIcon: FC = () => (
	<svg height="24" viewBox="0 0 16 16" fill="currentColor" width="24">
		<path
			fillRule="evenodd"
			d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"
		></path>
	</svg>
);
const XIcon: FC = () => (
	<svg height="24" viewBox="0 0 1200 1227" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
		<path
			d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.137 519.284H714.163ZM569.165 687.828L521.697 619.934L144.011 79.6902H306.615L611.412 515.685L658.88 583.579L1055.08 1150.31H892.476L569.165 687.854V687.828Z"
			fill="currentColor"
		/>
	</svg>
);
const DiscordIcon: FC = () => (
	<svg height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
		<path
			d="M20.32,3.37a21.2,21.2,0,0,0-4.88-1.3,19.33,19.33,0,0,0-1.23.63,18.3,18.3,0,0,0-4.47,0,18.5,18.5,0,0,0-1.23-.63A21.13,21.13,0,0,0,3.68,3.37a21.54,21.54,0,0,0-1.5,8.17c0,4.6,3.12,8.6,7.22,9.9a16,16,0,0,0,2.1.42,1,1,0,0,0,.84-.2,1,1,0,0,0,.19-.84,14.62,14.62,0,0,1-.52-2.11,1,1,0,0,1,.18-.78,1,1,0,0,1,.79-.38h.06a1,1,0,0,1,.78.38,1,1,0,0,1,.18.78,13.1,13.1,0,0,1-.52,2.11,1,1,0,0,0,.19.84,1,1,0,0,0,.84.2,16.29,16.29,0,0,0,2.1-.42c4.1-1.3,7.22-5.3,7.22-9.9A21.57,21.57,0,0,0,20.32,3.37ZM8.43,13.82a2,2,0,0,1-2.09-2,2,2,0,0,1,2.09-2,2,2,0,0,1,0,4Zm7.14,0a2,2,0,0,1-2.09-2,2,2,0,1,1,2.09,2Z"
			fill="currentColor"
		/>
	</svg>
);

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
						<span>OpenGames</span>
					</div>
				</header>

				<main className="hero flex-grow flex flex-col justify-center items-center text-center py-16 md:py-24">
					<h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-[#f2f2f2] leading-tight mb-6 tracking-tighter">
						The Open Source
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
								<span>OpenGames</span>
							</div>
							<p className="leading-relaxed mb-4">
								The open source games marketplace that gets the job done. Simple, powerful,
								and works on any platform.
							</p>
							<div className="social-links flex gap-4">
								<a
									href="#"
									aria-label="GitHub"
									className="hover:text-[#f2f2f2] transition-colors"
								>
									<GitHubIcon />
								</a>
								<a
									href="#"
									aria-label="X (formerly Twitter)"
									className="hover:text-[#f2f2f2] transition-colors"
								>
									<XIcon />
								</a>
								<a
									href="#"
									aria-label="Discord"
									className="hover:text-[#f2f2f2] transition-colors"
								>
									<DiscordIcon />
								</a>
							</div>
						</div>
						<div className="footer-right flex gap-10 sm:gap-16">
							<div className="footer-links">
								<h4 className="text-[#f2f2f2] font-semibold mb-4">Resources</h4>
								<ul className="space-y-3">
									<li>
										<a href="#" className="hover:text-[#f2f2f2] transition-colors">
											Roadmap
										</a>
									</li>
									<li>
										<a href="#" className="hover:text-[#f2f2f2] transition-colors">
											Documentation
										</a>
									</li>
									<li>
										<a href="#" className="hover:text-[#f2f2f2] transition-colors">
											Whitepaper
										</a>
									</li>
								</ul>
							</div>
							<div className="footer-links">
								<h4 className="text-[#f2f2f2] font-semibold mb-4">Company</h4>
								<ul className="space-y-3">
									<li>
										<a href="#" className="hover:text-[#f2f2f2] transition-colors">
											About
										</a>
									</li>
									<li>
										<a href="#" className="hover:text-[#f2f2f2] transition-colors">
											Blog
										</a>
									</li>
									<li>
										<a href="#" className="hover:text-[#f2f2f2] transition-colors">
											Careers
										</a>
									</li>
								</ul>
							</div>
						</div>
					</div>
					<div className="footer-bottom pt-8 border-t border-[#2a2a2a] text-center">
						<p>&copy; 2025 OpenGames, All Rights Reserved</p>
					</div>
				</footer>
			</div>
		</div>
	);
}

export default App;
