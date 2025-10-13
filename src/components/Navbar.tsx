import { NavLink } from "react-router-dom";

export default function Navbar(): JSX.Element {
	const base = "px-3 py-2 rounded-md text-sm font-medium";
	const inactive = "text-gray-300 hover:text-white hover:bg-gray-700";
	const active = "text-white bg-gray-700";

	return (
		<nav className="bg-gray-800 border-b border-gray-700 sticky top-0 z-10">
			<div className="mx-auto max-w-6xl px-4">
				<div className="flex h-14 items-center justify-between">
					<div className="flex items-center gap-6">
						<span className="text-white font-semibold">HCI Project</span>
						<div className="flex items-center gap-2">
							<NavLink
								to="/"
								end
								className={({ isActive }) => `${base} ${isActive ? active : inactive}`}
							>
								Home
							</NavLink>
							<NavLink
								to="/upload"
								className={({ isActive }) => `${base} ${isActive ? active : inactive}`}
							>
								Upload
							</NavLink>
							<NavLink
								to="/quiz"
								className={({ isActive }) => `${base} ${isActive ? active : inactive}`}
							>
								Quiz
							</NavLink>
						</div>
					</div>
				</div>
			</div>
		</nav>
	);
}
