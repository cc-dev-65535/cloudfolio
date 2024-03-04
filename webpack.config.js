import path from "path";

const config = {
    mode: "production",
    entry: "./scripts/jsx/index.jsx",
    output: {
        path: path.resolve(path.resolve(), "public"),
        filename: "index.bundle.js",
    },
    module: {
        rules: [
            {
                test: /\.jsx$/,
                exclude: /(node_modules)/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: [
                            ["@babel/preset-env", { targets: "defaults" }],
                        ],
                    },
                },
            },
        ],
    },
};

export default config;
