const path = require("path")
const fs = require("fs")
const rimraf = require("rimraf")
const mkdirp = require("mkdirp")
const { getDocComponents } = require("./docgen")

const metaDir = path.resolve(__dirname, "dist/json")

rimraf.sync(metaDir)
mkdirp.sync(metaDir)

let webTypesJson = []

const writeJsonFile = (dir, file, json) => {
  fs.writeFileSync(path.resolve(dir, file), JSON.stringify(json, null, 2) + "\n")
}

getDocComponents().then((docs) => {
  docs.forEach((doc) => {
    /**
     * Generate Jetbrains meta
     */
    let tagName = `Ea${doc.displayName}`
    if (webTypesJson.findIndex((t) => t.name === tagName) < 0) {
      webTypesJson.push({
        name: tagName,
        description: doc.description,
        attributes: (doc.props || []).map((p) => {
          return {
            name: p.name,
            value: {
              kind: "expression",
              type: p.type.name,
            },
            ...(p.type.name === "boolean" && !p.defaultValue && { default: "false" }),
            ...(p.type.name === "boolean" && { type: p.type.name }),
            description: p.description,
          }
        }),
      })
    }

    /**
     * Write JSON files
     */
    writeJsonFile(metaDir, "web-types.json", {
      $schema: "https://raw.githubusercontent.com/JetBrains/web-types/master/schema/web-types.json",
      framework: "vue",
      name: "@lowcoder66/easy-admin",
      version: "0.0.1",
      contributions: {
        html: {
          "types-syntax": "javascript",
          "description-markup": "markdown",
          tags: webTypesJson,
        },
      },
    })
  })
})
