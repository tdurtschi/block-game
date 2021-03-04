const browserSync = require("browser-sync").create();
const fs = require("fs");
const sass = require("sass");
const isWatch = process.argv.find(arg => arg.includes("--watch")) !== undefined;
const CSS_INPUT_PATH = "./src/styles";
const CSS_OUTPUT_PATH = "./dist/styles.css";

function compileSass() {
    var result = sass.renderSync({
        file: `${CSS_INPUT_PATH}/index.scss`,
        outFile: CSS_OUTPUT_PATH
    });

    fs.writeFile(CSS_OUTPUT_PATH, result.css, function (err) {
        if (err) return console.log(err);
    });
}

function initHotReload() {
    browserSync.init({ server: "./dist" });

    fs.watch(CSS_INPUT_PATH, {}, () => {
        try {
            compileSass();
            browserSync.reload("*.css");
        } catch (error) {
            browserSync.notify("Error compiling SCSS", 3000);
        }
    });

    require('esbuild').build({
        ...config,
        watch: {
            onRebuild(error, result) {
                if (!error) {
                    browserSync.reload();
                } else {
                    browserSync.notify("Error! " + error, 3000);
                }
            },
        },
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
    initHotReload();

} else {
    compileSass();
    require('esbuild').build(config);
}
