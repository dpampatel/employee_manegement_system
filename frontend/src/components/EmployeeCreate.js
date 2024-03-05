import React, { useEffect, useState } from "react";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { CREATE_EMPLOYEE } from "../graphql/Mutations";
import { GET_ALL_EMPLOYEES } from "../graphql/Queries";
import { useNavigate, useParams } from "react-router-dom";

function EmployeeCreate() {
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

	const [createEmployee, { data, loading, error }] = useMutation(
		CREATE_EMPLOYEE,
		{
			onError: (error) => {
				console.error("Error creating employee:", error);
			},
			onCompleted: async () => {
				console.log("Employee created successfully");
				//navigate(-1);
				window.location.replace("list");
			},
		}
	);
	console.log("created data", data);

	const handleSubmit = (e) => {
		e.preventDefault();
		const formErrors = {
			firstName:
				!firstName ||
				typeof firstName !== "string" ||
				firstName.length > 50 ||
				/\d/.test(firstName),
			lastName:
				!lastName ||
				typeof lastName !== "string" ||
				lastName.length > 50 ||
				/\d/.test(lastName),
			age: !age || age <= 20 || age > 64,
			dateOfJoining:
				!dateOfJoining ||
				dateOfJoining > new Date().toISOString().split("T")[0],
			title: !title,
			department: !department,
			employeeType: !employeeType,
		};

		setIsSuccess(false);
		setFormErrors({ ...formErrors });

		if (Object.values(formErrors).some((v) => v)) return;

		createEmployee({
			variables: {
				employee_details: {
					firstName,
					lastName,
					age: +age,
					dateOfJoining,
					title,
					department,
					employeeType,
					currentStatus,
				},
			},
			refetchQueries: [{ query: GET_ALL_EMPLOYEES }],
		});

		if (error) {
			console.log(error);
		} else {
			//setIsSuccess(true);
			setFormErrors(null);
			setFirstName("");
			setLastName("");
			setAge("");
			setDateOfJoining("");
			setTitle("");
			setDepartment("");
			setEmployeeType("");
		}
	};

	return (
		<>
			<h1 className="text-center">Create Employee</h1>
			{isSuccess && (
				<div className="alert alert-success" role="alert">
					<b>Success!</b> Employee has been added
				</div>
			)}
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
					/>
					<div className="invalid-feedback">
						Please enter age between 20 to 64
					</div>
				</div>

				<div className="mb-3 input-group">
					<span className="input-group-text">
						<label htmlFor="dateofjoining" className="form-label required">
							Date Of Joining*
						</label>
					</span>
					<input
						type="date"
						className={`form-control ${
							formErrors &&
							(formErrors?.dateOfJoining ? "is-invalid" : "is-valid")
						}`}
						id="dateofjoining"
						name="dateofjoining"
						value={dateOfJoining}
						onChange={(e) => {
							setDateOfJoining(e.currentTarget.value);
						}}
					/>
					<div className="invalid-feedback">
						Please select valid date of joining, and date should not be in
						advanced
					</div>
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
					>
						<option value="">Select Employee Type</option>
						<option value="FullTime">Full Time</option>
						<option value="PartTime">Part Time</option>
						<option value="Contract">Contract</option>
						<option value="Seasonal">Seasonal</option>
					</select>
					<div className="invalid-feedback">Please select a title</div>
				</div>

				<div className="my-4 text-center">
					<button
						type="button"
						className="btn btn-primary"
						onClick={handleSubmit}
					>
						Add Employee
					</button>
				</div>
			</form>
		</>
	);
}

export default EmployeeCreate;
