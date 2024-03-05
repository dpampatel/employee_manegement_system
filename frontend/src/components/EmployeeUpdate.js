import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { UPDATE_EMPLOYEE } from "../graphql/Mutations";
import { GET_ALL_EMPLOYEES, GET_EMPLOYEE_DETAILS } from "../graphql/Queries";
import { useNavigate, useParams } from "react-router-dom";

function EmployeeUpdate() {
	const navigate = useNavigate();

	const [formErrors, setFormErrors] = useState(null);
	const [isSuccess, setIsSuccess] = useState(false);
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [age, setAge] = useState("");
	const [dateOfJoining, setDateOfJoining] = useState("");
	const [title, setTitle] = useState("");
	const [department, setDepartment] = useState("");
	const [employeeType, setEmployeeType] = useState("");
	const [currentStatus, setCurrentStatus] = useState(true);

	const [updateEmployee, { data_u, loading_u, error_u }] = useMutation(
		UPDATE_EMPLOYEE,
		{
			onError: (error) => {
				console.error("Error updating employee:", error);
			},
			onCompleted: () => {
				console.log("Employee updated successfully");
				navigate(-1);
			},
		}
	);
	console.log("updated data", data_u);

	useEffect(() => {
		setFirstName(localStorage.getItem("firstName"));
		setLastName(localStorage.getItem("lastName"));
		setAge(localStorage.getItem("age"));
		setDateOfJoining(localStorage.getItem("dateOfJoining"));
		setTitle(localStorage.getItem("title"));
		setDepartment(localStorage.getItem("department"));
		setEmployeeType(localStorage.getItem("employeeType"));
		setCurrentStatus(localStorage.getItem("currentStatus"));
	}, []);

	const { employee_id } = useParams();
	console.log(`url paramaeter:${employee_id}`);

	const { loading, error, data } = useQuery(GET_EMPLOYEE_DETAILS, {
		variables: { employee_id },
	});

	if (loading) return <p>Loading...</p>;
	if (error) return <p>Error : {error.message}</p>;

	const handleSubmit = (e) => {
		e.preventDefault();

		updateEmployee({
			variables: {
				employee_id: employee_id,
				employee_details: {
					title,
					department,
					currentStatus: currentStatus?.toLowerCase?.() === "true",
				},
			},
			refetchQueries: [{ query: GET_ALL_EMPLOYEES }],
		});
	};
	const formatDate = (date) => {
		if (date) {
			const options = { year: "numeric", month: "short", day: "numeric" };
			return new Intl.DateTimeFormat("en-US", options).format(new Date(date));
		} else {
			return "";
		}
	};

	if (error) {
		console.log(error);
	}
	return (
		<>
			<h1 className="text-center">Update Employee</h1>
			<form className="container" method="post" style={{ width: "50%" }}>
				<div className="mb-3 input-group">
					<span className="input-group-text">
						<label htmlFor="firstname" className="form-label required">
							First Name*
						</label>
					</span>
					<input
						type="text"
						className={`form-control ${
							formErrors && (formErrors?.firstName ? "is-invalid" : "is-valid")
						}`}
						id="firstname"
						placeholder="Enter first name"
						name="firstname"
						value={firstName}
						onChange={(e) => {
							setFirstName(e.currentTarget.value);
						}}
						disabled
					/>
					<div className="invalid-feedback">Please enter valid first name</div>
				</div>

				<div className="mb-3 input-group">
					<span className="input-group-text">
						<label htmlFor="lastname" className="form-label required">
							Last Name*
						</label>
					</span>
					<input
						type="text"
						className={`form-control ${
							formErrors && (formErrors?.lastName ? "is-invalid" : "is-valid")
						}`}
						id="lastname"
						placeholder="Enter last name"
						name="lastname"
						value={lastName}
						onChange={(e) => {
							setLastName(e.currentTarget.value);
						}}
						disabled
					/>
					<div className="invalid-feedback">Please enter last name</div>
				</div>

				<div className="mb-3 input-group">
					<span className="input-group-text">
						<label htmlFor="age" className="form-label required">
							Age*
						</label>
					</span>
					<input
						type="number"
						className={`form-control ${
							formErrors && (formErrors?.age ? "is-invalid" : "is-valid")
						}`}
						id="age"
						placeholder="Enter age"
						name="age"
						value={age}
						onChange={(e) => {
							setAge(e.currentTarget.value);
						}}
						disabled
					/>
					<div className="invalid-feedback">
						Please enter age between 20 to 70
					</div>
				</div>

				<div className="mb-3 input-group">
					<span className="input-group-text">
						<label htmlFor="dateofjoining" className="form-label required">
							Date Of Joining*
						</label>
					</span>
					<input
						type="text"
						className={`form-control ${
							formErrors &&
							(formErrors?.dateOfJoining ? "is-invalid" : "is-valid")
						}`}
						id="dateofjoining"
						name="dateofjoining"
						value={formatDate(dateOfJoining)}
						onChange={(e) => {
							setDateOfJoining(e.currentTarget.value);
						}}
						disabled
					/>
					<div className="invalid-feedback">
						Please select valid date of joining, and date should not be in
						advanced
					</div>
				</div>

				<div className="mb-3 input-group">
					<span className="input-group-text">
						<label htmlFor="employeetype" className="form-label required">
							Employee Type*
						</label>
					</span>
					<select
						className={`form-control ${
							formErrors &&
							(formErrors?.employeeType ? "is-invalid" : "is-valid")
						}`}
						id="employeetype"
						name="employeetype"
						value={employeeType}
						onChange={(e) => {
							setEmployeeType(e.currentTarget.value);
						}}
						disabled
					>
						<option value="">Select Employee Type</option>
						<option value="FullTime">Full Time</option>
						<option value="PartTime">Part Time</option>
						<option value="Contract">Contract</option>
						<option value="Seasonal">Seasonal</option>
					</select>
					<div className="invalid-feedback">Please select a title</div>
				</div>
				<div className="mb-3 input-group">
					<span className="input-group-text">
						<label htmlFor="title" className="form-label required">
							Title*
						</label>
					</span>
					<select
						className={`form-control ${
							formErrors && (formErrors?.title ? "is-invalid" : "is-valid")
						}`}
						id="title"
						name="title"
						value={title}
						onChange={(e) => {
							setTitle(e.currentTarget.value);
						}}
					>
						<option value="">Select Title</option>
						<option value="Employee">Employee</option>
						<option value="Manager">Manager</option>
						<option value="Director">Director</option>
						<option value="VP">VP</option>
					</select>
					<div className="invalid-feedback">Please select a title</div>
				</div>

				<div className="mb-3 input-group">
					<span className="input-group-text">
						<label htmlFor="department" className="form-label required">
							Department*
						</label>
					</span>
					<select
						className={`form-control ${
							formErrors && (formErrors?.department ? "is-invalid" : "is-valid")
						}`}
						id="department"
						name="department"
						value={department}
						onChange={(e) => {
							setDepartment(e.currentTarget.value);
						}}
					>
						<option value="">Select Department</option>
						<option value="IT">IT</option>
						<option value="Marketing">Marketing</option>
						<option value="HR">HR</option>
						<option value="Engineering">Engineering</option>
					</select>
					<div className="invalid-feedback">Please select a title</div>
				</div>

				<div className="mb-3 input-group">
					<span className="input-group-text">
						<label htmlFor="currentStatus" className="form-label required">
							Status*
						</label>
					</span>
					<select
						className={`form-control ${
							formErrors &&
							(formErrors?.currentStatus ? "is-invalid" : "is-valid")
						}`}
						id="currentStatus"
						name="currentStatus"
						value={currentStatus}
						onChange={(e) => {
							setCurrentStatus(e.currentTarget.value);
						}}
					>
						<option value="true">Working</option>
						<option value="false">Retired</option>
					</select>
					<div className="invalid-feedback">Please select employee status</div>
				</div>

				<div className="my-4 text-center">
					<button
						type="button"
						className="btn btn-primary"
						onClick={handleSubmit}
					>
						Update Employee
					</button>
				</div>
			</form>
		</>
	);
}

export default EmployeeUpdate;
