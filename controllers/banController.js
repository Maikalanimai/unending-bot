require("dotenv").config();
const { API_TOKEN } = process.env;

const clashApi = require("clash-of-clans-api");
let client = clashApi({
  token: API_TOKEN
});

module.exports = {
  banUser(req, res) {
    const db = req.app.get("db");
    const { id } = req.query;
    //!Make sure id is formated as %23 tag no hash when sent to server
    db.check_banned_user(id).then(result => {
      // console.log(result);
      if (result[0]) {
        return res.status(409).send({ message: "User Already in Ban list" });
      } else {
        db.add_banned_user(id).then(() => {
          return res
            .status(200)
            .send({ message: `User ${id} was added to the ban list` });
        });
      }
    });
  },
  async test(req, res) {
    let members = [];
    const db = req.app.get("db");
    let banMemExist = false;
    let message = null;
    function send() {
      // console.log("send Fired");
      banMemExist !== false
        ? res.status(200).send({ message })
        : res.status(200).send({ message: "No banned members in the clans" });
    }
    await client.clanMembersByTag("#9VG088JL").then(responseUn => {
      members = responseUn.items.map(e => {
        return e.tag;
      });
      client.clanMembersByTag("#Y2GRV0V").then(responseTso => {
        responseTso.items.map(e => members.push(e.tag));
      });
    });
    await db.get_banned_users().then(result => {
      console.log(result);
      result.forEach(e => {
        if (members.includes(e.tag)) {
          client.playerByTag(e.tag).then(playerData => {
            // console.log(playerData)
            banMemExist = true;
            console.log(banMemExist);
            if (!message) {
              message = `User ${playerData.name} with a tag of ${playerData.tag} is banned and is currently in one of the clans.`;
            } else {
              message += ` User ${playerData.name} with a tag of ${playerData.tag} is also banned and is currently in one of the clans.`;
            }
          });
        }
      });
    });
    setTimeout(() => send(), 1000);
  }
};
