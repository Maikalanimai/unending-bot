require("dotenv").config();
const { API_TOKEN } = process.env;

const clashApi = require("clash-of-clans-api");
let client = clashApi({
  token: API_TOKEN
});

const guildList = [
  "#9VG088JL", //unending war
  "#Y2GRV0V", //General Tso
  "#9QJUUGUQ", //LV Lopi
  "#LOLPLYGQ", //Lost in Place
  "#RQGGLV20" //Betratron
];
const guildLeaderRoleId = [
  "688408385946779745", //Unending War
  "688481460214038567", //General Tso
  "689352805835603995", // LV Lopi
  "693653147301838858", //Lost in Place
  "690445118452269087" //Betatron
];

module.exports = {
  banUser(req, res) {
    const db = req.app.get("db");
    const { tag } = req.query;
    console.log("req.query", req.query);
    console.log("inside ban user in server", tag);
    //!Make sure id is formated as %23 tag no hash when sent to server
    db.check_banned_user(tag).then(result => {
      console.log(result);
      if (result[0]) {
        return res.status(200).send({ message: "User Already in Ban list" });
      } else {
        db.add_banned_user(tag).then(() => {
          client
            .playerByTag(tag)
            .then(playerData => {
              return res.status(200).send({
                message: `User ${tag} '${playerData.name}' was added to the ban list`
              });
            })
            .catch(err => {
              res.status(200).send({
                message: `User tag ${tag} does not exist.`
              });
            });
        });
      }
    });
  },
  unbanUser(req, res) {
    const db = req.app.get("db");
    const { tag } = req.query;
    console.log("inside unban user", tag);
    db.check_banned_user(tag).then(result => {
      console.log(result);
      if (result[0]) {
        db.unban_user(tag).then(() => {
          client
            .playerByTag(tag)
            .then(playerData => {
              return res.status(200).send({
                message: `User ${tag} '${playerData.name}' was removed from the ban list`
              });
            })
            .catch(err => {
              res.status(200).send({
                message: `User tag ${tag} was unable to be banned. <@&159764169636184064>`
              });
            });
        });
      } else {
        return res.status(200).send({ message: "User is not in the ban list" });
      }
    });
  },
  test(req, res) {
    const db = req.app.get("db");
    let members = [];
    guildList.forEach(guildTag => {
      client.clanMembersByTag(guildTag).then(guildMembers => {
        guildMembers.items.forEach(player => {
          members.push(player.tag);
        });
      });
    });
    setTimeout(
      () =>
        db.get_banned_users().then(result => {
          result.forEach(e => {
            if (members.includes(e.tag)) {
              client.playerByTag(e.tag).then(playerData => {
                res.status(200).send({
                  message: `User ${playerData.name} with a tag of ${playerData.tag} is banned and is currently in one of the clans. <@&${guildLeaderRoleId[0]}> <@&${guildLeaderRoleId[1]}> <@&${guildLeaderRoleId[2]}> <@&${guildLeaderRoleId[3]}> <@&${guildLeaderRoleId[4]}>`
                });
              });
            }
          });
        }),
      1500
    );
    setTimeout(() => {
      res.status(200).send({
        message: `No banned users detected`
      });
    }, 2500);

    //*WIP update adapted for multiple banned members simultaniously
    // let members = [];
    // const db = req.app.get("db");
    // let banMemExist = false;
    // let message = null;
    // console.log("testing running");
    // const send = () => {
    //   console.log("send Fired");
    //   banMemExist !== false
    //     ? res.status(200).send({ message })
    //     : res.status(200).send({ message: "No banned members in the clans" });
    // };
    // await Promise.all(
    //   guildList.map(tag => {
    //     client.clanMembersByTag(tag).then(response => {
    //       response.items.forEach(e => members.push(e.tag));
    //     });
    //   }), console.log('promise.all complete', members)
    // ).then(() => {

    //   db.get_banned_users().then(result => {
    //     console.log('banned users', result);
    //     result.forEach(e => {
    //       if (members.includes(e.tag)) {
    //         client.playerByTag(e.tag).then(playerData => {
    //         banMemExist = true;
    //           // console.log(playerData)
    //           console.log(banMemExist);
    //           if (!message) {
    //             message = `User ${playerData.name} with a tag of ${playerData.tag} is banned and is currently in one of the clans.`;
    //           } else {
    //             message += ` User ${playerData.name} with a tag of ${playerData.tag} is also banned and is currently in one of the clans.`;
    //           }
    //         });
    //       }
    //     });
    //   });
    // }

    // );
    // await send();
  },
  list: async (req, res) => {
    const db = req.app.get("db");
    let bannedUsers = [];
    let bannedUsersTags = [];
    await db.get_banned_users().then(response => {
      response.forEach(e => {
        client.playerByTag(e.tag).then(playerData => {
          bannedUsers.push(playerData.name);
          bannedUsersTags.push(playerData.tag);
          console.log(bannedUsers);
        });
      });
    });
    setTimeout(
      () =>
        res.status(200).send({
          message: `The current banned players are: ${bannedUsers
            .toString()
            .replace(
              /,/g,
              ", "
            )} and their tags are ${bannedUsersTags
            .toString()
            .replace(/,/g, ", ")}.`
        }),
      1500
    );
  }
};
