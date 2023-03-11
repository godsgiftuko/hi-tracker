module.exports = {
  lang: 'en-US',
  title: 'Hi Tracker 🎉',
  description: 'Hi Tracker',
  base: process.env.DEPLOY_ENV === 'gh-pages' ? '/awesome-nest-boilerplate/' : '/',
  themeConfig: {
    sidebar: [
      ['/', 'Introduction'],
      '/docs/development',
      '/docs/architecture',
      '/docs/naming-cheatsheet',
      // '/docs/routing',
      // '/docs/state',
      '/docs/linting',
      // '/docs/editors',
      // '/docs/production',
      // '/docs/troubleshooting',
    ],
  },
};
