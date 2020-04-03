//*functional imports
const express = require("express");
const massive = require("massive");
require("dotenv").config();
const { SERVER_PORT, CONNECTION_STRING } = process.env;
const app = express();
//*controller imports
const banCtrl = require("./controllers/banController.js");

app.use(express.json());

app.post("/api/ban", banCtrl.banUser);
app.get("/api/test", banCtrl.test);
app.get("/api/list", banCtrl.list);
app.delete("/api/unban", banCtrl.unbanUser);

massive(CONNECTION_STRING).then(db => {
  app.set("db", db);
  app.listen(SERVER_PORT, () =>
    console.log(`Listening on port ${SERVER_PORT}`)
  );
});
