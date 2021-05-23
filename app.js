const express = require('express');
const dotenv = require('dotenv').config();
const app = express();
const cors = require('cors');
const db = require('./db');
const user = require('./controllers/usercontroller');
const game = require('./controllers/gamecontroller');

db.sync().then(() => {
    app.use(cors());
    app.use(require('body-parser').json());
    app.use('/api/auth', user);
    app.use(require('./middleware/validate-session'))
    app.use('/api/game', game);
    app.listen(process.env.PORT, function() { // add port
        console.log(`App is listening on ${process.env.PORT}`);
    });
}).catch(e => console.log(`ERROR ${e}`));
