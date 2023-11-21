import { createServer } from "node:http";

import app from "./app";

// variables
const PORT = process.env.PORT || "8000";

const server = createServer(app);

async function main() {
  await server.listen(parseInt(PORT));
  console.log(`Server started at port ${PORT}`);
}

main();
