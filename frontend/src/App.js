import "./App.css";
import { BrowserRouter } from "react-router-dom";
import EmployeeDirectory from "./components/EmployeeDirectory";
import { useState } from "react";

function App() {
	return (
		<>
			<BrowserRouter>
				<EmployeeDirectory />
			</BrowserRouter>
		</>
	);
}

export default App;
