require('dotenv').config();
const dbConfig = require("./config/db.config.js");
const mongoose = require("mongoose");

const { CreateBroadCast } = require('./routes')
const User = require('./models/UserModel');


const { Client, Intents } = require('discord.js')

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
const PREFIX = '$';

client.on("ready", () => {
    console.log(`${client.user.tag} has logged in.`);
});

client.on("messageCreate", async (message) => {
    if (message.author.bot) return;
    if (message.content.startsWith(PREFIX)) {
        const [CMD_NAME, ...args] = message.content.trim()
            .substring(PREFIX.length).split(/\s+/);
        console.log(CMD_NAME);
        console.log(args);
        if (CMD_NAME == 'create') {
            const userData = await User.findOne({ username: message.author.tag });
            // console.log(userData);
            const res = await CreateBroadCast({ title: "HELLO", description: "HELLO", access_token: userData.access_token });
            console.log(res);
            message.reply(`msg ${res.snippet.title}`);
        }
    }

    console.log(message.author.id);
    console.log(`${message.author.tag} : ${message.content}`);
    console.log(`${message.channel} and ID: ${message.channelId}`)
});

const connectWithDB = async () => {
    // console.log(dbConfig.url)
    // console.log(process.env.DB_URL)
    await mongoose
        .connect(dbConfig.url, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            // useFindAndModify: false,
            // useCreateIndex: true,
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
    client.login(process.env.DISCORDJS_BOT_TOKEN)
})
