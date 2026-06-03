process.env.NODE_ENV = "production";

import("./dist/boot.js").catch((error) => {
  console.error(error);
  process.exit(1);
});
