import http from "http";
import path from "path";
import Router from "./router";
// import send from "send";
import { RenderOptions, render } from "./render";
// import { resolveFromList } from "./resolve";

export type BernRequest = http.IncomingMessage;
export type BernResponse = http.ServerResponse<http.IncomingMessage> & {
  req: http.IncomingMessage;
};
export type BernRequestHandler = (req: BernRequest, res: BernResponse) => void;
export type BernContext = { req: BernRequest; res: BernResponse };

export default class Server {
  dir: string;
  http: http.Server;
  router: Router;

  public constructor({ dir = ".", dev = false }) {
    this.dir = path.resolve(dir);
    this.router = new Router();

    this.http = http.createServer((req, res) => {
      this.run(req, res).catch((err) => {
        console.error(err);
        res.statusCode = 500;
        res.end("error");
      });
    });

    this.defineRoutes();
  }

  public async start(port: number) {
    this.http.listen(port);
  }

  private defineRoutes() {
    // this.router.get("/_next/:path+", async (req, res, params) => {
    //   const p = join(__dirname, "..", "client", ...(params.path || []));
    //   await this.serveStatic(req, res, p);
    // });
    // this.router.get("/static/:path+", async (req, res, params) => {
    //   const p = join(this.dir, "static", ...(params.path || []));
    //   await this.serveStatic(req, res, p);
    // });
    // this.router.get("/:path+.json", async (req, res) => {
    //   await this.renderJSON(req, res);
    // });
    this.router.get("/:path*", async (req, res) => {
      await this.render(req, res);
    });
  }

  private async run(req: BernRequest, res: BernResponse) {
    const fn = this.router.match(req, res);
    if (fn) {
      await fn();
    } else {
      // await this.render404(req, res);
      res.statusCode = 404;
      res.flushHeaders();
      res.write("This page could not be found.\n");
      res.end();
    }
  }

  private async render(req: BernRequest, res: BernResponse) {
    const { dir } = this;
    const ctx: BernContext = { req, res };
    const opts: RenderOptions = { dir };

    if (!req.url) {
      throw new Error("Request is missing a url");
    }

    const err = this.getCompilationError(req.url);

    let html: string | undefined;
    if (err) {
      res.statusCode = 500;
      // html = await render("/_error-debug", { ...ctx, err }, opts);
      res.write("Internal server error");
      res.end();
      return;
    }

    try {
      html = await render(req.url, ctx, opts);
    } catch (err: any) {
      console.error(err);
      if (err.code === "ENOENT") {
        res.statusCode = 404;
        res.end();
      } else {
        console.error(err);
        res.statusCode = 500;
        res.end();
      }
      // html = await render("/_error", { ...ctx, err }, opts);
    }

    if (html === undefined) {
      console.log("generated undefined html");
      res.end();
      return;
    }

    if (html === "") {
      console.log("generated empty html");
      res.end();
      return;
    }

    Server.sendHTML(res, html);
  }

  //   async renderJSON(req, res) {
  //     const { dir } = this;
  //     const opts = { dir };

  //     let json;

  //     const err = this.getCompilationError(req.url);
  //     if (err) {
  //       res.statusCode = 500;
  //       json = await renderJSON("/_error-debug.json", opts);
  //       json = { ...json, err: errorToJSON(err) };
  //     } else {
  //       try {
  //         json = await renderJSON(req.url, opts);
  //       } catch (err) {
  //         if (err.code === "ENOENT") {
  //           res.statusCode = 404;
  //         } else {
  //           console.error(err);
  //           res.statusCode = 500;
  //         }
  //         json = await renderJSON("/_error.json", opts);
  //       }
  //     }

  //     const data = JSON.stringify(json);
  //     res.setHeader("Content-Type", "application/json");
  //     res.setHeader("Content-Length", Buffer.byteLength(data));
  //     res.end(data);
  //   }

  //   async render404(req, res) {
  //     const { dir, dev } = this;

  //     res.statusCode = 404;
  //     const html = await render("/_error", { req, res }, { dir, dev });
  //     sendHTML(res, html);
  //   }

  //   serveStatic(req, res, path) {
  //     return new Promise((resolve, reject) => {
  //       send(req, path)
  //         .on("error", (err) => {
  //           if (err.code === "ENOENT") {
  //             this.render404(req, res).then(resolve, reject);
  //           } else {
  //             reject(err);
  //           }
  //         })
  //         .pipe(res)
  //         .on("finish", resolve);
  //     });
  //   }

  private getCompilationError(url: string) {
    return undefined;
    // if (!this.hotReloader) return;

    // const errors = this.hotReloader.getCompilationErrors();
    // if (!errors.size) return;

    // const p = parse(url || "/").pathname.replace(/\.json$/, "");
    // const id = join(this.dir, ".next", "bundles", "pages", p);
    // const path = resolveFromList(id, errors.keys());
    // if (path) return errors.get(path)[0];
  }
  // }

  private static sendHTML(res: BernResponse, html: string) {
    res.setHeader("Content-Type", "text/html");
    res.setHeader("Content-Length", Buffer.byteLength(html));
    res.end(html);
  }
}
