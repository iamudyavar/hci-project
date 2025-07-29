interface BlogPostProps {
	onNavigateHome: () => void;
}

function BlogPost({ onNavigateHome }: BlogPostProps): JSX.Element {
	return (
		<div className="bg-[#0a0a0a] text-[#e2e2e2] min-h-screen flex flex-col font-sans">
			<div className="container mx-auto px-4 max-w-4xl">
				<header className="main-header py-6 border-b border-[#2a2a2a] flex justify-between items-center">
					<button
						onClick={onNavigateHome}
						className="logo flex items-center gap-3 text-xl font-semibold text-[#f2f2f2] hover:text-[#ffe082] transition-colors cursor-pointer border-0 bg-transparent"
					>
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
					</button>
				</header>

				<main className="py-12">
					<article className="prose prose-invert max-w-none prose-lg md:prose-xl prose-headings:mt-10 prose-headings:mb-6 prose-headings:font-bold prose-headings:text-[#f2f2f2] prose-h1:text-4xl md:prose-h1:text-5xl prose-h2:text-3xl md:prose-h2:text-4xl prose-h3:text-2xl prose-p:text-[1.25rem] prose-p:leading-relaxed prose-li:text-[1.15rem] prose-li:leading-relaxed">
						<header className="mb-14 text-center">
							<h1 className="text-4xl md:text-5xl font-bold text-[#f2f2f2] leading-tight mb-6">
								How We're Building a Resilient Payment System for NoPlace Games
							</h1>
							<div className="text-[#a0a0a0] text-lg mb-2">
								<time dateTime="2025-07-28">July 28, 2025</time>
							</div>
							<div className="text-[#bdbdbd] text-base italic">By The NoPlace Games Team</div>
						</header>

						<div className="text-[1.25rem] leading-relaxed space-y-8">
							<p>
								First, we want to say thank you. The response to our announcement has been
								overwhelming. Your passion, your support, and your tough, insightful questions
								have shown us that we’re not alone in believing that creative freedom needs a
								real defender.
							</p>
							<p>
								Many of you have asked the single most important question for a platform like
								ours:
							</p>
							<blockquote>
								<p>
									“How will you handle payments? How will you succeed where others have
									failed, and avoid being shut down by payment processors like Visa and
									Mastercard?”
								</p>
							</blockquote>
							<p>
								It’s a fair and vital question. You’re right to be skeptical. History has
								shown that simply creating a “wallet” or “points system” isn’t enough. The
								financial choke points are real, and any platform promising true content
								freedom must have a robust, intelligent, and resilient answer.
							</p>
							<p>This post is our answer.</p>

							<h2 className="text-3xl md:text-4xl font-bold text-[#f2f2f2] mt-14 mb-6">
								The Problem: Why "Wallet Funds" Aren't Enough
							</h2>
							<p>
								Let’s be direct. The core issue is that major payment networks can threaten to
								sever all ties with a marketplace if they disapprove of even a fraction of its
								content. They don't distinguish between you buying "safe" Game A or
								"controversial" Game B. If they can link the credit card transaction to the
								platform hosting content they dislike, they can pull the plug on the entire
								operation.
							</p>
							<p>
								A simple "add funds to your wallet" system doesn't solve this. The transaction
								is still "Customer -&gt; Your Platform." The link is direct, and the
								vulnerability remains. We knew from day one that we needed a fundamentally
								different approach.
							</p>

							<h2 className="text-3xl md:text-4xl font-bold text-[#f2f2f2] mt-14 mb-6">
								Our Solution: Creating True Separation
							</h2>
							<p>
								Our strategy is built on a simple but powerful principle:{" "}
								<strong>separation</strong>. We are creating a system where the transaction
								with the payment processor is for a distinct, neutral asset. Once you own that
								asset, you can then use it to acquire games on our marketplace.
							</p>
							<p>
								Think of it this way: You can use your credit card to buy a gold bar from a
								dealer. The credit card company processes the sale of the gold. What you do
								with that gold afterward - whether you trade it for art, a car, or anything
								else - is outside of their purview. They facilitated the purchase of the
								asset, not the final product.
							</p>
							<p>
								To achieve this in the digital world, our platform integrates an internal
								currency that functions as this neutral asset. Here’s how it works, and most
								importantly, how it will feel for you:
							</p>
							<ul className="list-disc marker:text-white space-y-4 pl-5">
								<li>
									<span className="font-bold">Seamless Experience:</span> You’ll add funds
									to your NoPlace Games account just like you would on any other platform.
									You’ll choose an amount ($10, $20, $50), pay with your credit card, and
									see the balance appear in your account.
								</li>
								<li>
									<span className="font-bold">Invisible Technology:</span> Under the hood,
									your purchase acquires a corresponding value in a stablecoin - a type of
									digital asset pegged 1:1 to a real-world currency like the US Dollar. This
									process is completely invisible to you.{" "}
									<strong>
										You will not need a crypto wallet, you will not have to understand
										blockchain, and you will never be exposed to price volatility.
									</strong>{" "}
									The experience is designed to be as simple as topping up your Steam
									wallet.
								</li>
								<li>
									<span className="font-bold">True Ownership:</span> That balance in your
									account is now yours, separate from the initial credit card transaction.
									You can then use it freely across the NoPlace Games marketplace to buy any
									game you want.
								</li>
							</ul>
							<p>
								This model creates the necessary layer of separation. The payment processor is
								handling a transaction for a stable, neutral asset, not for a specific piece
								of media they might later decide to target.
							</p>

							<h2 className="text-3xl md:text-4xl font-bold text-[#f2f2f2] mt-14 mb-6">
								A Multi-Layered Defense
							</h2>
							<p>
								This is not our only line of defense. We believe in resilience through
								redundancy. Alongside our primary payment model, we are:
							</p>
							<ul className="list-disc marker:text-white space-y-4 pl-5">
								<li>
									<span className="font-bold">Diversifying Payment Partners:</span> We are
									actively building relationships with a variety of payment partners to
									create a resilient and redundant financial backbone. We've been incredibly
									grateful for the community's input on this, with many of you highlighting
									the growing ecosystem of financial services beyond the two most dominant
									card networks. Our strategy involves creating a mosaic of payment options,
									including:
									<ul className="list-disc marker:text-white pl-8 mt-2 space-y-2">
										<li>
											Engaging with established networks like{" "}
											<span className="font-bold">American Express</span> and{" "}
											<span className="font-bold">Discover</span>
										</li>
										<li>
											Partnering with modern, tech-forward platforms like{" "}
											<span className="font-bold">Adyen</span> and{" "}
											<span className="font-bold">Square</span>
										</li>
										<li>
											Integrating international fintech solutions like{" "}
											<span className="font-bold">Skrill</span> or{" "}
											<span className="font-bold">Revolut</span> to better serve our
											global community and reduce our reliance on any single entity
										</li>
									</ul>
								</li>
								<li>
									<span className="font-bold">Preparing for Legal Action:</span> If it comes
									to it, we are prepared to fight. There is a strong legal and ethical
									argument to be made that financial institutions should not be the arbiters
									of legal creative expression. Blocking the sale of a neutral,
									currency-equivalent asset is a significant overreach, and we are prepared
									to make that case in court.
								</li>
							</ul>

							<h2 className="text-3xl md:text-4xl font-bold text-[#f2f2f2] mt-14 mb-6">
								Our Unwavering Commitment
							</h2>
							<p>
								We are not building NoPlace Games on hope and wishful thinking. We are
								building it on a sound, modern, and resilient strategy designed to withstand
								the very pressures that caused this problem in the first place.
							</p>
							<p>
								Our mission is to ensure that developers' years of hard work are not erased
								overnight and that you, the gamers, have the freedom to explore all the legal,
								creative worlds that developers can imagine.
							</p>
							<p>
								This is a fight for the future of indie games and creative freedom. Your
								support makes it possible.
							</p>
							<p>
								Help us build a platform that can’t be silenced. Sign up for the waitlist and
								spread the word.
							</p>
						</div>
					</article>

					<div className="mt-10 pt-10 border-t border-[#2a2a2a] text-center">
						<button
							onClick={onNavigateHome}
							className="bg-white text-black py-3 px-6 rounded-lg font-medium text-base hover:bg-[#dcdcdc] transition-colors cursor-pointer border-0"
						>
							← Back to Home
						</button>
					</div>
				</main>
			</div>
		</div>
	);
}

export default BlogPost;
