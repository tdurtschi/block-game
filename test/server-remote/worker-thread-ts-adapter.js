const filename = process.env.FILENAME;

if (filename !== undefined) {
    const path = require("path");
    require("ts-node").register();
    require(path.resolve(__dirname, filename));
}
