const router = require('express').Router();
const users = require("../users/users-model.js");
const bcrypt = require('bcryptjs');


router.post('/register', async (req, res, next) => {
    let user = req.body;
    const hash = bcrypt.hashSync(user.password, 8);
    user.password = hash;

    try {
        const saved = await users.add(user);
        res.status(201).json(saved)
    } catch (error) {
        next({ apiCode: 500, apiMessage: 'error registering', ...err })
    }
})


router.post('/login', async (req, res) => {
    let {username, password} = req.body;


    try {
        const [user] = await users.findBy({ username });
        if (user && bcrypt.compareSync(password, user.password)) {
            req.session.user = user;
            console.log('added user to req.session')
            res.status(200).json({ message: `welcome ${user.username}!, have a cookie`});
        } else {
            next({ apiCode: 401, apiMessage: 'invalid credentials'});
        }
    } catch (error) {
        next({ apiCode: 500, apiMessage: 'error logging in', ...err })
    }
});


router.get('/logout', (req, res) => {
    if (req.session) {
        req.session.destroy(err => {
            if (err) {
                next({ apiCode: 400, apiMessage: 'error loggin out', ...err })
            } else {
                res.send('So long and thanks for all the fish....');
            }   
        });
    } else {
        res.send('already logged out')
    }
})

module.exports = router;


