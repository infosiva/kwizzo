import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://kwizzo.app',         lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: 'https://kwizzo.app/play',    lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: 'https://kwizzo.app/about',   lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: 'https://kwizzo.app/contact', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: 'https://kwizzo.app/privacy', lastModified: new Date(), changeFrequency: 'yearly', priority: 0.4 },
    { url: 'https://kwizzo.app/terms',   lastModified: new Date(), changeFrequency: 'yearly', priority: 0.4 },
  ]
}
