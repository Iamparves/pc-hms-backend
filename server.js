import app from "./src/app.js";
import config from "./src/config/index.js";
import connectToDB from "./src/db/index.js";

const main = async () => {
  await connectToDB();

  app.listen(config.PORT, () => {
    console.log(`Server is running on http://localhost:${config.PORT}`);
  });
};

main();
