const express = require("express");
const path = require("path");
const fs = require("fs");
const { getPageById } = require("./pages");
const app = express();

const PORT = process.env.PORT || 2768;
const indexPath = path.resolve(__dirname, "..", "build", "index.html");

// static resources should just be served as they are
app.use(
  express.static(path.resolve(__dirname, "..", "build"), { maxAge: "30d" })
);

// here we serve the index.html page
app.get("/*", (req, res, next) => {
  fs.readFile(indexPath, "utf8", (err, htmlData) => {
    if (err) {
      console.error("Error during file reading", err);
      return res.status(404).end();
    }

    // get page info
    const pageId = req.query.id;
    const page = getPageById(pageId);
    if (!page) return res.status(404).send("Page not found");

    // inject meta tags
    htmlData = htmlData
      .replace("<title>React App</title>", `<title>${page.title}</title>`)
      .replace("__META_OG_TITLE__", page.title)
      .replace("__META_OG_DESCRIPTION__", page.description)
      .replace("__META_DESCRIPTION__", page.description)
      .replace("__META_OG_IMAGE__", page.thumbnail);

    return res.send(htmlData);
  });
});

// listening...
app.listen(PORT, (error) => {
  if (error) {
    return console.log("Error during app startup", error);
  }
  console.log("listening on " + PORT + "...");
});
