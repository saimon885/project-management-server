import { app } from "./app";
import config from "./config";
import { prisma } from "./lib/prisma";

const main = async () => {
  try {
    await prisma.$connect();
    console.log("prisma connected successfull");
    app.listen(config.port, () => {
      console.log(`Example app listening on port ${config.port}`);
    });
  } catch (error) {
    console.log(error);
  }
};

main();
