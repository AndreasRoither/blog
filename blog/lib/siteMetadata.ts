
// todo: switch to environment variables for baseURL
const baseURL = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://blog.anro.dev';

export const siteMetadata = {
  title: 'anro.dev',
  author: 'Andreas Roither',
  headerTitle: 'Matcha-Powered Pixels',
  description: 'A blog around technology, software development, and the occasional matcha.',
  language: 'en-us',
  siteUrl: baseURL,
  siteRepo: 'https://github.com/AndreasRoither/blog',
  siteLogo: `${baseURL}/logo.png`,
  socialBanner: `${baseURL}/donut.jpg`,
  email: 'arblog@proton.me',
  github: 'https://github.com/AndreasRoither',
  locale: 'en-US',
  rss: `${baseURL}/rss.xml`,
} as const;
