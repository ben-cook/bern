import { glob } from "glob";
import path from "path";
import { webpack, type Compiler, type Configuration } from "webpack";
import { BUILD_DIR } from "../constants";

export const createCompiler = async (dir: string): Promise<Compiler> => {
  const resolvedDir = path.resolve(dir);

  const pages = await glob("pages/**/*.js", { cwd: resolvedDir });

  const entry: Record<string, string> = {};
  for (const page of pages) {
    entry[path.join("bundles", page)] = `./${page}`;
  }

  const nodeModulesDir = path.join(__dirname, "..", "..", "..", "node_modules");

  const webpackConfiguration: Configuration = {
    context: resolvedDir,
    mode: "production",
    entry,
    output: {
      path: path.join(resolvedDir, BUILD_DIR),
      filename: "[name]",
      libraryTarget: "commonjs2",
    },
    externals: ["react", "react-dom"],
    module: {
      rules: [
        {
          test: /\.(?:js|jsx|ts|tsx)/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: [
                "@babel/preset-env",
                "@babel/preset-react",
                "@babel/preset-typescript",
              ],
            },
          },
        },
      ],
    },
    resolve: {
      roots: [nodeModulesDir, path.join(resolvedDir, "node_modules")],
    },
    resolveLoader: {
      roots: [nodeModulesDir, path.join(__dirname, "loaders")],
    },
  };

  const webpackCompiler = webpack(webpackConfiguration);

  return webpackCompiler;
};
