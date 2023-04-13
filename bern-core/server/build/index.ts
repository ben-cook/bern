import { type Stats, type StatsError } from "webpack";
import { clean } from "./clean";
import { createCompiler } from "./webpack";

export const build = async (dir: string) => {
  const [compiler] = await Promise.all([createCompiler(dir), clean(dir)]);

  return new Promise<Stats | undefined>((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err) return reject(err);

      const jsonStats = stats?.toJson();
      if (jsonStats?.errors && jsonStats.errors.length > 0) {
        const error = new CompilerError(jsonStats.errors.at(0)!);
        error.errors = jsonStats.errors;
        error.warnings = jsonStats.warnings;
        return reject(error);
      }

      resolve(stats);
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
