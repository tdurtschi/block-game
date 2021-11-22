const browserSync = require("browser-sync").create();
const esbuild = require("esbuild");
const fs = require("fs");
const sass = require("sass");

const IS_WATCH_MODE =
    process.argv.find((arg) => arg.includes("--watch")) !== undefined;
const PROJECT_ROOT = "./src";
const CSS_INPUT_FILENAME = "./src/styles/index.scss";
const CSS_OUTPUT_FILENAME = "./dist/styles.css";

function compileSass() {
    var result = sass.renderSync({
        file: CSS_INPUT_FILENAME,
        outFile: CSS_OUTPUT_FILENAME
    });

    fs.writeFile(CSS_OUTPUT_FILENAME, result.css, function (err) {
        if (err) return console.error(err);
    });
}

function initHotReload() {
    browserSync.init({ server: "./dist", ghostMode: false });

    fs.watch(PROJECT_ROOT, { recursive: true }, (_, filename) => {
        if (filename.indexOf(".scss") > 0) {
            try {
                compileSass();
                browserSync.reload("*.css");
            } catch (error) {
                console.error(error.message);
                browserSync.notify("Error compiling SCSS", 3000);
            }
        }
    });

    esbuild.build({
        ...config,
        watch: {
            onRebuild(error, result) {
                if (!error) {
                    browserSync.reload();
                } else {
                    browserSync.notify("Error! " + error, 3000);
                }
            }
        }
    });
}

const config = {
    entryPoints: ["src/index.tsx"],
    outfile: "dist/main.js",
    bundle: true,
    define: {
        ["process.env.NODE_ENV"]: '"development"',
        ["process.env.SERVER_URL"]: process.env.SERVER_URL ? `"${process.env.SERVER_URL}"` : undefined
    }
};

if (IS_WATCH_MODE) {
    compileSass();
    initHotReload();
} else {
    compileSass();
    esbuild.build(config);
}
