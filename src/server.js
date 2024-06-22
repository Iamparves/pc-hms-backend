const app = require("./app.js");
const config = require("./config/index.js");
const connectToDB = require("./db/index.js");

const main = async () => {
  await connectToDB();

  app.listen(config.PORT, () => {
    console.log(`Server is running on http://localhost:${config.PORT}`);
  });
};

main();
