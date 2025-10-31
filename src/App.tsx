import { Routes, Route, Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Upload from "./pages/Upload";
import Quiz from "./pages/Quiz";

function Layout(): JSX.Element {
	return (
		<div className="h-screen bg-gray-900 text-gray-100">
			<Navbar />
			<main className="mx-auto max-w-6xl p-4">
				<Outlet />
			</main>
		</div>
	);
}

export default function App(): JSX.Element {
	return (
		<Routes>
			<Route element={<Layout />}>
				<Route index element={<Home />} />
				<Route path="upload" element={<Upload />} />
				<Route path="quiz" element={<Quiz />} />
			</Route>
		</Routes>
	);
}
