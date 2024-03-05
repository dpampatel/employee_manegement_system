import React, { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import EmployeeSearch from "./EmployeeSearch";
import EmployeeTable from "./EmployeeTable";
import EmployeeCreate from "./EmployeeCreate";
import Home from "./Home";
import { Route, Routes } from "react-router-dom";
import NoPage from "./NoPage";
import EmployeeDetails from "./EmployeeDetails";
import EmployeeUpdate from "./EmployeeUpdate";

function EmployeeDirectory(props) {
	return (
		<>
			<main>
				<Routes>
					<Route path="/" element={<Header />}>
						<Route index element={<Home />} />
						<Route
							path="list"
							element={
								<div className="p-4">
									{/* <EmployeeSearch /> */}
									<h2>Employee List</h2>
									<EmployeeTable />
								</div>
							}
						/>
						<Route
							path="/list/:employee_id"
							element={<EmployeeDetails view_page={true} delete_page={false} />}
						/>
						<Route
							path="/list/retire/:retire"
							element={
								<div className="p-4">
									<h2>Employee List</h2>
									<>
										<EmployeeTable />
									</>
								</div>
							}
						/>
						<Route path="add" element={<EmployeeCreate className="p-4" />} />
						<Route path="/update/:employee_id" element={<EmployeeUpdate />} />
						<Route
							path="/delete/:employee_id"
							element={<EmployeeDetails view_page={false} delete_page={true} />}
						/>

						<Route path="*" element={<NoPage />} />
					</Route>
				</Routes>
			</main>
			<Footer />
		</>
	);
}

export default EmployeeDirectory;
