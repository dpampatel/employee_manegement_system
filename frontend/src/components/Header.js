import React from "react";
import { Link, Outlet } from "react-router-dom";

function Header() {
	return (
		<>
			<header className="bg-dark">
				<h1>EMPLOYEE MANAGEMENT SYSTEM</h1>
				<nav>
					<ul>
						<li>
							<Link to="/">Home</Link>
						</li>
						<li>
							<Link to="/list">Employees</Link>
						</li>
						<li>
							<Link to="/add">Add</Link>
						</li>
						<li>
							<Link to="/list/retire/Yes">Retirements</Link>
						</li>
					</ul>
				</nav>
			</header>
			<Outlet />
		</>
	);
}

export default Header;
