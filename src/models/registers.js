const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require('bcryptjs');
const jwt=require('jsonwebtoken');
const employeeSchema = new mongoose.Schema({
    fname: {
        type: String,
        required: true,
        minlength: 3,
    },
    lname: {
        type: String,
        required: true,
        minlength: 3,
    },
    email: {
        type: String,
        required: true,
        unique: [true, "Email is already taken"],
        validate(value) {
            if (!validator.isEmail(value)) throw new Error("Invalid Email");
        },
    },
    phoneno: {
        type: Number,
        required: true,
        unique: true,
        validate(value) {
            if (!value.toString().length === 10) {
                throw new Error("Mobile no must have 10 digits");
            }
        },
    },
    gender: {
        type: String,
        required: true,
    },
    address: {
        addressline: {
            type: String,
            required: true
        },
        country: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        postalcode: {
            type: Number,
            required: true
        },
    },
    aadharno: {
        type: Number,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]
});
// console.log(process.env.SECRET_KEY);
employeeSchema.methods.generateAuthToken = async function()
{
    try {
        const token=jwt.sign({_id:this._id},process.env.SECRET_KEY);
        this.tokens=this.tokens.concat({token:token});

        await this.save();
        return token;
    } catch (error) {
        console.log(error);
    }
}

employeeSchema.pre("save", async function () {
    // console.log(this.password);
    this.password = await bcrypt.hash(this.password, 4);
    // console.log(this.password);
})

const Employee = new mongoose.model("EmployeeReg", employeeSchema);

module.exports = Employee;
