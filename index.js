const Discord = require("discord.js");
const client = new Discord.Client();
const axios = require("axios");
require("dotenv").config();
const { BOT_TOKEN, REQ_LINK  } = process.env;

client.once("ready", () => {
  console.log("Discord Ready!");
});

client.on("message", message => {
  console.log('message obtained')
  let content = message.content;
  // console.log(content)
  let splitCont = content.split('');
  // console.log(splitCont)
  let reqFormat = content.replace(/[#]/g, '%23');
  console.log(reqFormat)
  splitCont[0] === "#"
  ? 
  // console.log('message processing...')
  axios.post(`${REQ_LINK}/api/ban?tag=${reqFormat}`).then(res => {
        message.reply(res.data.message);
      })
    : null;
});

// function check() {
//   axios.get(`${REQ_LINK}/api/test`).then(res => {

//   })
// }



client.login(BOT_TOKEN)