const express = require('express');
const port = 3000;
const path = require('path');
const mongoose = require('mongoose');
const User = require('./models/users');
const methodOverride = require('method-override'); // Put & Delete
const ejsMate = require('ejs-mate');

// Database Connection
mongoose.connect('mongodb://127.0.0.1:27017/playground')
    .then(() => console.log("Database connected"))
    .catch((e) => console.log(e))


const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));


app.get('/', (req, res) => {
    res.render('home');
});

app.get('/users', async (req, res) => {
    try {
        const users = await User.find({});
        // console.log({users});
        res.render('users/index', { users });
    } catch (e) {
        res.send(`index route problem hai. <br> ${e}`);
    }
})

app.get('/users/new', (req, res) => {
    res.render('users/new');
})

app.post('/users', async (req, res) => {
    try {
        const user = new User(req.body.user);
        await user.save();
        res.redirect(`users/${user._id}`);
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
        const {id} = req.params;
        const user = await User.findByIdAndUpdate(id, req.body.user);
        res.redirect(`/users/${user._id}`);
    } catch (e) {
        res.send(`edit ke put route me problem hai. <br> ${e}`); 
    }
})

app.delete('/users/:id', async (req, res) => {
    try {
        const {id} = req.params;
        await User.findByIdAndDelete(id);
        res.redirect(`/users`);
    } catch (e) {
        res.send(`delete route me problem hai. <br> ${e}`); 
    }
})



// seed data
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


app.listen(port, () => {
    console.log(`App is running on ${port}`);
})