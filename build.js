const browserSync = require("browser-sync").create();
const isWatch = process.argv.find(arg => arg.includes("--watch")) !== undefined;

const config = {
    entryPoints: ['src/index.tsx'],
    outfile: 'dist/main.js',
    bundle: true,
    define: {
        ["process.env.NODE_ENV"]: "\"development\"",
    }
};

if (isWatch) {
    browserSync.init({ server: "./dist" });
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
    require('esbuild').build(config);
}