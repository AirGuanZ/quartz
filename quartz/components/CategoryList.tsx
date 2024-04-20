import { pathToRoot, slugTag } from "../util/path"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"

const CategoryList: QuartzComponent = ({ fileData, displayClass }: QuartzComponentProps) => {
  const cats = fileData.frontmatter?.categories
  const baseDir = pathToRoot(fileData.slug!)
  if (cats && cats.length > 0) {
    return (
      <ul class={classNames(displayClass, "cats")}>
        {cats.map((cat) => {
          const linkDest = baseDir + `/categories/${slugTag(cat)}`
          return (
            <li>
              <a href={linkDest} class="internal cat-link">
                {cat}
              </a>
            </li>
          )
        })}
      </ul>
    )
  } else {
    return null
  }
}

CategoryList.css = `
.cats {
  list-style: none;
  display: flex;
  padding-left: 0;
  gap: 0.4rem;
  margin: 1rem 0;
  flex-wrap: wrap;
  justify-self: end;
}

.section-li > .section > .cats {
  justify-content: flex-end;
}
  
.cats > li {
  display: inline-block;
  white-space: nowrap;
  margin: 0;
  overflow-wrap: normal;
}

a.internal.cat-link {
  border-radius: 8px;
  background-color: var(--highlight);
  padding: 0.2rem 0.4rem;
  margin: 0 0.1rem;
}
`

export default (() => CategoryList) satisfies QuartzComponentConstructor
