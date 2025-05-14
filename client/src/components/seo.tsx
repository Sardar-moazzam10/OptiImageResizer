import { Helmet } from 'react-helmet-async';

interface SEOProps {
    title?: string;
    description?: string;
    keywords?: string[];
    ogImage?: string;
    ogType?: 'website' | 'article';
    twitterCard?: 'summary' | 'summary_large_image';
    canonicalUrl?: string;
    imageAlt?: string;
    articlePublishedTime?: string;
    articleModifiedTime?: string;
}

const DEFAULT_TITLE = 'Optisizer - Professional Image Resizing Tool';
const DEFAULT_DESCRIPTION = 'Transform your images with precision and style. Professional resizing tools for the modern creator. Perfect for social media, web, and print.';
const DEFAULT_KEYWORDS = [
    'image resizer',
    'photo resizing',
    'social media images',
    'image optimization',
    'photo editor',
    'image dimensions',
    'aspect ratio',
    'image quality',
    'photo resizer',
    'web images'
];

export default function SEO({
    title = DEFAULT_TITLE,
    description = DEFAULT_DESCRIPTION,
    keywords = DEFAULT_KEYWORDS,
    ogImage = '/og-image.png',
    ogType = 'website',
    twitterCard = 'summary_large_image',
    canonicalUrl,
    imageAlt = 'Optisizer - Professional Image Resizing Tool',
    articlePublishedTime,
    articleModifiedTime
}: SEOProps) {
    const siteUrl = import.meta.env.VITE_SITE_URL || 'https://optisizer.com';
    const fullTitle = title === DEFAULT_TITLE ? title : `${title} | Optisizer`;
    const finalCanonicalUrl = canonicalUrl || siteUrl;

    // Structured data for SEO
    const structuredData = {
        '@context': 'https://schema.org',
        '@type': ogType === 'article' ? 'Article' : 'WebApplication',
        name: fullTitle,
        description: description,
        image: `${siteUrl}${ogImage}`,
        url: finalCanonicalUrl,
        ...(ogType === 'article' && {
            datePublished: articlePublishedTime,
            dateModified: articleModifiedTime || articlePublishedTime,
        }),
        applicationCategory: 'Image Processing Tool',
        operatingSystem: 'All',
        offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD'
        },
        creator: {
            '@type': 'Organization',
            name: 'Optisizer',
            url: siteUrl
        }
    };

    return (
        <Helmet>
            {/* Basic Meta Tags */}
            <html lang="en" />
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords.join(', ')} />
            <meta name="robots" content="index, follow" />
            <meta name="author" content="Optisizer" />

            {/* Open Graph Meta Tags */}
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:type" content={ogType} />
            <meta property="og:url" content={finalCanonicalUrl} />
            <meta property="og:image" content={`${siteUrl}${ogImage}`} />
            <meta property="og:image:alt" content={imageAlt} />
            <meta property="og:site_name" content="Optisizer" />
            <meta property="og:locale" content="en_US" />

            {/* Article Meta Tags */}
            {ogType === 'article' && articlePublishedTime && (
                <meta property="article:published_time" content={articlePublishedTime} />
            )}
            {ogType === 'article' && articleModifiedTime && (
                <meta property="article:modified_time" content={articleModifiedTime} />
            )}

            {/* Twitter Meta Tags */}
            <meta name="twitter:card" content={twitterCard} />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={`${siteUrl}${ogImage}`} />
            <meta name="twitter:image:alt" content={imageAlt} />
            <meta name="twitter:site" content="@optisizer" />

            {/* Additional Meta Tags */}
            <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
            <meta name="theme-color" content="#ffffff" />
            <meta name="mobile-web-app-capable" content="yes" />
            <meta name="apple-mobile-web-app-capable" content="yes" />
            <meta name="apple-mobile-web-app-status-bar-style" content="default" />
            <meta name="format-detection" content="telephone=no" />

            {/* Canonical URL */}
            <link rel="canonical" href={finalCanonicalUrl} />

            {/* Favicon */}
            <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
            <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
            <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
            <link rel="manifest" href="/site.webmanifest" />

            {/* Structured Data */}
            <script type="application/ld+json">
                {JSON.stringify(structuredData)}
            </script>
        </Helmet>
    );
} 