import { createServer } from "node:http";

import app from "./app";
import { getInstance } from "./lib/db";

// variables
const PORT = process.env.PORT || "8000";

const server = createServer(app);

async function main() {
  await server.listen(parseInt(PORT));
  await getInstance().$connect();
  console.log(`Server started at port ${PORT}`);
}

main();
