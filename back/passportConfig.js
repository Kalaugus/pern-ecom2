const localStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const pool  = require('./db.js');

function initialize(passport) {
    passport.use(new localStrategy({
        usernameField: 'email',
        passwordField: 'password'
    }, async(email, password, done) => {
        console.log(email);
        pool.query( "SELECT * FROM users WHERE email = $1", [email]) 
        .then((user) => {
            console.log(user.rows);
            if (user.rows.length === 0) {
                return done(null, false, { message: 'User not found' });
            }
            bcrypt.compare(password, user.rows[0].password, (err, isMatch) => {
                if (err) throw err;
                if (isMatch) {
                    return done(null, user.rows[0]);
                } else {
                    return done(null, false, { message: 'Password incorrect' });
                }
            });
        })
        .catch((err) => {
            console.error(err.message);
        });
    }
    ));
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });
    passport.deserializeUser((id, done) => {
        pool.query("SELECT * FROM users WHERE id = $1", [id], (err, user) => {
            done(err, user.rows[0]);
        });
    });

}

