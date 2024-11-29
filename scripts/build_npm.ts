// ex. scripts/build_npm.ts
import { build, emptyDir } from "@deno/dnt";

await emptyDir("./npm");

await build({
  entryPoints: ["./src/main.ts"],
  outDir: "./npm",
  shims: {
    // see JS docs for overview and more options
    deno: true,
  },
  package: {
    // package.json properties
    name: "purify-ts-writer",
    version: Deno.args[0],
    description: "Writer monad compatible with purify-ts",
    license: "MIT",
    repository: {
      type: "git",
      url: "git+https://github.com/tjercus/purify-ts-writer.git",
    },
    bugs: {
      url: "https://github.com/tjercus/purify-ts-writer/issues",
    },
  },
  postBuild() {
    // steps to run after building and before running the tests
    Deno.copyFileSync("README.md", "npm/README.md");
  },
});
