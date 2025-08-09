import type {MetadataRoute} from 'next';
import {API_BASE_URL} from "@/src/lib/globalConstants";
import {PortfolioItemPreview, Post, Product} from "@/src/lib/types";

export const dynamic = 'force-dynamic';
export const revalidate = 3600;

function siteBase() {
    const u = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    return u.replace(/\/+$/, '');
}

function apiBase() {
    const api = API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
    const site = siteBase();
    return api.startsWith('http') ? api : `${site}${api.startsWith('/') ? '' : '/'}${api}`;
}

async function safeJSON<T>(url: string): Promise<T | null> {
    try {
        const res = await fetch(url, {cache: 'no-store'});
        if (!res.ok) return null;
        return (await res.json()) as T;
    } catch {
        return null;
    }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const site = siteBase();
    const api = apiBase();
    const now = new Date();

    const staticUrls: MetadataRoute.Sitemap = [
        {url: `${site}/`, lastModified: now},
        {url: `${site}/contacts`, lastModified: now},
        {url: `${site}/services`, lastModified: now},
        {url: `${site}/portfolio`, lastModified: now},
        {url: `${site}/ceilings`, lastModified: now},
        {url: `${site}/spc`, lastModified: now},
        {url: `${site}/blog`, lastModified: now},
    ];

    const [productsRes, portfolioRes, postsRes] = await Promise.all([
        safeJSON<{ items: Product[] }>(`${api}/products?limit=5000&page=1`),
        safeJSON<{ items: PortfolioItemPreview[] }>(`${api}/portfolio-items?limit=5000&page=1`),
        safeJSON<{ items: Post[] }>(`${api}/posts?limit=5000&page=1`),
    ]);

    const products = productsRes?.items ?? [];
    const portfolioItems = portfolioRes?.items ?? [];
    const posts = postsRes?.items ?? [];

    const locales: Array<'ru' | 'ky'> = ['ru', 'ky'];
    const withLocales = (path: string) =>
        locales.map((loc) => `${site}/${loc}${path.startsWith('/') ? '' : '/'}${path}`);

    const productUrls: MetadataRoute.Sitemap = products
        .filter((p) => p.slug)
        .flatMap((p) =>
            withLocales(`/products/${p.slug}`).map((url) => ({
                url,
                lastModified: new Date(p.updatedAt || p.createdAt || now),
            }))
        );

    const portfolioUrls: MetadataRoute.Sitemap = portfolioItems
        .filter((p) => p.slug)
        .flatMap((item) =>
            withLocales(`/portfolio/${item.slug}`).map((url) => ({
                url,
                lastModified: new Date(item.updatedAt || item.createdAt || now),
            }))
        );

    const blogUrls: MetadataRoute.Sitemap = posts
        .filter((p) => p.slug)
        .flatMap((post) =>
            withLocales(`/blog/${post.slug}`).map((url) => ({
                url,
                lastModified: new Date(post.updatedAt || post.createdAt || now),
            }))
        );

    return [...staticUrls, ...productUrls, ...portfolioUrls, ...blogUrls];
}