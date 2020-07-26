/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-console */
import { CleanWebpackPlugin } from "clean-webpack-plugin";
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
    if (!argv.profile) {
        console.info("isRunAsDevServer:", isRunAsDevServer);
        console.info("isProduction:", isProduction);
    }
    const outputPath = rooted("dist");
    return {
        mode: isProduction ? "production" : "development",
        entry: {
            index: "./src/index.tsx",
        },
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
                            pathSegmentRegexp("/hedgehog-lab/packages/%.tsx?$"),
                        ],
                    },
                    options: {
                        transpileOnly: true,
                        experimentalWatchApi: true,
                        ignoreDiagnostics: [
                            6133, // '...' is declared but its value is never read.
                        ],
                    },
                },
                {
                    test: /\.worker\.(js|ts)$/,
                    use: [
                        {
                            loader: "worker-loader",
                        },
                        {
                            loader: "ts-loader",
                            options: {
                                transpileOnly: true,
                                experimentalWatchApi: true,
                            }
                        },
                    ],
                },
                {
                    test: /\.s[ac]ss$/i,
                    use: [
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
                "hedgehog-lab/core": "hedgehog-lab/packages/hedgehog-core/src/",
                "hedgehog-lab/lab": "hedgehog-lab/packages/hedgehog-lab/src/",
            },
        },
        plugins: [
            new CleanWebpackPlugin(),
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
                issue: {
                    exclude: [
                        (issue) => !!issue.file?.match(pathSegmentRegexp("node_modules/hedgehog-lab/packages/%.tsx?$")),
                    ],
                },
            }),
            new MiniCssExtractPlugin({ filename: "index.1.css" }),
        ],
        optimization: {
            minimize: isProduction,
            minimizer: [
                new TerserPlugin({
                    // cache: true,
                    parallel: true,
                    sourceMap: true, // Must be set to true if using source-maps in production
                    terserOptions: {
                        // https://github.com/webpack-contrib/terser-webpack-plugin#terseroptions
                        ecma: 2015,
                        parse: {
                            ecma: 2018,
                        },
                    },

                }) as any, /* TODO revisit */
            ],
        },
        output: {
            path: outputPath,
            filename: "[name].js",
            chunkFilename: "[id].[chunkhash].chunk.js",
        },
    };
}
