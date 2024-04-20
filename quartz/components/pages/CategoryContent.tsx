import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../types"
import style from "../styles/listPage.scss"
import { PageList } from "../PageList"
import { FullSlug, getAllSegmentPrefixes, simplifySlug } from "../../util/path"
import { QuartzPluginData } from "../../plugins/vfile"
import { Root } from "hast"
import { htmlToJsx } from "../../util/jsx"
import { i18n } from "../../i18n"

const numPages = 10
const CategoryContent: QuartzComponent = (props: QuartzComponentProps) => {
  const { tree, fileData, allFiles, cfg } = props
  const slug = fileData.slug

  if (!(slug?.startsWith("categories/") || slug === "cats")) {
    throw new Error(`Component "CategoryContent" tried to render a non-category page: ${slug}`)
  }

  const cat = simplifySlug(slug.slice("categories/".length) as FullSlug)
  const allPagesWithCategory = (cat: string) =>
    allFiles.filter((file) =>
      (file.frontmatter?.categories ?? []).flatMap(getAllSegmentPrefixes).includes(cat),
    )

  const content =
    (tree as Root).children.length === 0
      ? fileData.description
      : htmlToJsx(fileData.filePath!, tree)
  const cssClasses: string[] = fileData.frontmatter?.cssclasses ?? []
  const classes = ["popover-hint", ...cssClasses].join(" ")
  if (cat === "/") {
    const cats = [
      ...new Set(
        allFiles.flatMap((data) => data.frontmatter?.categories ?? []).flatMap(getAllSegmentPrefixes),
      ),
    ].sort((a, b) => a.localeCompare(b))
    const catItemMap: Map<string, QuartzPluginData[]> = new Map()
    for (const cat of cats) {
      catItemMap.set(cat, allPagesWithCategory(cat))
    }
    return (
      <div class={classes}>
        <article>
          <p>{content}</p>
        </article>
        <div>
          {cats.map((cat) => {
            const pages = catItemMap.get(cat)!
            const listProps = {
              ...props,
              allFiles: pages,
            }

            const contentPage = allFiles.filter((file) => file.slug === `categories/${cat}`).at(0)

            const root = contentPage?.htmlAst
            const content =
              !root || root?.children.length === 0
                ? contentPage?.description
                : htmlToJsx(contentPage.filePath!, root)

            return (
              <div>
                <h2>
                  <a class="internal cat-link" href={`../categories/${cat}`}>
                    {cat}
                  </a>
                </h2>
                {content && <p>{content}</p>}
                <div class="page-listing">
                  <PageList {...listProps} />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  } else {
    const pages = allPagesWithCategory(cat)
    const listProps = {
      ...props,
      allFiles: pages,
    }

    return (
      <div class={classes}>
        <article>{content}</article>
        <div class="page-listing">
          <div>
            <PageList {...listProps} />
          </div>
        </div>
      </div>
    )
  }
}

CategoryContent.css = style + PageList.css
export default (() => CategoryContent) satisfies QuartzComponentConstructor
