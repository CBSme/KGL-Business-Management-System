const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./models/User");
const Stock = require("./models/Stock");
dotenv.config();

const users = [
  {
    username: "director",
    password: "director123",
    role: "Director",
    branch: "All",
    fullName: "Mr. Orban (Director)",
  },
  {
    username: "manager1",
    password: "manager123",
    role: "Manager",
    branch: "Maganjo",
    fullName: "Sarah Manager",
  },
  {
    username: "manager2",
    password: "manager123",
    role: "Manager",
    branch: "Matugga",
    fullName: "John Manager",
  },
  {
    username: "agent1",
    password: "agent123",
    role: "Sales Agent",
    branch: "Maganjo",
    fullName: "Ali Agent",
  },
  {
    username: "agent2",
    password: "agent123",
    role: "Sales Agent",
    branch: "Maganjo",
    fullName: "Aisha Agent",
  },
  {
    username: "agent3",
    password: "agent123",
    role: "Sales Agent",
    branch: "Matugga",
    fullName: "Peter Agent",
  },
  {
    username: "agent4",
    password: "agent123",
    role: "Sales Agent",
    branch: "Matugga",
    fullName: "Grace Agent",
  },
];

const stocks = [
  { produceName: "Beans", branch: "Maganjo", currentTonnage: 2000 },
  { produceName: "Grain Maize", branch: "Maganjo", currentTonnage: 5000 },
  { produceName: "Cow Peas", branch: "Maganjo", currentTonnage: 1500 },
  { produceName: "Groundnuts", branch: "Maganjo", currentTonnage: 800 },
  { produceName: "Soybeans", branch: "Maganjo", currentTonnage: 1200 },
  { produceName: "Beans", branch: "Matugga", currentTonnage: 1800 },
  { produceName: "Grain Maize", branch: "Matugga", currentTonnage: 4000 },
  { produceName: "Cow Peas", branch: "Matugga", currentTonnage: 900 },
  { produceName: "Groundnuts", branch: "Matugga", currentTonnage: 600 },
  { produceName: "Soybeans", branch: "Matugga", currentTonnage: 1100 },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  await User.deleteMany({});
  await Stock.deleteMany({});
  for (const u of users) await new User(u).save();
  await Stock.insertMany(stocks);
  console.log("✅ Database seeded successfully!");
  console.log("👤 Login credentials:");
  users.forEach((u) =>
    console.log(`   ${u.role} | ${u.username} / ${u.password} | Branch: ${u.branch}`)
  );
  process.exit(0);
}
seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
