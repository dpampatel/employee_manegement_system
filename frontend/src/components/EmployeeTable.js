import React, { useEffect, useState } from "react";
import { GET_ALL_EMPLOYEES } from "../graphql/Queries";
import { useQuery, gql, useLazyQuery } from "@apollo/client";
import { useNavigate, useParams } from "react-router-dom";

function EmployeeTable() {
	const { retire } = useParams();
	console.log(retire);
	const navigate = useNavigate();
	const [filters, setFilters] = useState({});
	const [mydata, setMydata] = useState({});
	const [searchValues, setSearchValues] = useState({});

	const [getAllEmployees, { loading, error, data }] =
		useLazyQuery(GET_ALL_EMPLOYEES);

	useEffect(() => {
		getAllEmployees({
			variables: {
				filters,
			},
			onCompleted: (data) => setMydata(data),
			onError: (error) => console.log(error),
		});
	}, [filters, data]);

	const handleAddEmployee = () => {
			navigate("/add");
		},
		handleView = (employee_id) => {
			navigate(`/list/${employee_id}`);
		},
		handleEdit = (employee) => {
			let {
				_id,
				firstName,
				lastName,
				age,
				dateOfJoining,
				title,
				department,
				employeeType,
				currentStatus,
			} = employee;
			localStorage.setItem("firstName", firstName);
			localStorage.setItem("lastName", lastName);
			localStorage.setItem("age", age);
			localStorage.setItem("dateOfJoining", dateOfJoining);
			localStorage.setItem("title", title);
			localStorage.setItem("department", department);
			localStorage.setItem("employeeType", employeeType);
			localStorage.setItem("currentStatus", currentStatus);

			navigate(`/update/${_id}`);
		},
		handleDelete = ({ _id }) => {
			navigate(`/delete/${_id}`);
		},
		handleInputChange = (event, columnName) => {
			let { value } = event.target;
			if (value === "") {
				delete searchValues[columnName];
				setSearchValues({
					...searchValues,
				});
			} else {
				value = columnName === "age" ? parseInt(value) : value;
				value =
					columnName === "currentStatus"
						? value?.toLowerCase?.() === "true"
						: value;
				setSearchValues({
					...searchValues,
					[columnName]: value,
				});
			}
		},
		applyFilter = (columnName) => {
			setFilters({
				...searchValues,
			});
		},
		clearFilter = () => {
			setSearchValues({});
			setFilters({});
		},
		formatDate = (date) => {
			if (date) {
				const options = { year: "numeric", month: "short", day: "numeric" };
				return new Intl.DateTimeFormat("en-US", options).format(new Date(date));
			} else {
				return "";
			}
		};

	if (retire == "Yes" && filters.retire != "Yes") {
		setFilters({
			retire: retire,
		});
	}
	if (loading) return <p>Loading...</p>;
	if (error) return <p>Error : {error.message}</p>;
	let employeeData, employeeJoiningDates, uniqueJoiningDates;
	if (mydata?.getAllEmployees) {
		employeeData = mydata?.getAllEmployees;
		employeeJoiningDates = employeeData.map(
			(employee) => employee.dateOfJoining
		);
		uniqueJoiningDates = [...new Set(employeeJoiningDates)].sort();
	} else {
		employeeData = employeeJoiningDates = uniqueJoiningDates = [];
	}
	return (
		<main className="mt-4">
			<table className="table table-striped table-bordered">
				<thead>
					<tr>
						<th>First Name</th>
						<th>Last Name</th>
						<th>Age</th>
						<th>Date of Joining</th>
						<th>Title</th>
						<th>Department</th>
						<th>Type</th>
						<th>Status</th>
						<th>Upcoming Retirement</th>
						<th colSpan="3"></th>
					</tr>
					{retire != "Yes" && (
						<tr>
							<th>
								<div className="input-group">
									<input
										type="text"
										className="form-control"
										placeholder="Search..."
										aria-describedby="button-addon2"
										onChange={(e) => handleInputChange(e, "firstName")}
										value={searchValues?.firstName || ""}
									/>
								</div>
							</th>
							<th>
								<div className="input-group">
									<input
										type="text"
										className="form-control"
										placeholder="Search..."
										aria-describedby="button-addon2"
										onChange={(e) => handleInputChange(e, "lastName")}
										value={searchValues?.lastName || ""}
									/>
								</div>
							</th>
							<th>
								<div className="input-group">
									<input
										type="text"
										className="form-control"
										placeholder="Search..."
										aria-describedby="button-addon2"
										onChange={(e) => handleInputChange(e, "age")}
										value={searchValues?.age || ""}
										style={{ width: "82px" }}
									/>
								</div>
							</th>
							<th>
								<div className="input-group">
									<select
										className="form-control"
										value={searchValues?.dateOfJoining || ""}
										onChange={(e) => {
											handleInputChange(e, "dateOfJoining");
										}}
									>
										<option value="">Select...</option>
										{uniqueJoiningDates &&
											uniqueJoiningDates.map((joiningDate, index) => (
												<option key={index} value={joiningDate}>
													{formatDate(joiningDate)}
												</option>
											))}
									</select>
								</div>
							</th>
							<th>
								<div className="input-group">
									<select
										className="form-control"
										value={searchValues?.title || ""}
										onChange={(e) => {
											handleInputChange(e, "title");
										}}
									>
										<option value="">Select...</option>
										<option value="Employee">Employee</option>
										<option value="Manager">Manager</option>
										<option value="Director">Director</option>
										<option value="VP">VP</option>
									</select>
								</div>
							</th>
							<th>
								<div className="input-group">
									<select
										className="form-control"
										value={searchValues?.department || ""}
										onChange={(e) => {
											handleInputChange(e, "department");
										}}
									>
										<option value="">Select...</option>
										<option value="IT">IT</option>
										<option value="Marketing">Marketing</option>
										<option value="HR">HR</option>
										<option value="Engineering">Engineering</option>
									</select>
								</div>
							</th>
							<th>
								<div className="input-group">
									<select
										className="form-control"
										value={searchValues?.employeeType || ""}
										onChange={(e) => {
											handleInputChange(e, "employeeType");
										}}
									>
										<option value="">Select...</option>
										<option value="FullTime">Full Time</option>
										<option value="PartTime">Part Time</option>
										<option value="Contract">Contract</option>
										<option value="Seasonal">Seasonal</option>
									</select>
								</div>
							</th>
							<th>
								<div className="input-group">
									<select
										className="form-control"
										value={searchValues?.currentStatus || ""}
										onChange={(e) => {
											handleInputChange(e, "currentStatus");
										}}
									>
										<option value="">Select...</option>
										<option value="true">Working</option>
										<option value="false">Retired</option>
									</select>
								</div>
							</th>
							<th>
								<div className="input-group">
									<select
										className="form-control"
										value={searchValues?.retire || ""}
										onChange={(e) => {
											handleInputChange(e, "retire");
										}}
									>
										<option value="">Select...</option>
										<option value="Yes">Yes</option>
										<option value="No">No</option>
									</select>
								</div>
							</th>
							<th style={{ border: "none" }}></th>
							<th style={{ border: "none" }} colSpan={1}>
								<button
									className="btn btn-outline-secondary btn-sm"
									type="button"
									id="button-addon2"
									onClick={() => applyFilter()}
								>
									Filter
								</button>
							</th>
							<th style={{ borderLeft: "none" }}>
								<button
									className="btn btn-outline-secondary btn-sm"
									type="button"
									id="button-addon2"
									onClick={() => clearFilter()}
								>
									Clear
								</button>
							</th>
						</tr>
					)}
				</thead>
				{(employeeData?.length || 0) === 0 ? (
					<tbody>
						<tr>
							<td colSpan="11" className="text-center">
								<p className="alert alert-info">
									No employees found in the database.
								</p>
							</td>
						</tr>
					</tbody>
				) : (
					<tbody>
						{employeeData.map((employee) => (
							<tr key={employee._id}>
								<td>{employee.firstName}</td>
								<td>{employee.lastName}</td>
								<td>{employee.age}</td>
								<td>{formatDate(employee.dateOfJoining)}</td>
								<td>{employee.title}</td>
								<td>{employee.department}</td>
								<td>{employee.employeeType}</td>
								<td>{employee.currentStatus ? "Working" : "Retired"}</td>
								<td>{employee?.retire || "-"}</td>
								<td>
									<button
										className="btn btn-success btn-sm"
										onClick={() => handleView(employee._id)}
									>
										View
									</button>
								</td>
								<td>
									<button
										className="btn btn-primary btn-sm"
										onClick={() => handleEdit(employee)}
									>
										Edit
									</button>
								</td>
								<td>
									<button
										className="btn btn-danger btn-sm"
										onClick={() => handleDelete(employee)}
									>
										Delete
									</button>
								</td>
							</tr>
						))}
					</tbody>
				)}
			</table>
			<section className="text-center">
				<button className="btn btn-primary" onClick={handleAddEmployee}>
					Add Employee
				</button>
			</section>
		</main>
	);
}

export default EmployeeTable;
