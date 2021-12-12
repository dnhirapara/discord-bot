const { CreateBroadCast, RefreshToken } = require('./routes')
const User = require('./models/UserModel');
const { parseString, toCode, toInlineCode } = require('./utils')


const { Client, Intents } = require('discord.js')

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
const PREFIX = '$';

module.exports = {
    start: () => {
        client.on("ready", () => {
            console.log(`${client.user.tag} has logged in.`);
        });

        client.on("messageCreate", async (message) => {
            if (message.author.bot) return;
            if (message.content.startsWith(PREFIX)) {
                const [CMD_NAME, ...args] = message.content.trim()
                    .substring(PREFIX.length).replace(/[ ]+/g, " ").split(" ");
                console.log(CMD_NAME);
                console.log(args);
                if (CMD_NAME === 'create') {
                    const userData = await User.findOne({ username: message.author.tag });
                    console.log(userData.expiry);
                    console.log(Date.now());
                    if (userData.expiry <= Date.now()) {
                        const tokenData = await RefreshToken(userData.refresh_token);
                        console.log(tokenData);
                        userData.expiry = (Number(tokenData.expires_in) * 1000) + Date.now() - 5;
                        userData.access_token = tokenData.access_token;
                        userData.id_token = tokenData.id_token;
                        await userData.save();
                    }
                    // console.log(userData);
                    if (!userData.title || !userData.description) {
                        message.reply(`title or description not available. Please set it by ${toInlineCode('$set \{title:<title>, description:<description>\}')}`)
                    }
                    const newTitle = parseString(userData.title, 0, Date.now());
                    const res = await CreateBroadCast({ title: newTitle, description: userData.description, access_token: userData.access_token });
                    // console.log(res);
                    message.reply(`msg \`\`\`${JSON.stringify(res)}\`\`\``);
                } else if (CMD_NAME === 'set') {
                    try {
                        let userData = await User.findOne({ username: message.author.tag });
                        let newData = JSON.parse(args.join(" "));
                        console.log(args.join(" "));
                        const keys = Object.keys(newData);
                        console.log(keys);
                        for (let i of keys) {
                            userData[i] = newData[i];
                        }
                        await userData.save();
                        message.reply("Data Saved Successfully!!!")
                    } catch (e) {
                        console.log(e);
                        message.reply("ERROR: " + e)
                    }
                } else if (CMD_NAME === 'setimage') {
                    let userData = await User.findOne({ username: message.author.tag });
                    userData.imageURL = message.attachments.first().url;
                    await userData.save();
                    message.reply("Image uploaded Successfully!!!");
                }
            }
        });

        client.login(process.env.DISCORDJS_BOT_TOKEN);
    }
};