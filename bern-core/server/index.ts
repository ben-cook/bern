import http from "http";
import path from "path";
import { parse } from "url";
// import send from "send";
// import { render, renderJSON, errorToJSON } from "./render";
// import { resolveFromList } from "./resolve";

export default class Server {
  dir: string;
  http: http.Server;

  constructor({ dir = ".", dev = false }) {
    this.dir = path.resolve(dir);

    this.http = http.createServer((req, res) => {
      this.run(req, res).catch((err) => {
        console.error(err);
        res.statusCode = 500;
        res.end("error");
      });
    });

    // this.defineRoutes();
  }

  async start(port: number) {
    this.http.listen(port);
  }

  defineRoutes() {
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
    // this.router.get("/:path*", async (req, res) => {
    //   await this.render(req, res);
    // });
    return null;
  }

  async run(req: http.IncomingMessage, res: http.ServerResponse) {
    // const fn = this.router.match(req, res);
    // if (fn) {
    //   await fn();
    // } else {
    //   await this.render404(req, res);
    // }

    res.statusCode = 200;
    res.flushHeaders();
    res.write("Hello, World!\n");

    return res.end();
  }

  //   async render(req, res) {
  //     const { dir, dev } = this;
  //     const ctx = { req, res };
  //     const opts = { dir, dev };

  //     let html;

  //     const err = this.getCompilationError(req.url);
  //     if (err) {
  //       res.statusCode = 500;
  //       html = await render("/_error-debug", { ...ctx, err }, opts);
  //     } else {
  //       try {
  //         html = await render(req.url, ctx, opts);
  //       } catch (err) {
  //         if (err.code === "ENOENT") {
  //           res.statusCode = 404;
  //         } else {
  //           console.error(err);
  //           res.statusCode = 500;
  //         }
  //         html = await render("/_error", { ...ctx, err }, opts);
  //       }
  //     }

  //     sendHTML(res, html);
  //   }

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

  //   getCompilationError(url) {
  //     if (!this.hotReloader) return;

  //     const errors = this.hotReloader.getCompilationErrors();
  //     if (!errors.size) return;

  //     const p = parse(url || "/").pathname.replace(/\.json$/, "");
  //     const id = join(this.dir, ".next", "bundles", "pages", p);
  //     const path = resolveFromList(id, errors.keys());
  //     if (path) return errors.get(path)[0];
  //   }
  // }

  // function sendHTML(res, html) {
  //   res.setHeader("Content-Type", "text/html");
  //   res.setHeader("Content-Length", Buffer.byteLength(html));
  //   res.end(html);
  // }
}
