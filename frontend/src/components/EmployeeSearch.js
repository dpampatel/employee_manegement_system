import React, { useState } from "react";

function EmployeeSearch({ onSearch }) {
	const initialState = {
		firstName: "",
		lastName: "",
		age: "",
		title: "",
		department: "",
		employeeType: "",
		currentStatus: "",
	};

	const [filters, setFilters] = useState(initialState);

	const handleChange = (e) => {
		return;
		const { name, value } = e.target;
		setFilters({ ...filters, [name]: value });
	};

	const handleSearch = () => {
		return;
		onSearch(filters);
	};

	return (
		<>
			
			<div className="my-4 pt-0">
				<form>
					<div className="row">
						<div className="col-md-3 mb-3">
							<input
								type="text"
								className="form-control"
								placeholder="First Name"
								name="firstName"
								value={filters.firstName}
								onChange={handleChange}
							/>
						</div>
						<div className="col-md-3 mb-3">
							<input
								type="text"
								className="form-control"
								placeholder="Last Name"
								name="lastName"
								value={filters.lastName}
								onChange={handleChange}
							/>
						</div>
						<div className="col-md-3 mb-3">
							<input
								type="number"
								className="form-control"
								placeholder="Age"
								name="age"
								value={filters.age}
								onChange={handleChange}
							/>
						</div>
						<div className="col-md-3 mb-3">
							<select
								className="form-select"
								name="title"
								value={filters.title}
								onChange={handleChange}
							>
								<option value="">Select Title</option>
								<option value="Employee">Employee</option>
								<option value="Manager">Manager</option>
								<option value="Director">Director</option>
								<option value="VP">VP</option>
							</select>
						</div>
						<div className="col-md-3 mb-3">
							<select
								className="form-select"
								name="department"
								value={filters.department}
								onChange={handleChange}
							>
								<option value="">Select Department</option>
								<option value="IT">IT</option>
								<option value="Marketing">Marketing</option>
								<option value="HR">HR</option>
								<option value="Engineering">Engineering</option>
							</select>
						</div>
						<div className="col-md-3 mb-3">
							<select
								className="form-select"
								name="employeeType"
								value={filters.employeeType}
								onChange={handleChange}
							>
								<option value="">Select Employee Type</option>
								<option value="FullTime">FullTime</option>
								<option value="PartTime">PartTime</option>
								<option value="Contract">Contract</option>
								<option value="Seasonal">Seasonal</option>
							</select>
						</div>
						<div className="col-md-3 mb-3">
							<select
								className="form-select"
								name="currentStatus"
								value={filters.currentStatus}
								onChange={handleChange}
							>
								<option value="">Select Current Status</option>
								<option value="1">Working</option>
								<option value="0">Retired</option>
							</select>
						</div>
						<div className="col-md-3 mb-3">
							<button
								type="button"
								className="btn btn-primary float-end"
								onClick={handleSearch}
							>
								Search
							</button>
						</div>
					</div>
				</form>
			</div>
		</>
	);
}

export default EmployeeSearch;
