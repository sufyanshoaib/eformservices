import { MetadataRoute } from 'next'
import { prisma } from '@/lib/db'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://eformservices.com'

    // Static pages
    const staticPages = [
        '',
        '/auth/signin',
        '/auth/signup',
        '/terms',
        '/privacy',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: route === '' ? 1 : 0.8,
    }))

    // Dynamic forms
    const forms = await prisma.form.findMany({
        where: { isPublished: true, shareableLink: { not: null } },
        select: { shareableLink: true, updatedAt: true },
    })

    const formPages = forms.map((form) => ({
        url: `${baseUrl}/s/${form.shareableLink}`,
        lastModified: form.updatedAt,
        changeFrequency: 'weekly' as const,
        priority: 0.6,
    }))

    //return [...staticPages, ...formPages]
    return [...staticPages]
}
