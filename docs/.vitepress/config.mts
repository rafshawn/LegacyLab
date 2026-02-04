import { defineConfig } from 'vitepress'
import footnote from 'markdown-it-footnote'
import { tabsMarkdownPlugin } from 'vitepress-plugin-tabs'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "LegacyLab",
  description: "A VitePress Site",

  markdown: {
    config: (md) => {
      md.use(footnote),
      md.use(tabsMarkdownPlugin)
    },
    image: {
      lazyLoading: true,
    },
  },

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Examples', link: '/markdown-examples' }
    ],

    sidebar: [
      {
        text: 'Getting Started',
        link: '/getting-started',
        items: [
          { text: 'OS Install and Setup', link: '/getting-started/os-install-and-setup' },
          { text: 'Docker', link: '/getting-started/docker' },
          { text: 'Logging', link: '/getting-started/logging' },
        ]
      },
      {
        text: 'Containers',
        collapsed: false,
        items: [
          {
            text: 'Pi-hole',
            link: '/Containers/Pi-hole',
            items: [
              { text: 'iCloud Private Relay', link: '/Containers/Pi-hole/icloud-private-relay'}
            ]
          }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/rafshawn/LegacyLab' }
    ],

    search: {
      provider: 'local'
    },
  },

  rewrites: {
    'getting-started/:slug*' : 'getting-started/:slug*',
  },
})
