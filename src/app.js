require('dotenv').config();
const express = require('express');
require('./db/conn');
const hbs = require('hbs');
const path = require('path');
const bcrypt=require('bcryptjs');
const register = require('./models/registers');

const PORT = process.env.PORT || 8000;
const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const staticPath = path.join(__dirname, "../public")
app.use(express.static(staticPath));  // use for static file path  

const ViewsPath = path.join(__dirname, "../templates/views")
app.set("view engine", "hbs");
app.set("views", ViewsPath)

const partialsPath = path.join(__dirname, "../templates/partials")
hbs.registerPartials(partialsPath);

app.get('/', (req, res) => {
    res.status(200);
    res.render('index')
})

app.get('/login', (req, res) => {
    res.status(200);
    res.render('login');
})

app.get('/register', (req, res) => {
    res.status(200);
    res.render('register')
})
app.post("/login", async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    try {
        // console.log(name);
        // console.log(password);
        // console.log(email);
        // console.log(password);

        // console.log(typeof(email));
        // console.log(typeof(password));
        const data=await register.findOne({email:email});

        // console.log(data);
        
        // console.log(data.password);
        // console.log(typeof(data.password));


        const match=await bcrypt.compare(password,data.password);


        const token=await user.generateAuthToken();
        console.log(token);

    

        if(match)
        {
            res.status(200).render("index");
        }
        else
        {
            res.send("Invaild Credentials!!")
        }
    } catch (e) {
        res.send("Invaild Credentails!!")
    }
})

// const securePassword=async(password)=>{
//     const passwordHash=await bcrypt.hash(password,4);
//     console.log(passwordHash);
//     return passwordHash;
//     // const check=await bcrypt.compare("Sujal2712",passwordHash);
//     // console.log(check);
//}
app.post('/register', async (req, res) => {
    // console.log(req.body.fname);
    // console.log(req.body.email);
    // console.log(req.body.phone);
    // console.log(req.body.confirmpassword);

    const password = req.body.password;
    const cpassword = req.body.confirmpassword;

    // console.log(req.body.city);

    if (password === cpassword) {
        const employeeRegister = new register({
            fname: req.body.fname,
            lname: req.body.lname,
            email: req.body.email,
            phoneno: req.body.phone,
            gender: req.body.gender,
            address: {
                addressline: req.body.address,
                country: req.body.country,
                city: req.body.city,
                postalcode: req.body.postal
            },
            aadharno: req.body.aadhar,
            password: req.body.password
        })

        const token=await employeeRegister.generateAuthToken();
        console.log(token);

        res.cookie("jwt",token,{
            expires:new Date(Date.now()+30000),
            httpOnly:true
        })
        // const data = await employeeRegister.save();
        res.status(201).render("login");
    }
    else {
        res.send("Passwords are not match")
    }
})

// securePassword("Sujal@2712");
const jwt=require('jsonwebtoken');
app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
})
