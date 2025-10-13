import { useEffect, useState } from "react";

function App(): JSX.Element {
	const [count, setCount] = useState<number | null>(null);
	const [message, setMessage] = useState<string>("Hello World");

	useEffect(() => {
		const fetchProject = async () => {
			try {
				const res = await fetch("/api/project", { method: "GET" });
				if (!res.ok) {
					const err = await res.json().catch(() => ({}));
					setMessage(err?.message || "Failed to fetch project");
					setCount(null);
					return;
				}
				const data = await res.json();
				if (data?.message) setMessage(data.message);
				if (typeof data?.count === "number") setCount(data.count);
			} catch (e) {
				setMessage("Network error");
				setCount(null);
			}
		};
		fetchProject();
	}, []);

	return (
		<div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center">
			<div className="max-w-lg p-8 bg-gray-800 rounded-xl shadow-lg text-center">
				<h1 className="text-3xl font-bold mb-4">{message}</h1>
				{typeof count === "number" ? (
					<p className="text-lg">
						Count from API: <span className="font-semibold">{count}</span>
					</p>
				) : (
					<p className="text-sm text-gray-400">No count available</p>
				)}
			</div>
		</div>
	);
}

export default App;
