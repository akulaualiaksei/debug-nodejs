const router = require('express').Router(); // fix Router
const bcrypt = require('bcryptjs'); // install bcrypt
const jwt = require('jsonwebtoken');

const User = require('../db').import('../models/user');
const EXPIRES_IN_SECONDS = 60 * 60 * 24;

router.post('/signup', (req, res) => {
  User.create({
    full_name: req.body.user.full_name,
    username: req.body.user.username,
    passwordHash: bcrypt.hashSync(req.body.user.password, process.env.SALT),
    email: req.body.user.email,
  })
    .then(
      function signupSuccess(user) {
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
          expiresIn: EXPIRES_IN_SECONDS,
        });
        res.status(200).json({
          user: user,
          token: token,
        });
      },

      function signupFail(err) {
        res.status(500).send(err.message);
      }
    )
    .catch((e) => console.log(e));
});

router.post('/signin', (req, res) => {
  User.findOne({ where: { username: req.body.user.username } }).then((user) => {
    if (user) {
      bcrypt.compare(
        req.body.user.password,
        user.passwordHash,
        function (err, matches) {
          if (matches) {
            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
              expiresIn: EXPIRES_IN_SECONDS,
            });
            res.json({
              user: user,
              message: 'Successfully authenticated.',
              sessionToken: token,
            });
          } else {
            res.status(502).send({ error: 'Passwords do not match.' });
          }
        }
      );
    } else {
      res.status(403).send({ error: 'User not found.' });
    }
  });
});

module.exports = router;
