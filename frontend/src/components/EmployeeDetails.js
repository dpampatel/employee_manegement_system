import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { DELETE_EMPLOYEE } from "../graphql/Mutations";
import { GET_ALL_EMPLOYEES, GET_EMPLOYEE_DETAILS } from "../graphql/Queries";
import { useNavigate, useParams } from "react-router-dom";

const EmployeeDetails = ({ view_page, delete_page }) => {
	const navigate = useNavigate();
	const [showModal, setShowModal] = useState("");
	const [deleteEmployee, { data_d, loading_d, error_d }] = useMutation(
		DELETE_EMPLOYEE,
		{
			onError: (error) => {
				setShowModal(error.message);
				console.error("Error deleting employee:", error);
			},
			onCompleted: () => {
				console.log("Employee deleted successfully");
				//navigate("/list");
				window.location.pathname = "list";
			},
		}
	);

	console.log("deleted data", data_d);

	const { employee_id } = useParams();
	console.log(`url paramaeter:${employee_id}`);

	const { loading, error, data } = useQuery(GET_EMPLOYEE_DETAILS, {
		variables: { employee_id },
	});
	if (loading) return <p>Loading...</p>;
	if (error) return <p>Error: {error.message}</p>;

	const handleSubmit = (e) => {
		e.preventDefault();
		deleteEmployee({
			variables: { employee_id },
			refetchQueries: [{ query: GET_ALL_EMPLOYEES }],
		});
	};
	const handleBack = (e) => {
		e.preventDefault();
		navigate(-1);
	};
	// useEffect(() => {}, []);
	const employee = data.getEmployeeById;
	if (error) {
		console.log(error);
	}
	return (
		<>
			<div className="container mt-4">
				<div className="row justify-content-center">
					<div className="col-md-8">
						<h2 className="text-center mb-4">Employee Details</h2>
						<table className="table table-striped table-bordered">
							<tbody>
								<tr>
									<th style={{ width: "200px" }}>Name:</th>
									<td>{`${employee.firstName} ${employee.lastName}`}</td>
								</tr>
								<tr>
									<th>Age:</th>
									<td>{employee.age}</td>
								</tr>
								<tr>
									<th>Date of Joining:</th>
									<td>{employee.dateOfJoining}</td>
								</tr>
								<tr>
									<th>Title:</th>
									<td>{employee.title}</td>
								</tr>
								<tr>
									<th>Department:</th>
									<td>{employee.department}</td>
								</tr>
								<tr>
									<th>Employee Type:</th>
									<td>{employee.employeeType}</td>
								</tr>
								<tr>
									<th>Status:</th>
									<td>{employee.currentStatus ? "Working" : "Retired"}</td>
								</tr>
								<tr>
									<th>Time until retirement:</th>
									<td>{employee?.remaining || ""}</td>
								</tr>
							</tbody>
						</table>

						{view_page && (
							<div className="text-center">
								{/* <Link to="/list" className="btn btn-primary">
									Back to Employee List
								</Link> */}
								<a
									className="btn btn-primary"
									onClick={(e) => {
										e.preventDefault();
										navigate(-1);
									}}
								>
									Back to Employee List
								</a>
							</div>
						)}
						{delete_page && (
							<div className="text-center">
								<p className="text-danger">
									Are you sure you want to delete the employee?
								</p>
								{showModal && (
									<div className="alert alert-danger" role="alert">
										{showModal}
									</div>
								)}
								<button onClick={handleSubmit} className="btn btn-danger">
									Delete
								</button>
								<button onClick={handleBack} className="btn btn-primary mx-3">
									Back
								</button>
							</div>
						)}
					</div>
				</div>
			</div>
		</>
	);
};

export default EmployeeDetails;
