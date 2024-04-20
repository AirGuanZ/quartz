import { QuartzEmitterPlugin } from "../types"
import { QuartzComponentProps } from "../../components/types"
import HeaderConstructor from "../../components/Header"
import BodyConstructor from "../../components/Body"
import { pageResources, renderPage } from "../../components/renderPage"
import { ProcessedContent, defaultProcessedContent } from "../vfile"
import { FullPageLayout } from "../../cfg"
import {
  FilePath,
  FullSlug,
  getAllSegmentPrefixes,
  joinSegments,
  pathToRoot,
} from "../../util/path"
import { defaultListPageLayout, sharedPageComponents } from "../../../quartz.layout"
import { CategoryContent } from "../../components"
import { write } from "./helpers"
import { i18n } from "../../i18n"
import DepGraph from "../../depgraph"

export const CategoryPage: QuartzEmitterPlugin<Partial<FullPageLayout>> = (userOpts) => {
  const opts: FullPageLayout = {
    ...sharedPageComponents,
    ...defaultListPageLayout,
    pageBody: CategoryContent(),
    ...userOpts,
  }

  const { head: Head, header, beforeBody, pageBody, left, right, footer: Footer } = opts
  const Header = HeaderConstructor()
  const Body = BodyConstructor()

  return {
    name: "CategoryPage",
    getQuartzComponents() {
      return [Head, Header, Body, ...header, ...beforeBody, pageBody, ...left, ...right, Footer]
    },
    async getDependencyGraph(ctx, content, _resources) {
      const graph = new DepGraph<FilePath>()

      for (const [_tree, file] of content) {
        const sourcePath = file.data.filePath!
        const cats = (file.data.frontmatter?.categories ?? []).flatMap(getAllSegmentPrefixes)
        // if the file has at least one cat, it is used in the cat index page
        if (cats.length > 0) {
            cats.push("index")
        }

        for (const cat of cats) {
          graph.addEdge(
            sourcePath,
            joinSegments(ctx.argv.output, "categories", cat + ".html") as FilePath,
          )
        }
      }

      return graph
    },
    async emit(ctx, content, resources): Promise<FilePath[]> {
      const fps: FilePath[] = []
      const allFiles = content.map((c) => c[1].data)
      const cfg = ctx.cfg.configuration

      const cats: Set<string> = new Set(
        allFiles.flatMap((data) => data.frontmatter?.categories ?? []).flatMap(getAllSegmentPrefixes),
      )

      // add base cat
      cats.add("index")

      const catDescriptions: Record<string, ProcessedContent> = Object.fromEntries(
        [...cats].map((cat) => {
          const title =
            cat === "index"
              ? "All Categories" //i18n(cfg.locale).pages.catContent.catIndex
              : `Category: ${cat}` //`${i18n(cfg.locale).pages.catContent.cat}: ${cat}`
          return [
            cat,
            defaultProcessedContent({
              slug: joinSegments("categories", cat) as FullSlug,
              frontmatter: { title, categories: [] },
            }),
          ]
        }),
      )

      for (const [tree, file] of content) {
        const slug = file.data.slug!
        if (slug.startsWith("categories/")) {
          const cat = slug.slice("categories/".length)
          if (cats.has(cat)) {
            catDescriptions[cat] = [tree, file]
          }
        }
      }

      for (const cat of cats) {
        const slug = joinSegments("categories", cat) as FullSlug
        const externalResources = pageResources(pathToRoot(slug), resources)
        const [tree, file] = catDescriptions[cat]
        const componentData: QuartzComponentProps = {
          ctx,
          fileData: file.data,
          externalResources,
          cfg,
          children: [],
          tree,
          allFiles,
        }

        const content = renderPage(cfg, slug, componentData, opts, externalResources)
        const fp = await write({
          ctx,
          content,
          slug: file.data.slug!,
          ext: ".html",
        })

        fps.push(fp)
      }
      return fps
    },
  }
}
