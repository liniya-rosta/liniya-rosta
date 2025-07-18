import type {MetadataRoute} from 'next';
import {Product} from "@/lib/types";
import {fetchProducts} from "@/actions/products";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const now = new Date();

    const {items: products} = await fetchProducts("5000", "1");

    const staticUrls: MetadataRoute.Sitemap = [
        {url: `${baseUrl}/`, lastModified: now},
        {url: `${baseUrl}/contacts`, lastModified: now},
        {url: `${baseUrl}/services`, lastModified: now},
        {url: `${baseUrl}/portfolio`, lastModified: now},
        {url: `${baseUrl}/ceilings`, lastModified: now},
        {url: `${baseUrl}/spc`, lastModified: now},
        {url: `${baseUrl}/blog`, lastModified: now},
    ];

    const productUrls: MetadataRoute.Sitemap = products.map((p: Product) => ({
        url: `${baseUrl}/products/${p.slug}`,
        lastModified: new Date(p.updatedAt || p.createdAt || now),
    }));

    return [...staticUrls, ...productUrls];
}