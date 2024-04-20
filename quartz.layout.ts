import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  footer: Component.Footer({
    links: {
      GitHub: "https://github.com/AirGuanZ",
    },
  }),
}

// components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.Breadcrumbs(),
    Component.ArticleTitle(),
    Component.ContentMeta(),
    Component.TagList(),
  ],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Search(),
    Component.Darkmode(),
    /*Component.DesktopOnly(Component.Explorer({
      sortFn: (a, b) => {
        if (a.file && b.file) {
          let dateA = a.file?.frontmatter?.date
          let dateB = b.file?.frontmatter?.date
          if (dateA != null && dateB != null)
          {
            return dateA.localeCompare(dateB, undefined, {
                numeric: true,
                sensitivity: "base",
              })
          }
        }

        // Sort order: folders first, then files. Sort folders and files alphabetically
        if ((!a.file && !b.file) || (a.file && b.file)) {
          // numeric: true: Whether numeric collation should be used, such that "1" < "2" < "10"
          // sensitivity: "base": Only strings that differ in base letters compare as unequal. Examples: a ≠ b, a = á, a = A
          return a.displayName.localeCompare(b.displayName, undefined, {
            numeric: true,
            sensitivity: "base",
          })
        }

        if (a.file && !b.file) {
          return 1
        } else {
          return -1
        }
      },
    })),*/
  ],
  right: [
    //Component.Graph(),
    Component.DesktopOnly(Component.TableOfContents()),
    Component.Backlinks(),
  ],
}

// components for pages that display lists of pages  (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [Component.Breadcrumbs(), Component.ArticleTitle(), Component.ContentMeta()],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Search(),
    Component.Darkmode(),
    //Component.DesktopOnly(Component.Explorer()),
  ],
  right: [],
}
