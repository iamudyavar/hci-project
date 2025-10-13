import { useEffect, useState } from "react";

export default function Home(): JSX.Element {
	const [count, setCount] = useState<number | null>(null);
	const [message, setMessage] = useState<string>("Hello World");
	const [loading, setLoading] = useState<boolean>(true);

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
			} finally {
				setLoading(false);
			}
		};
		fetchProject();
	}, []);

	return (
		<div className="p-6">
			<h1 className="text-2xl font-bold mb-4">Home</h1>
			<div className="max-w-lg p-6 bg-gray-800 rounded-xl shadow-lg">
				<h2 className="text-xl font-semibold mb-2">{message}</h2>
				{loading ? (
					<p className="text-sm text-gray-400">Loading...</p>
				) : typeof count === "number" ? (
					<p className="text-lg">
						COUNT from API: <span className="font-semibold">{count}</span>
					</p>
				) : (
					<p className="text-sm text-gray-400">No count available</p>
				)}
			</div>
		</div>
	);
}
