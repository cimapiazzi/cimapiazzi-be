const express = require("express");
const cors = require("cors");
const cron = require("node-cron");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");

const app = express();

var corsOptions = {
  origin: "*", // use your actual domain name (or localhost), using * is not recommended
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Origin",
    "X-Requested-With",
    "Accept",
    "x-client-key",
    "x-client-token",
    "x-client-secret",
    "Authorization",
    "x-access-token",
  ],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

// database
const db = require("./app/models");
const Role = db.role;

db.sequelize.sync().then(() => {
  initializeRoles();
});

async function initializeRoles() {
  try {
    const count = await Role.count();
    if (count === 0) {
      await Role.create({
        id: 1,
        name: "worker",
        label: "Dipendente",
      });
      console.log("Default role 'Dipendente' created.");
      await Role.create({
        id: 2,
        name: "moderator",
        label: "CIMAPIAZZI",
      });
      console.log("Default role 'Moderator' created.");
      await Role.create({
        id: 3,
        name: "Admin",
        label: "Administrator",
      });
      console.log("Default role 'Admin' created.");
      await Role.create({
        id: 4,
        name: "ceo",
        label: "CEO Azienda",
      });
      console.log("Default role 'CEO' created.");
      await Role.create({
        id: 5,
        name: "accounting",
        label: "Contabilita",
      });
      console.log("Default role 'Accounting' created.");
    

    } else {
      console.log("Roles table already populated.");
    }
  } catch (error) {
    console.error("Error initializing roles:", error);
  }
}

// simple route
app.get("/api", (req, res) => {
  res.json({ message: "Welcome to cms application." });
});

// routes
require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);
require("./app/routes/role.routes")(app);
require("./app/routes/company.routes")(app);
require("./app/routes/place.routes")(app);
require("./app/routes/vehicle.routes")(app);
require("./app/routes/attendance.routes")(app);
require("./app/routes/deadlines.routes")(app);
require("./app/routes/entity.routes")(app);
require("./app/routes/upload.routes")(app);
require("./app/routes/download.routes")(app);
require("./app/routes/permission.routes")(app);
require("./app/routes/email.routes")(app);

// Cron jobs
const deadlinesController = require("./app/controllers/deadlines.controller");

cron.schedule(
  "0 8 * * *",
  async () => {
    try {
      deadlinesController.sendEmailsUnpaidDeadlines();
    } catch (error) {
      console.error("Error sending emails for unpaid deadlines:", error);
    }
  },
  {
    timezone: "Europe/Rome", // Set the timezone to Italian time
  }
);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
