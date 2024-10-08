import webpack from "webpack";
import ZipPlugin from "zip-webpack-plugin";
import CopyWebpackPlugin from "copy-webpack-plugin";
import WebpackBar from "webpackbar";
import {resolve as remoteComponentConfig} from "./remote-component.config.js";
import config from "./config.js";
import {fileURLToPath} from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const externals = Object.keys(remoteComponentConfig).reduce(
 (obj, key) => ({
  ...obj,
  [key]: key,
 }),
 {}
);

export default {
 plugins: [
  new WebpackBar({name: `Widget: ${config.displayName}`}),
  new webpack.EnvironmentPlugin({
   "process.env.NODE_ENV": process.env.NODE_ENV,
  }),
  new CopyWebpackPlugin({
   patterns: [
    {
     from: config.previewImageComponent,
     to: "preview/",
    },
    {
     from: "./component.config.json",
     to: "config/",
    },
   ],
  }),
  new ZipPlugin({
   filename: `widget-${config.logicalName.toLowerCase()}.zip`,
   path: "generated",
  }),
 ],
 entry: {
  main: "./src/Index.tsx",
 },
 output: {
  filename: `${config.logicalName.toLowerCase()}.js`,
  libraryTarget: "commonjs",
  path: path.resolve(__dirname, "dist"),
 },
 externals: {
  ...externals,
  "remote-component.config.js": "remote-component.config.js",
 },
 resolve: {
  extensions: [".ts", ".tsx", ".js"],
 },
 module: {
  rules: [
   {
    test: /\.tsx?$/,
    exclude: /(node_modules|bower_components)/,
    use: {
     loader: "ts-loader",
    },
   },
   {
    test: /\.m?js$/,
    exclude: /(node_modules|bower_components)/,
    use: {
     loader: "babel-loader",
    },
   },
   {
    test: /\.(png|jpe?g|gif|svg)$/i,
    use: [
     {
      loader: "file-loader",
      options: {
       name: "[name].[ext]",
       outputPath: "preview/",
       publicPath: "preview/",
      },
     },
    ],
   },
  ],
 },
};
