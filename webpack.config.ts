import CopyPlugin from "copy-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import path from "path";
import TerserPlugin from "terser-webpack-plugin";
import webpack from "webpack";

export default function config(env: unknown, argv: Record<string, string>): webpack.Configuration {
    const isProduction = argv.mode === "production";
    const isRunAsDevServer = process.env.WEBPACK_DEV_SERVER === "true";
    console.info("isRunAsDevServer:", isRunAsDevServer);
    console.info("isProduction:", isProduction);
    const outputPath = path.resolve(__dirname, "dist");
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
                        /[/\\]node_modules[/\\]/,
                        /[/\\]test[/\\]/,
                    ],
                    options: {
                        transpileOnly: true,
                        experimentalWatchApi: true,
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
            extensions: [".tsx", ".ts", ".js"],
        },
        plugins: [
            new CopyPlugin({
                patterns: [
                    { from: path.join(__dirname, "assets"), to: outputPath },
                ],
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
