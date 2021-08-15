import React from "react";
import PropTypes from "prop-types";
import Helmet from "react-helmet";
import { StaticQuery, graphql } from "gatsby";
import { imageUrlFor } from "../lib/image-url";
import { buildImageObj } from "../lib/helpers";

// https://ogp.me

function Seo({ description, lang, meta, keywords, title, image }) {
  return (
    <StaticQuery
      query={detailsQuery}
      render={data => {
        const metaDescription = description || (data.site && data.site.description) || "";
        const siteTitle = (data.site && data.site.title) || "";
        const siteAuthor = (data.site && data.site.author && data.site.author.name) || "";
        const metaImage =
          image && image.asset
            ? imageUrlFor(buildImageObj(image))
                .width(1200)
                .url()
            : "";

        const pageTitle = title || siteTitle;

        return (
          <Helmet
            htmlAttributes={{ lang }}
            title={pageTitle}
            titleTemplate={pageTitle === siteTitle ? siteTitle : `%s | ${siteTitle}`}
            meta={[
              {
                name: "google-site-verification",
                content: "7MfJFsxBVui5UlEBExUFeMW9-Q6g9fPgoaxwzvbqaV0"
              },
              {
                name: "description",
                content: metaDescription
              },
              {
                property: "og:title",
                content: title
              },
              {
                property: "og:description",
                content: metaDescription
              },
              {
                property: "og:type",
                content: "website"
              },
              {
                property: "og:image",
                content: metaImage
              },
              {
                name: "twitter:card",
                content: "summary"
              },
              {
                name: "twitter:creator",
                content: siteAuthor
              },
              {
                name: "twitter:title",
                content: title
              },
              {
                name: "twitter:description",
                content: metaDescription
              }
            ]
              .concat(
                keywords && keywords.length > 0
                  ? {
                      name: "keywords",
                      content: keywords.join(", ")
                    }
                  : []
              )
              .concat(meta)}
          >
          </Helmet>
        );
      }}
    />
  );
}

Seo.defaultProps = {
  lang: "en",
  meta: [],
  keywords: []
};

Seo.propTypes = {
  description: PropTypes.string,
  lang: PropTypes.string,
  meta: PropTypes.array,
  keywords: PropTypes.arrayOf(PropTypes.string),
  title: PropTypes.string.isRequired
};

export default Seo;

const detailsQuery = graphql`
  query DefaultSEOQuery {
    site: sanitySiteSettings(_id: { regex: "/(drafts.|)siteSettings/" }) {
      title
      openGraph {
        title
        description
      }
    }
  }
`;
