console.log("Welcome From this GraphQl App !!!");
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import UserModel from "./models/UserModel.js";

function dateDifference(startDate, endDate) {
	const start = new Date(startDate);
	const end = new Date(endDate);

	let years = end.getFullYear() - start.getFullYear();
	let months = end.getMonth() - start.getMonth();
	let days = end.getDate() - start.getDate();

	if (days < 0) {
		const monthDays = new Date(end.getFullYear(), end.getMonth(), 0).getDate();
		days += monthDays;
		months--;
	}

	if (months < 0) {
		months += 12;
		years--;
	}

	return {
		years: years,
		months: months,
		days: days,
	};
}

function getRemainingTime(dateOfJoining, currentAge) {
	const retirementAge = 65,
		joining = new Date(dateOfJoining),
		joiningDate = joining.getDate(),
		joiningMonth = joining.getMonth(),
		retirementYear = joining.getFullYear() - currentAge + retirementAge,
		retirementDate = new Date(retirementYear, joiningMonth, joiningDate);

	return dateDifference(new Date(), retirementDate);
}

// Writing Schema in typeDefs
const typeDefs = `
scalar Date
scalar Boolean

type Employee {
    _id: ID
    firstName: String
    lastName: String
    age: Int
    dateOfJoining: Date
    title: String
    department: String
    employeeType : String
    currentStatus : Boolean
	retire : String
	remaining : String
}
input employee_data {
    firstName: String
    lastName: String
    age: Int
    dateOfJoining: Date
    title: String
    department: String
    employeeType : String
    currentStatus : Boolean
	retire : String
}

type Query {
    getAllEmployees(filters:employee_data): [Employee]
    getEmployeeById(user_id: ID!): Employee
}

type Mutation{
    createEmployee(employee_details: employee_data): Employee
	deleteEmployee(employee_id: ID!): Employee
	updateEmployee(employee_id: ID!, employee_details: employee_data): Employee
}
`;

const resolvers = {
	Query: {
		getAllEmployees: async (parent, args, context, info) => {
			try {
				let query = {},
					filters = args.filters,
					retire = "";
				if (filters && Object.keys(filters).length > 0) {
					if (filters.firstName) {
						filters.firstName = { $regex: filters.firstName, $options: "i" };
					}
					if (filters.lastName) {
						filters.lastName = { $regex: filters.lastName, $options: "i" };
					}
					if (filters.retire) {
						retire = filters.retire;
						delete filters.retire;
					}
					query = { ...filters };
				}
				const employees = await UserModel.find(query);
				const updated_employees = employees.map((emp) => {
					const l_employee = JSON.parse(JSON.stringify(emp));
					const remainingTime = getRemainingTime(
							l_employee.dateOfJoining,
							l_employee.age
						),
						remainingTimeString = `${remainingTime.days} days, ${remainingTime.months} months, ${remainingTime.years} years`;

					l_employee.remaining = remainingTimeString;
					if (remainingTime.years < 1 && remainingTime.months < 6) {
						l_employee.retire = "Yes";
					} else {
						l_employee.retire = "No";
					}
					return l_employee;
				});
				let updated_filtered_employees = updated_employees;

				if (retire) {
					updated_filtered_employees = updated_employees.filter(
						(emp) => emp.retire == retire
					);
				}
				//console.log("YesNo: ", updated_filtered_employees[4]["retire"]);
				return updated_filtered_employees;
			} catch (error) {
				throw new Error("Unable to fetch employees");
			}
		},
		getEmployeeById: async (parent, args, context, info) => {
			try {
				const employee = await UserModel.findById(args.user_id);
				if (!employee) {
					throw new Error("Employee not found");
				}

				const options = { year: "numeric", month: "short", day: "numeric" };
				const formattedDate = new Intl.DateTimeFormat("en-US", options).format(
					new Date(employee.dateOfJoining)
				);
				const remainingTime = getRemainingTime(
						employee.dateOfJoining,
						employee.age
					),
					remainingTimeString = `${remainingTime.days} days, ${remainingTime.months} months, ${remainingTime.years} years`;
				let retire = "";
				if (remainingTime.years < 1 && remainingTime.months < 6) {
					retire = "Yes";
				} else {
					retire = "No";
				}
				return {
					...employee.toObject(),
					dateOfJoining: formattedDate,
					remaining: remainingTimeString,
					retire,
				};
			} catch (error) {
				throw new Error("Unable to fetch employee by ID");
			}
		},
	},
	Mutation: {
		createEmployee: async (parent, args, context, info) => {
			const { dateOfJoining } = args.employee_details;

			const user = new UserModel({
				...args.employee_details,
				dateOfJoining: new Date(dateOfJoining),
			});
			await user.save();
			return user;
		},
		deleteEmployee: async (parent, args, context, info) => {
			try {
				args.user_id = args.employee_id;
				const employee = await resolvers.Query.getEmployeeById(
					parent,
					args,
					context,
					info
				);
				if (employee.currentStatus) {
					throw new Error("Status Active");
				} else {
					const deletedEmployee = await UserModel.findByIdAndDelete(
						args.employee_id
					);
					if (!deletedEmployee) {
						throw new Error("Employee not found");
					}
					return deletedEmployee;
				}
			} catch (error) {
				throw new Error(`Can't Delete Employee: ${error.message}`);
			}
		},
		updateEmployee: async (parent, args, context, info) => {
			const employee = await UserModel.findById(args.employee_id);
			if (!employee) {
				throw new Error("Employee not found");
			}

			Object.assign(employee, args.employee_details);
			await employee.save();
			return employee;
		},
	},
};

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
	typeDefs,
	resolvers,
});

// Passing an ApolloServer instance to the `startStandaloneServer` function:
//  1. creates an Express app
//  2. installs your ApolloServer instance as middleware
//  3. prepares your app to handle incoming requests
const { url } = await startStandaloneServer(server, {
	listen: { port: 4000 },
});

console.log(`🚀  Server ready at: ${url}`);
