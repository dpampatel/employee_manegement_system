import mongoose from "mongoose";

const uri =
	"mongodb+srv://<username>:<password>@cluster0.rhp25qd.mongodb.net/EMS?retryWrites=true&w=majority";
mongoose
	.connect(uri, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => {
		console.log(
			"===============================Connected to Mongodb Successfully !!!============================="
		);
	})
	.catch((err) => {
		console.log(
			`######### not Connected due to the error below ##########\n${err}`
		);
	});

const userSchema = mongoose.Schema({
	firstName: { type: String, required: true },
	lastName: { type: String, required: true },
	age: { type: Number, required: true },
	dateOfJoining: { type: Date, required: true, default: new Date() },
	title: { type: String, required: true },
	department: { type: String, required: true },
	employeeType: { type: String, required: true },
	currentStatus: { type: Boolean, required: true, default: 1 },
});

const UserModel = mongoose.model("employee", userSchema);

export default UserModel;
