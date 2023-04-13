import { parse } from "url";
// @ts-ignore
import pathMatch from "path-match";
import { BernRequest, BernRequestHandler, BernResponse } from ".";

const pathMatchFunction = pathMatch();

export default class Router {
  routes: Map<string, any>;

  constructor() {
    this.routes = new Map();
  }

  get(path: string, fn: BernRequestHandler) {
    this.add("GET", path, fn);
  }

  add(method: string, path: string, fn: BernRequestHandler) {
    const routes = this.routes.get(method) || new Set();
    console.debug({ route: pathMatchFunction(path) });
    routes.add({ match: pathMatchFunction(path), fn });
    this.routes.set(method, routes);
  }

  match(req: BernRequest, res: BernResponse) {
    if (!req.method) {
      throw new Error("Request is missing a method.");
    }
    const routes = this.routes.get(req.method);
    if (!routes) return;

    if (!req.url) {
      throw new Error("Request is missing a url.");
    }
    const { pathname } = parse(req.url);
    for (const r of routes) {
      const params = r.match(pathname);
      if (params) {
        return async () => {
          return r.fn(req, res, params);
        };
      }
    }
  }
}
