import { readFile, writeFile, readdir } from "fs/promises"
import { createHash } from "crypto"

import { rollup } from "rollup"
import esbuild from "rollup-plugin-esbuild"
import commonjs from "@rollup/plugin-commonjs"
import nodeResolve from "@rollup/plugin-node-resolve"
import swc from "@swc/core"
import { execSync } from "child_process"
import { argv } from "process"

let deploy = argv[2]
if (deploy === "--deploy") deploy = true

/** @type import("rollup").InputPluginOption */
const plugins = [
    nodeResolve(),
    commonjs(),
    {
        name: "swc",
        async transform(code, id) {
            const result = await swc.transform(code, {
                filename: id,
                jsc: {
                    externalHelpers: true,
                    parser: {
                        syntax: "typescript",
                        tsx: true,
                    },
                },
                env: {
                    targets: "defaults",
                    include: [
                        "transform-classes",
                        "transform-arrow-functions",
                    ],
                },
            })
            return result.code
        },
    },
    esbuild({ minify: true }),
]

for (let plug of await readdir("./plugins")) {
    const manifest = JSON.parse(await readFile(`./plugins/${plug}/manifest.json`))
    const outPath = `./dist/${plug}/index.js`

    try {
        const bundle = await rollup({
            input: `./plugins/${plug}/${manifest.main}`,
            onwarn: () => { },
            plugins,
        })

        await bundle.write({
            file: outPath,
            globals(id) {
                if (id.startsWith("@vendetta")) return id.substring(1).replace(/\//g, ".")
                const map = {
                    react: "window.React",
                }

                return map[id] || null
            },
            format: "iife",
            compact: true,
            exports: "named",
        })
        await bundle.close()

        const toHash = await readFile(outPath)
        manifest.hash = createHash("sha256").update(toHash).digest("hex")
        manifest.main = "index.js"
        await writeFile(`./dist/${plug}/manifest.json`, JSON.stringify(manifest))

        console.log(`Successfully built ${manifest.name}!`)

    } catch (e) {
        console.error("Failed to build plugin...", e)
        process.exit(1)
    }
}
if (deploy) {
    const exec = (cmd) => execSync(cmd, { stdio: "inherit" })
    console.log("Deploying plugin to device...")

    const isXposed = execSync(`adb shell "pm list packages | grep com.vendetta.xposed"`).length > 0

    const pkgName = isXposed ? "com.discord" : "dev.beefers.vendetta"
    exec(`adb shell am force-stop ${pkgName}`)
    exec(`adb shell am start -n ${pkgName}/com.discord.main.MainActivity`)
}