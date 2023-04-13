import { createCompiler } from "./webpack";
import { clean } from "./clean";
import { StatsError } from "webpack";

export const BUILD_DIR = ".bern-build";

export const build = async (dir: string) => {
  const [compiler] = await Promise.all([createCompiler(dir), clean(dir)]);

  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err) return reject(err);

      const jsonStats = stats?.toJson();
      if (jsonStats?.errors && jsonStats.errors.length > 0) {
        const error = new CompilerError(jsonStats.errors.at(0)!);
        error.errors = jsonStats.errors;
        error.warnings = jsonStats.warnings;
        return reject(error);
      }

      resolve(undefined);
    });
  });
};

class CompilerError extends Error {
  errors?: StatsError[];
  warnings?: StatsError[];

  constructor(args: any) {
    super(args);
  }
}
