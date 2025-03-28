import React from 'react'
import { createGlobalStyle } from 'styled-components'
import { Link, useStaticQuery, graphql } from 'gatsby'
import styled from 'styled-components'
import Layout from '.'
import SideBar from '../components/sidebar'
import SEO from '../components/seo'
import TableofContents from '../components/toc'
import Github from '../images/githubicon.inline.svg'

import '../styles/prism-github.css'

const GlobalStyle = createGlobalStyle`
  html {
    background-image: none;
    background-color: ${({ theme }) => theme.backgroundColor};
}
`

const StyledDocs = styled.div`
  display: grid;
  grid-template-columns: 280px 1fr 160px;
  justify-content: space-between;
  margin-top: 2rem;
  padding: 0 2rem;
  padding-bottom: 4rem;
  margin-bottom: 4rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.grey2};

  @media (max-width: 960px) {
    flex-direction: column;
    grid-template-columns: 1fr;
    margin-top: 0rem;
  }
`

const StyledMDX = styled.div`
  min-width: 550px;
  max-width: 768px;
  padding: 0;
  margin-bottom: 3rem;
  a {
    color: ${({ theme }) => theme.colors.link};
  }

  code {
    background-color: ${({ theme }) => theme.colors.grey2};
    color: ${({ theme }) => theme.colors.grey8};
  }

  @media (max-width: 960px) {
    min-width: 100%;
    max-width: 100%;
  }
`

const StyledDocsNavWrapper = styled.ul`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  list-style: none;
  margin: 0;
  margin-top: 2rem;
  padding-top: 3rem;
  border-top: 1px solid ${({ theme }) => theme.colors.grey2};
`
const StyledDocsNav = styled.li`
  a {
    color: ${({ theme }) => theme.textColor};
  }
`

const StyledLink = styled(Link)`
  font-size: 1.25rem;
  border: 1px solid ${({ theme }) => theme.colors.grey2};
  border-radius: 0.25rem;
  padding: 0.5rem 1rem;
  text-decoration: none;
  display: flex;
  flex-direction: column;
  small {
    font-size: 0.75rem;
    opacity: 0.6;
  }
`

const StyledPageTitle = styled.div`
  display: flex;
  justify-content: space-between;
  position: relative;
  align-items: center;

  h1 {
    font-size: 2.5rem !important;
    margin-top: 0px !important;
  }

  a {
    color: ${({ theme }) => theme.colors.grey6};
    display: inherit;
    font-size: 0.825rem;
  }
`

const StyledGithubIcon = styled(Github)`
  width: 16px;
  margin-right: 6px;
  path {
    fill: ${({ theme }) => theme.colors.grey9};
  }

  :before {
    bottom: 0px;
    left: 0;
    width: 100%;
    height: 1px;

    content: ' ';
    position: absolute;
    background-color: ${({ theme }) => theme.colors.grey9};
    opacity: 0.2;
  }
`

const Docs = props => {
  const data = useStaticQuery(graphql`
    {
      site {
        siteMetadata {
          commit
          repository
        }
      }
      allMdx(filter: { fileAbsolutePath: { regex: "/docs/" } }, sort: { order: ASC, fields: fileAbsolutePath }) {
        edges {
          node {
            id
            excerpt(pruneLength: 40)
            headings {
              value
              depth
            }
            frontmatter {
              title
            }
            fields {
              slug
              subDir
              rawSlug
            }
          }
          next {
            frontmatter {
              title
            }
            fields {
              slug
            }
          }
          previous {
            frontmatter {
              title
            }
            fields {
              slug
            }
          }
        }
      }
    }
  `)

  return (
    <Layout path={props.location.pathname}>
      <SEO title={props.pageContext.frontmatter.title} path={props.location.pathname} />
      <GlobalStyle />
      {data.allMdx.edges
        .filter(({ node }) => {
          return node.fields.slug === props.path
        })
        .map(({ node }) => {
          const title = node.fields.subDir
            .replace(/\d+-/g, '')
            .replace(/-/g, ' ')
            .replace(/(^|\s)\S/g, function(t) {
              return t.toUpperCase()
            })
          return (
            <SEO
              key={node.fields.slug}
              title={props.pageContext.frontmatter.title}
              site={'Uniswap ' + title}
              path={props.location.pathname}
              description={node.excerpt}
            />
          )
        })}
      <StyledDocs id="docs-header">
        <SideBar parent={'/docs/'} {...props} />
        <StyledMDX>
          <StyledPageTitle>
            <h1>{props.pageContext.frontmatter.title}</h1>
          </StyledPageTitle>
          {props.children}
          {data.allMdx.edges
            .filter(({ node }) => {
              return node.fields.slug === props.path && node.fields.slug !== '/docs/v2/'
            })
            .map(({ node }) => {
              return (
                <a
                  key={node.id}
                  href={
                    data.site.siteMetadata.repository +
                    '/tree/' +
                    data.site.siteMetadata.commit +
                    '/src/pages' +
                    node.fields.rawSlug.slice(0, -1) +
                    '.md'
                  }
                >
                  <StyledGithubIcon /> Edit on Github
                </a>
              )
            })}
          {data.allMdx.edges
            .filter(({ node }) => {
              return node.fields.slug === props.path
            })
            .map(({ node, next, previous }) => {
              return (
                <StyledDocsNavWrapper key={node.id}>
                  <StyledDocsNav>
                    {/* index.md file is considered the "last" based on the sort order. Check to remove links when not relevent */}
                    {previous && node.fields.slug !== '/docs/v2/' && (
                      <StyledLink style={{ alignItems: 'flex-end' }} to={previous.fields.slug} rel="prev">
                        <small>Previous</small>
                        <span>← {previous.frontmatter.title}</span>
                      </StyledLink>
                    )}
                  </StyledDocsNav>
                  <StyledDocsNav>
                    {/* index.md file is considered the "last" based on the sort order. Check to remove when not relevent */}
                    {next && next.fields.slug !== '/docs/v2/' && (
                      <StyledLink style={{ alignItems: 'flex-start' }} to={next.fields.slug} rel="next">
                        <small>Next</small>
                        <span>{next.frontmatter.title} →</span>
                      </StyledLink>
                    )}
                    {node.fields.slug === '/docs/v2/' && (
                      <StyledLink style={{ alignItems: 'flex-start' }} to={'/docs/v2/smart-contracts/'} rel="next">
                        <small>Next</small>
                        <span>Smart Contracts →</span>
                      </StyledLink>
                    )}
                  </StyledDocsNav>
                </StyledDocsNavWrapper>
              )
            })}
        </StyledMDX>
        {data ? (
          data.allMdx.edges
            .filter(({ node }) => {
              return node.fields.slug === props.path
            })
            .map(({ node }) => {
              return <TableofContents path={props.path} key={node.id} headings={node.headings} />
            })
        ) : (
          <div style={{ width: '160px', height: '60px' }}></div>
        )}
      </StyledDocs>
    </Layout>
  )
}

export default Docs
