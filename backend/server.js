"use strict";
const dotenv = require("dotenv");
const express = require('express');
var cors = require('cors');
dotenv.config({});
const app = express();
const PORT = process.env.port || 4444;
const routes = require('./routes');
const db = require("./db/db-config");

app.use(cors())
app.use(express.json());

db.sequelize.sync({force: true}).then(() => {
  db.seed();
  console.log("Database Sync Completed");
}).catch(err => console.log(err));

app.get("/", (req, res) => {res.send("Healthy!") });
app.post('/api/v1/login', routes.login);
app.get('/api/v1/buses', routes.buses);
app.post('/api/v1/booking', routes.booking);
app.get('/api/v1/bookings/:user_id', routes.bookings);

app.listen(PORT, () => console.log(`listening on http://localhost:${PORT}`) );

