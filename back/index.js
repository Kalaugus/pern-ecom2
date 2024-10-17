const express = require('express');
const app = express();
const  pool  = require('./db');
const bcrypt = require('bcrypt');


const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));


app.get('/', (req, res) => {
    res.redirect('user/login');});

app.get('/user/register', (req, res) => {
    res.render('register');});
    
app.post('/user/register', async(req, res) => {
        let { name, email, password,password2 } = req.body;
        console.log({
            name,
            email,
            password,
            password2
        });
        let id = Math.floor(Math.random() * 1000000000);
    
        try {
            let user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
             console.log(user.rows);
    
            if (user.rows.length > 0) {
                return res.render('register', {
                    message: 'User already registered'
                });
            }
    
            let salt = await bcrypt.genSalt(10);
            let hash = await bcrypt.hash(password, salt);
            console.log(hash);
    
            await pool.query(
                "INSERT INTO users (id, name, email, password) VALUES ($1, $2, $3,$4)",
                [id, name, email, hash]
            );
            res.redirect('login');
        } catch (err) {
            res.render('register', { message: err });
            console.error(err.message);
        
        }
    
    });
app.get('/user/login', (req, res) => {
    res.render('login');});
//WIP
app.post('/user/login', async(req, res) => {
        let { email, password } = req.body;
        console.log({
            email,
            password
        });
        try {
            console.log('User is logging in');
            let user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
            console.log(user.rows);
    
            if (user.rows.length === 0) {
                return res.render('login', {
                    message: 'User not registered'
                });
            }
            console.log(user.rows[0].password, password);
    
            let isMatch = await bcrypt.compare(password, user.rows[0].password);

            
    
            if (isMatch) {   
                let auth = true;
                res.render('dash', {auth: auth,id: user.rows[0].id,user: user.rows[0].name});
                console.log('User is logged in');             

            } else {
                res.render('login', {
                message: 'Password is incorrect'
                });
            }
        } catch (err) {
            res.render('login', { message: err });
            console.error(err.message);
        }
    
    });

app.get('/user/dash', async(req, res) => {
    console.log(req.params);
    if (req.params.auth == true) {
        id = req.params.id;
        pet = await pool.query("SELECT pets.pet_name FROM pets JOIN user ON pets.owner = users.id WHERE id = $1", [id]);

        res.render('dash');
    } else {
        res.redirect('login');
    }
} ); 
app.get('/user/logout', (req, res) => {
    
    res.render('logout');});


 


                    
app.listen(PORT, () => {
    console.log('Server is running on http://localhost:'+PORT);});  


