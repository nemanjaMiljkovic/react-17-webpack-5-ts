//@ts-nocheck
import path from "path";
import webpack from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import ESLintPlugin from "eslint-webpack-plugin";
import ModuleFederationPlugin from "webpack/lib/container/ModuleFederationPlugin";
import postCssFlexBugs from "postcss-flexbugs-fixes";
import postCssEnv from "postcss-preset-env";
import postCssNormalize from "postcss-normalize";

const imageInlineSizeLimit = 10000;
const fontsInlineSizeLimit = 50000;

const config: webpack.Configuration = {
	mode: "development",
	output: {
		publicPath: "http://localhost:3001/",
	},
	module: {
		rules: [
			{
				test: /\.css$/,
				use: [
					"style-loader",
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
				test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/, /\.svg$/],
				type: "asset",
				parser: { dataUrlCondition: { maxSize: imageInlineSizeLimit } },
			},
			{
				test: [/\.woff2?(\?v=\d+\.\d+\.\d+)?$/, /\.eot?(\?v=\d+\.\d+\.\d+)?$/],

				type: "asset",
				parser: { dataUrlCondition: { maxSize: fontsInlineSizeLimit } },
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
			template: "public/index.html",
		}),

		new ESLintPlugin({
			extensions: ["js", "jsx", "ts", "tsx"],
		}),
		new ModuleFederationPlugin({
			name: "app",
			remotes: {
				dashboard: "dashboard@http://localhost:3000/remoteEntry.js",
			},
		}),
		new ForkTsCheckerWebpackPlugin({
			async: false,
		}),
		new webpack.HotModuleReplacementPlugin(),
	],
	devtool: "inline-source-map",
	devServer: {
		contentBase: path.join(__dirname, "build"),
		historyApiFallback: true,
		port: 3001,
		open: true,
		hot: true,
		overlay: {
			errors: true,
			warnings: true,
		},
	},
};

export default config;
