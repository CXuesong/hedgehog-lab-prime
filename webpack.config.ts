/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-console */
import CopyPlugin from "copy-webpack-plugin";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import path from "path";
import TerserPlugin from "terser-webpack-plugin";
import webpack from "webpack";

function rooted(relativePath: string): string {
    return path.resolve(__dirname, relativePath);
}

function pathSegmentRegexp(pathExpression: string) {
    let result = "";
    for (const c of pathExpression) {
        switch (c) {
            case "/":
            case "\\":
                result += "[\\/\\\\]";
                break;
            case ".":
                result += "\\.";
                break;
            case "*":
                result += "[^\\/\\\\]*";
                break;
            case "%":
                result += ".*";
                break;
            default:
                result += c;
                break;
        }
    }
    return new RegExp(result);
}

export default function config(env: unknown, argv: Record<string, string>): webpack.Configuration {
    const isProduction = argv.mode === "production";
    const isRunAsDevServer = process.env.WEBPACK_DEV_SERVER === "true";
    console.info("isRunAsDevServer:", isRunAsDevServer);
    console.info("isProduction:", isProduction);
    const outputPath = rooted("dist");
    return {
        mode: isProduction ? "production" : "development",
        entry: "./src/index.tsx",
        devtool: isProduction ? "source-map" : "inline-source-map",
        devServer: {
            contentBase: path.join(__dirname, "assets"),
            compress: true,
            port: 4080,
            watchContentBase: true,
        },
        module: {
            rules: [
                {
                    loader: "ts-loader",
                    test: /\.tsx?$/,
                    exclude: [
                        pathSegmentRegexp("/node_modules/"),
                        pathSegmentRegexp("/test/"),
                    ],
                    options: {
                        transpileOnly: true,
                        experimentalWatchApi: true,
                    },
                },
                {
                    loader: "ts-loader",
                    test: {
                        or: [
                            // hedgehog is using Babel in JS. Wish they are only doing type annotations so tsc can handle it.
                            // This does NOT work with tsx though.
                            pathSegmentRegexp("/hedgehog-lab/hedgehog-lab/src/%.js$"),
                        ],
                    },
                    options: {
                        transpileOnly: true,
                        experimentalWatchApi: true,
                        ignoreDiagnostics: [
                            8009, // The '?' modifier can only be used in TypeScript files.
                            8010, // Type annotations can only be used in TypeScript files.
                        ],
                    },
                },
                {
                    test: /\.s[ac]ss$/i,
                    use: [
                        isRunAsDevServer ? "style-loader" : MiniCssExtractPlugin.loader,
                        {
                            loader: MiniCssExtractPlugin.loader,
                            options: {
                                hmr: isRunAsDevServer,
                            },
                        },
                        "@teamsupercell/typings-for-css-modules-loader",
                        // Translates CSS into CommonJS
                        {
                            loader: "css-loader",
                            options: {
                                modules: {
                                    localIdentName: isProduction ? "[hash:base64]" : "[path][name]__[local]",
                                },
                                localsConvention: "camelCaseOnly",
                            },
                        },
                        // Compiles Sass to CSS
                        "sass-loader",
                    ],
                },
            ],
        },
        resolve: {
            extensions: [".tsx", ".ts", ".js", ".json"],
            alias: {
                path: false,
                fs: false,
                "babel-code-frame": false,
                "hedgehog-lab": "hedgehog-lab/node_modules/hedgehog-lab/hedgehog-lab/src",
            },
        },
        plugins: [
            new webpack.ProvidePlugin({
                process: rooted("src/shims/process.ts"),
                Buffer: [rooted("src/shims/globals.ts"), "Buffer"],
            }),
            new CopyPlugin({
                patterns: [
                    { from: path.join(__dirname, "assets"), to: outputPath },
                ],
            }),
            new ForkTsCheckerWebpackPlugin({
                typescript: {
                    configFile: path.join(__dirname, "./src/tsconfig.json"),
                },
            }),
        ],
        optimization: {
            minimize: isProduction,
            minimizer: [
                new TerserPlugin({
                    cache: true,
                    parallel: true,
                    sourceMap: true, // Must be set to true if using source-maps in production
                    terserOptions: {
                        // https://github.com/webpack-contrib/terser-webpack-plugin#terseroptions
                    },
                }) as any, /* TODO revisit */
            ],
        },
        output: {
            path: outputPath,
            filename: "index.js",
        },
    };
}
