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

  const mod = await requireModule(
    path.join(dir, BUILD_DIR, "dist", "pages", resolvedPath)
  );
  const Component = mod.default || mod;

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

  const doc = createElement(Document, {
    html: str,
  });

  console.log(`Rendered HTML: ${renderToStaticMarkup(doc)}`);

  return "<!DOCTYPE html>" + renderToStaticMarkup(doc);
};

const getPath = (url: string) => {
  return parse(url || "/").pathname?.replace(/\.json$/, "");
};
