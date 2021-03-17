//@ts-nocheck
import path from "path";
import webpack from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import ESLintPlugin from "eslint-webpack-plugin";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import CssMinimizerPlugin from "css-minimizer-webpack-plugin";
import postCssFlexBugs from "postcss-flexbugs-fixes";
import postCssEnv from "postcss-preset-env";
import postCssNormalize from "postcss-normalize";

const imageInlineSizeLimit = 10000;

const config: webpack.Configuration = {
	mode: "production",
	output: {
		path: path.resolve(__dirname, "..", "build"),
		filename: "[name].[contenthash].js",
		publicPath: "",
	},
	module: {
		rules: [
			{
				test: /\.css$/,
				use: [
					MiniCssExtractPlugin.loader,
					"css-loader",
					{
						loader: "postcss-loader",
						options: {
							postcssOptions: {
								ident: "postcss",
								plugins: [
									postCssFlexBugs(),
									postCssEnv({
										autoprefixer: {
											flexbox: "no-2009",
										},
										stage: 3,
									}),
									postCssNormalize(),
								],
							},
						},
					},
				],
			},
			{
				test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
				loader: "url-loader",
				options: {
					limit: imageInlineSizeLimit,
					name: "static/media/[name].[hash:8].[ext]",
				},
			},
			{
				loader: "file-loader",
				exclude: [/\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
				options: {
					name: "static/media/[name].[hash:8].[ext]",
				},
			},
			{
				test: /\.(js|mjs|jsx|ts|tsx)$/,
				exclude: /node_modules/,
				use: {
					loader: "babel-loader",
				},
			},
		],
	},
	resolve: {
		extensions: [".tsx", ".ts", ".js"],
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: "src/public/index.html",
		}),
		new MiniCssExtractPlugin(),
		new ForkTsCheckerWebpackPlugin({
			async: false,
		}),
		new ESLintPlugin({
			extensions: ["js", "jsx", "ts", "tsx"],
		}),
		new CleanWebpackPlugin({
			verbose: true,
		}),
	],
	optimization: {
		minimize: true,
		minimizer: [`...`, new CssMinimizerPlugin()],
		splitChunks: {
			chunks: "all",
			name: false,
		},
		runtimeChunk: {
			name: (entrypoint) => `runtime-${entrypoint.name}`,
		},
	},
};

export default config;
