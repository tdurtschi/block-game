const browserSync = require("browser-sync").create();
const fs = require("fs");
const sass = require("sass");
const isWatch = process.argv.find(arg => arg.includes("--watch")) !== undefined;
const CSS_INPUT_PATH = "./src/index.scss";
const CSS_OUTPUT_PATH = "./dist/styles.css";

const compileSass = () => {
    var result = sass.renderSync({
        file: CSS_INPUT_PATH,
        outFile: CSS_OUTPUT_PATH
    });

    fs.writeFile(CSS_OUTPUT_PATH, result.css, function (err) {
        if (err) return console.log(err);
    });
}

const config = {
    entryPoints: ['src/index.tsx'],
    outfile: 'dist/main.js',
    bundle: true,
    define: {
        ["process.env.NODE_ENV"]: "\"development\"",
    }
};

if (isWatch) {
    compileSass();
    browserSync.init({ server: "./dist" });
    fs.watch(CSS_INPUT_PATH, {}, () => {
        compileSass();
        browserSync.reload("*.css");
    });
    require('esbuild').build({
        ...config,
        watch: {
            onRebuild(error, result) {
                if (!error) {
                    browserSync.reload();
                }
            },
        },
    });
} else {
    compileSass();
    require('esbuild').build(config);
}
