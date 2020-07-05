const db = require("../db");

const routePostRegister = (req, res, next) => {
    let context = {};
    if (!req.body.username || !req.body.password) {
        context.message='username and/or password is blank';
        context.messageClass = 'alert-danger';
        return res.render('register', context);
    }
    
    if (req.body.password !== req.body.confirmPassword) {
        context.message = 'password and confirm password do not match';
        context.messageClass = 'alert-danger';
        return res.render('register', context);
    }

    db.get(`SELECT * FROM user WHERE username = ?`, req.body.username, (err, row) => {
        if (err) {
            return console.error(err.message);
        }
        if (row) {
            context.message = 'username already exists';
            context.messageClass = 'alert-danger';
            return res.render('register', context);
        }

        let params = [req.body.username, req.body.password];
        db.run(`INSERT INTO user(username, password_plaintext) VALUES(?, ?)`, params, function(err) {
            if (err) {
                return console.log(err.message);
            }
            console.log(`user added successfully with id ${this.lastID}`);
        });

        res.render('register', context);
    });
};

module.exports = routePostRegister;