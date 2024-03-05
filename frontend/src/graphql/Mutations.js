import { gql } from "@apollo/client";

export const CREATE_EMPLOYEE = gql`
	mutation Mutation($employee_details: employee_data) {
		createEmployee(employee_details: $employee_details) {
			_id
			firstName
			lastName
			age
			dateOfJoining
			title
			department
			employeeType
			currentStatus
			retire
			remaining
		}
	}
`;

export const DELETE_EMPLOYEE = gql`
	mutation DeleteEmployee($employee_id: ID!) {
		deleteEmployee(employee_id: $employee_id) {
			_id
		}
	}
`;

export const UPDATE_EMPLOYEE = gql`
	mutation Mutation($employee_id: ID!, $employee_details: employee_data) {
		updateEmployee(
			employee_id: $employee_id
			employee_details: $employee_details
		) {
			title
			department
			currentStatus
		}
	}
`;
