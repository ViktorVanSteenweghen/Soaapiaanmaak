const fs = require("fs/promises");
const express = require("express");
const cors = require("cors");
const _ = require("lodash");
const {v4: uuidv4} = require("uuid");
const dotenv = require("dotenv");

dotenv.config();
const app = express();

const {Client} = require('pg');
const { URLSearchParams } = require("url");

const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false

    }
});

client.connect();




 app.get("/sports/all", (req, res) => {
    client.query("SELECT * FROM sports", (err, result) => {
        if (err) {
            res.status(500).send(err);
        }
        res.send(result.rows);
    });
}) 

app.get("/sports/id/:id",  (req, res) => {
    const id = req.params.id;
    client.query("SELECT * FROM sports WHERE id = $1", [id], (err, result) => {
        if (err) {
            res.send(err);
        }
        res.send(result.rows);
    });
});

app.post("/sports/add", async (req, res) => {
    const urlparams = new URLSearchParams(req.query);
    const name = urlparams.get("name");
    const players_in_team = urlparams.get("players_in_team");
    client.query("INSERT INTO sports (name, players_in_team) VALUES ($1, $2)", [name, players_in_team], (err, result) => {
        if (err) {
            res.send(err);
        }
        res.send(result.rows);
    });
});


app.delete("/sports/delete/:id", async (req, res) => {
    const id = req.params.id;
    client.query("DELETE FROM sports WHERE id = $1", [id], (err, result) => {
        if (err) {
            res.send(err); 
        }
        res.send(result.rows);
    });
});

app.put("/sports/update/:id", async (req, res) => {
    const id = req.params.id;
    const urlparams = new URLSearchParams(req.query);
    const name = urlparams.get("name");
    const players_in_team = urlparams.get("players_in_team");
    client.query("UPDATE sports SET name = $1, players_in_team = $2 WHERE id = $3", [name, players_in_team, id], (err, result) => {
        if (err) {
            res.send(err);
        }
        res.send(result.rows);
    });
});


app.listen(process.env.PORT || 3000);