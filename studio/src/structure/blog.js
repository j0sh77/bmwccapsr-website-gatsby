import S from '@sanity/desk-tool/structure-builder'
import {
  GoMegaphone as BlogIcon,
  GoChecklist as ApprovedIcon,
  GoEye as ReviewIcon,
  GoCircleSlash as RejectedIcon,
  GoArchive as AllIcon,
  GoPerson as AuthorIcon,
} from 'react-icons/go'
import SocialPreview from 'part:social-preview/component'
import PreviewIFrame from '../../src/components/previewIFrame'
import { toPlainText } from 'part:social-preview/utils'
import resolveSlugByType from '../../resolveSlugByType'

export const icons = {
  BlogIcon,
  ApprovedIcon,
  ReviewIcon,
  RejectedIcon,
  AllIcon,
}

const blog = S.listItem()
  .title('Zundfolge')
  .icon(BlogIcon)
  .child(
    S.list()
      .title('Zundfolge')
      .items([
        S.listItem()
          .title('Published articles')
          .schemaType('post')
          .icon(BlogIcon)
          .child(
            S.documentList('post')
              .title('Published articles')
              .menuItems(S.documentTypeList('post').getMenuItems())
              // Only show posts with publish date earlier than now and that is not drafts
              .filter('_type == "post" && publishedAt < now() && !(_id in path("drafts.**"))')
              .child((documentId) =>
                S.document()
                  .documentId(documentId)
                  .schemaType('post')
                  .views([
                    S.view.form(), 
                    PreviewIFrame(),
                    S.view.component(
                      SocialPreview({
                          prepareFunction: (
                            { title, mainImage, slug, excerpt }
                          ) => ({
                            title,
                            description: toPlainText(excerpt || []),
                            siteUrl: 'https://bmw-club-psr.org',
                            ogImage: mainImage,
                            slug: `${resolveSlugByType('post')}${slug.current}`
                          }),
                        }),
                      ).title('Social & SEO')])
              )
          ),
        S.documentTypeListItem('post').title('All articles').icon(AllIcon),
        S.listItem()
          .title('Articles by category')
          .child(
            // List out all categories
            S.documentTypeList('category')
              .title('Articles by category')
              .child(catId =>
                // List out project documents where the _id for the selected
                // category appear as a _ref in the project’s categories array
                S.documentList()
                  .schemaType('post')
                  .title('Articles')
                  .filter(
                    '_type == "post" && $catId in categories[]._ref'
                  )
                  .params({ catId })
              )
        ),
        S.divider(),
        S.documentTypeListItem('author').title('Authors').icon(AuthorIcon),
        S.documentTypeListItem('category').title('Categories')
      ])
  )

export default blog