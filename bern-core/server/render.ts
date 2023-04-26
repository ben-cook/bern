import fs from "fs/promises";
import path from "path";
import { createElement } from "react";
import { parse } from "url";
import { App } from "../lib/App";
import { Document } from "../lib/Document";
import { BUILD_DIR } from "./constants";
import { requireModule } from "./require";
import Router from "./router";
import { renderToString, renderToStaticMarkup } from "react-dom/server";
import { BernContext } from ".";

export interface RenderOptions {
  dir?: string;
}

/** Renders a bern page */
export const render = async (
  url: string,
  ctx: BernContext,
  { dir = process.cwd() }: RenderOptions
) => {
  const resolvedPath = getPath(url);
  if (!resolvedPath) {
    throw new Error(`Could not get path from '${url}'`);
  }

  console.log({ resolvedPath });

  // const mod = await requireModule(
  //   path.join(dir, BUILD_DIR, "dist", "pages", resolvedPath)
  // );
  let mod;
  try {
    mod = await requireModule(
      path.join(dir, BUILD_DIR, "bundles", "pages", resolvedPath)
    );
  } catch {
    try {
      mod = await requireModule(
        path.join(
          dir,
          BUILD_DIR,
          "bundles",
          "pages",
          resolvedPath.slice(0, resolvedPath.length - 3) + ".jsx"
        )
      );
    } catch {
      try {
        mod = await requireModule(
          path.join(
            dir,
            BUILD_DIR,
            "bundles",
            "pages",
            resolvedPath.slice(0, resolvedPath.length - 3) + ".ts"
          )
        );
      } catch {
        try {
          mod = await requireModule(
            path.join(
              dir,
              BUILD_DIR,
              "bundles",
              "pages",
              resolvedPath.slice(0, resolvedPath.length - 3) + ".tsx"
            )
          );
        } catch {}
      }
    }
  }

  const Component = mod?.default || mod;

  console.log(Component);

  const props = await (Component.getInitialProps
    ? Component.getInitialProps(ctx)
    : {});

  // const component = await fs.readFile(
  //   path.join(dir, BUILD_DIR, "bundles", "pages", resolvedPath),
  //   "utf8"
  // );

  const app = createElement(App, {
    Component,
    props,
    // router: new Router(ctx.req ? ctx.req.url : url),
  });

  const str = renderToString(app);

  // const doc = createElement(Document, {
  //   html: str,
  //   data: {
  //     component,
  //   },
  // });

  // const staticMarkup = renderToStaticMarkup(doc);

  // console.log(`Rendered HTML: ${staticMarkup}`);

  // return "<!DOCTYPE html>" + staticMarkup;
  return "<!DOCTYPE html>" + str;
};

const getPath = (url: string) => {
  return parse(url || "/").pathname?.replace(/\.json$/, "");
};
