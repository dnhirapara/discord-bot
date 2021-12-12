const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();
const dbConfig = require('./src/config/db.config.js');
const mongoose = require('mongoose');
const bot = require('./src/bot');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 7000;

app.use(cors());
app.use(helmet());

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, '/src/views/index.html'));
});

const connectWithDB = async () => {
	await mongoose
		.connect(dbConfig.url, {
			useUnifiedTopology: true,
			useNewUrlParser: true,
		})
		.then((connection) => {
			console.log(`Connected with Database: ${connection.connection.name}`);
		})
		.catch((err) => {
			console.error(err);
			process.exit(0);
		});
};

connectWithDB().then(() => {
	bot.start();
	app.listen(PORT, () => {
		console.log(`Connected on port : ${PORT}`);
	});
});