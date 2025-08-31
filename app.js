if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}


const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const User = require('./models/users');
const methodOverride = require('method-override'); // Put & Delete
const ejsMate = require('ejs-mate');


// Database Connection
const dbUrl = process.env.DB_URL || 'mongodb://127.0.0.1:27017/playground';
mongoose.connect(dbUrl)
    .then(() => console.log("Database connected"))
    .catch((e) => console.log(e))

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));  // To use statics file (css, js)



app.get('/', (req, res) => {
    res.render('home');
});

app.get('/users', async (req, res) => {
    try {
        const { skill } = req.query;
        let users;
        if (skill) {
            // Case-insensitive search in skills array
            users = await User.find({ skills: { $regex: skill, $options: "i" } });
        } else {
            users = await User.find({});
        }

        res.render('users/index', { users, skill });
    } catch (e) {
        res.send(`index route problem hai. <br> ${e}`);
    }
})

app.get('/users/new', (req, res) => {
    res.render('users/new', { user: {} });
})

app.post('/users', async (req, res) => {
    try {
        let userData = req.body.user;

        // Convert skills string into array
        if (userData.skills) {
            userData.skills = userData.skills.split(",").map(s => s.trim());
        }

        const newUser = new User(userData);
        await newUser.save();
        res.redirect(`users/${newUser._id}`);
    } catch (e) {
        res.send(`new ke post route problem hai. <br> ${e}`)
    }

})

app.get('/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        res.render('users/show', { user });
    } catch (e) {
        res.send(`show route problem hai. <br> ${e}`)
    }
})

app.get('/users/:id/edit', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        res.render('users/edit', { user });
    } catch (e) {
        res.send(`edit route problem hai. <br> ${e}`)
    }
})

app.put('/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        let userData = req.body.user;

        // Convert skills string into array
        if (userData.skills) {
            userData.skills = userData.skills.split(",").map(s => s.trim());
        }

        const user = await User.findByIdAndUpdate(id, userData);
        res.redirect(`/users/${user._id}`);
    } catch (e) {
        res.send(`edit ke put route me problem hai. <br> ${e}`);
    }
})

app.delete('/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await User.findByIdAndDelete(id);
        res.redirect(`/users`);
    } catch (e) {
        res.send(`delete route me problem hai. <br> ${e}`);
    }
})



// seed dummy data
// app.get('/makeuser', async (req, res) => {
//     const user = new User({name: 'Tim', 
//         email: 'tim@gmail.com', 
//         education: "IIITN", 
//         skills:['c++', 'python'], 
//         projects:[{title: 'PinDrop', 
//         description: "This is my project"}], 
//         works: [{company: 'google'}, {company: 'microsoft'}], 
//         link: {github: "github.com", 
//         linkedin: "linkedin.com"} });
// //    await user.save();
//     res.send(user);
// })


// Starting server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`App is running on ${port}`);
})