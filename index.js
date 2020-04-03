const Discord = require("discord.js");
const client = new Discord.Client();
const axios = require("axios");
require("dotenv").config();
const { BOT_TOKEN, REQ_LINK, CHANNEL_ID } = process.env;

let check = () => {
  axios.get(`${REQ_LINK}/api/test`).then(res => {
    client.channels.cache.get(CHANNEL_ID).send(res.data.message);
  });
  setTimeout(() => check(), 1000 * 60 * 60 * 12); //every 12 hours
};

client.once("ready", () => {
  check();
  console.log("Discord Ready!");
});

client.on("message", message => {
  console.log("message obtained");
  if (message.channel.id === CHANNEL_ID) {
    let content = message.content;
    // console.log(content)
    let checkPre = content.split("");
    // console.log(splitCont)
    let reqFormat = content.replace(/[#]/g, "%23");
    let command = reqFormat.split(" ");
    console.log(reqFormat);
    switch (checkPre[0]) {
      case "#":
        axios.post(`${REQ_LINK}/api/ban?tag=${reqFormat}`).then(res => {
          message.reply(res.data.message);
        });
        break;
      case "!":
        switch (command[0]) {
          case "!scan":
            axios.get(`${REQ_LINK}/api/test`).then(res => {
              client.channels.cache.get(CHANNEL_ID).send(res.data.message);
            });
            break;
          case "!ban":
            axios.post(`${REQ_LINK}/api/ban?tag=${command[1]}`).then(res => {
              message.reply(res.data.message);
            });
            break;
          case "!list":
            axios.get(`${REQ_LINK}/api/list`).then(res => {
              client.channels.cache.get(CHANNEL_ID).send(res.data.message);
            });
            break;
          case "!unban":
            axios
              .delete(`${REQ_LINK}/api/unban?tag=${command[1]}`)
              .then(res => {
                message.reply(res.data.message);
              });
            break;
          default:
            null;
        }

        break;
      default:
        null;
    }
  }
});

client.login(BOT_TOKEN);
