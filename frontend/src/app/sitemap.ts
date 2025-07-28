import type {MetadataRoute} from 'next';
import {PortfolioItemPreview, Post, Product} from "@/src/lib/types";
import {fetchProducts} from "@/actions/products";
import {fetchPortfolioPreviews} from "@/actions/portfolios";
import {fetchPosts} from "@/actions/posts";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const now = new Date();

    const staticUrls: MetadataRoute.Sitemap = [
        {url: `${baseUrl}/`, lastModified: now},
        {url: `${baseUrl}/contacts`, lastModified: now},
        {url: `${baseUrl}/services`, lastModified: now},
        {url: `${baseUrl}/portfolio`, lastModified: now},
        {url: `${baseUrl}/ceilings`, lastModified: now},
        {url: `${baseUrl}/spc`, lastModified: now},
        {url: `${baseUrl}/blog`, lastModified: now},
    ];

    const {items: products} = await fetchProducts('5000', '1');
    // const productUrls: MetadataRoute.Sitemap = products.map((p: Product) => ({
    //     url: `${baseUrl}/products/${p.slug}`,
    //     lastModified: new Date(p.updatedAt || p.createdAt || now),
    // }));

    const {items: portfolioItems} = await fetchPortfolioPreviews();
    // const portfolioUrls: MetadataRoute.Sitemap = portfolioItems.map((item: PortfolioItemPreview) => ({
    //     url: `${baseUrl}/portfolio/${item.slug}`,
    //     lastModified: new Date(item.updatedAt || item.createdAt || now),
    // }));

    const {items: posts} = await fetchPosts('5000', '1');
    // const blogUrls: MetadataRoute.Sitemap = posts.map((post: Post) => ({
    //     url: `${baseUrl}/blog/${post.slug}`,
    //     lastModified: new Date(post.updatedAt || post.createdAt || now),
    // }));


    const productUrls = products
        .filter(p => !!p.slug)
        .map((p: Product) => ({
            url: `${baseUrl}/products/${p.slug}`,
            lastModified: new Date(p.updatedAt || p.createdAt || now),
        }));

    const portfolioUrls = portfolioItems
        .filter(p => !!p.slug)
        .map((item: PortfolioItemPreview) => ({
            url: `${baseUrl}/portfolio/${item.slug}`,
            lastModified: new Date(item.updatedAt || item.createdAt || now),
        }));

    const blogUrls = posts
        .filter(p => !!p.slug)
        .map((post: Post) => ({
            url: `${baseUrl}/blog/${post.slug}`,
            lastModified: new Date(post.updatedAt || post.createdAt || now),
        }));

    return [...staticUrls, ...productUrls, ...portfolioUrls, ...blogUrls];
}