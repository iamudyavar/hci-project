import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NavLink } from "react-router-dom";

export default function Home() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [step, setStep] = useState<"email" | "username" | "done">("email");

  // Keep users logged in after refreshes
  useEffect(() => {
    const storedUser = localStorage.getItem("userSession");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setStep("done");
        setMessage(`Welcome back, ${parsedUser.username}!`);
        setUserId(parsedUser.id);
      } catch (err) {
        console.error("Failed to parse stored user", err);
      }
    }
  }, []);

  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValidEmail(email)) {
      setMessage("Please enter a valid email address.");
      return;
    }

	// create new user with email in database
    try {
      const res = await fetch("/api/project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
			action: "createUser",
			payload: { email }}),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage("Error: " + data.message);
        return;
      }

      localStorage.setItem("userSession", JSON.stringify(data.user));
      setUserId(data.user.id);

	  // checks if email is already in use, skips username step
      if (data.alreadyExists && data.user.username) {
        setMessage(`Welcome back, ${data.user.username}!`);
        setStep("done");
      } else {
        setMessage("Welcome! Please choose a username:");
        setStep("username");
      }
    } catch (err: any) {
      setMessage("Error: " + err.message);
    }
  };

  const handleUsernameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (username.trim().length < 1) {
      setMessage("Username must be at least 1 character.");
      return;
    }

	// populates username column in database
    try {
      const res = await fetch("/api/project", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
			action: "updateUsername",
			payload: { userId, username } }),
      });

      const data = await res.json();
      if (!res.ok) {
        setMessage("Error: " + data.message);
        return;
      }

      localStorage.setItem("userSession", JSON.stringify(data.user));
      setMessage(`Welcome, ${data.user.username}!`);
      setStep("done");
    } catch (err: any) {
      setMessage("Error: " + err.message);
    }
  };

  const updateUsername = () => {
    setStep("username");
  };

return (
	<div className="flex justify-center items-center min-h-screen bg-gray-900">
	<div className="bg-gray-800 p-15 rounded-3xl shadow-xl w-full max-w-xl">
	<div className="mt-6">
	<div className="flex flex-col items-center w-full">
	<AnimatePresence mode="wait">
		{step === "email" && (
			<motion.form
				key="email"
				onSubmit={handleEmailSubmit}
				className="flex flex-col w-full"
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				exit={{ opacity: 0, y: -20 }}
				transition={{ duration: 0.4 }}
			>
				<label htmlFor="email" className="text-sm font-medium mb-1">
					Your Email
				</label>
				<input
					type="email"
					id="email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					placeholder="Enter your email"
					className="p-4 text-lg rounded border border-gray-600 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
				/>
				<button
					type="submit"
					className="mt-4 p-4 text-lg rounded bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
				>
					Continue
				</button>
			</motion.form>
		)}

		{step === "username" && (
			<motion.form
				key="username"
				onSubmit={handleUsernameSubmit}
				className="flex flex-col w-full"
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				exit={{ opacity: 0, y: -20 }}
				transition={{ duration: 0.4 }}
			>
				<label htmlFor="username" className="text-sm font-medium mb-1">
					Choose a Username
				</label>
				<input
					type="text"
					id="username"
					value={username}
					onChange={(e) => setUsername(e.target.value)}
					placeholder="Enter your username"
					className="p-4 text-lg rounded border border-gray-600 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
				/>
				<button
					type="submit"
					className="mt-4 p-4 text-lg rounded bg-green-600 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
				>
					Save Username
				</button>
			</motion.form>
			)}

		{step === "done" && (
			<motion.div
				key="done"
				className="flex flex-col items-center justify-center text-center min-h-[70vh] space-y-6"
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				exit={{ opacity: 0, y: -20 }}
				transition={{ duration: 0.4 }}
			>
				<h1 className="text-4xl font-bold text-white drop-shadow-md">
					{message}
				</h1>

				<p className="text-gray-400 text-lg max-w-md">
					Take a short quiz or upload a picture of your food and guess how many calories it has!
				</p>

				<div className="flex gap-4 mt-6">
					<NavLink to="/quiz">
						<button className="px-6 py-3 text-base font-medium rounded-2xl bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-500 hover:to-blue-300 text-white shadow-lg hover:shadow-blue-500/30 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500">
							Quiz
						</button>
					</NavLink>

					<NavLink to="/upload">
						<button className="px-6 py-3 text-base font-medium rounded-2xl bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-500 hover:to-blue-300 text-white shadow-lg hover:shadow-blue-500/30 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500">
							Upload
						</button>
					</NavLink>
				</div>

				<button
					onClick={updateUsername}
					className="px-6 py-3 text-base font-medium rounded-2xl bg-gradient-to-r from-green-600 to-green-400 hover:from-green-500 hover:to-green-300 text-white shadow-lg hover:shadow-green-500/30 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500"
				>
					Change username
				</button>
			</motion.div>
		)}
	</AnimatePresence>
	</div>
	</div>
	</div>
	</div>
);
}
