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
  let content = message.content;
  // console.log(content)
  let splitCont = content.split("");
  // console.log(splitCont)
  let reqFormat = content.replace(/[#]/g, "%23");
  console.log(reqFormat);
  // splitCont[0] === "#"
  //   ? // console.log('message processing...')
  //     axios.post(`${REQ_LINK}/api/ban?tag=${reqFormat}`).then(res => {
  //       message.reply(res.data.message);
  //     })
  //   : null;
  switch (splitCont[0]) {
    case "#":
      axios.post(`${REQ_LINK}/api/ban?tag=${reqFormat}`).then(res => {
        message.reply(res.data.message);
      })
    break;
    case '!':
      if(message.content === '!scan'){
        axios.get(`${REQ_LINK}/api/test`).then(res => {
          client.channels.cache.get(CHANNEL_ID).send(res.data.message);
        });
      }
  }
});

client.login(BOT_TOKEN);
