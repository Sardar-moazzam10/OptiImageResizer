import { Helmet } from 'react-helmet-async';

interface SEOProps {
    title?: string;
    description?: string;
    keywords?: string[];
    ogImage?: string;
    ogType?: 'website' | 'article';
    twitterCard?: 'summary' | 'summary_large_image';
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
    twitterCard = 'summary_large_image'
}: SEOProps) {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://optisizer.com';
    const fullTitle = title === DEFAULT_TITLE ? title : `${title} | Optisizer`;

    return (
        <Helmet>
            {/* Basic Meta Tags */}
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords.join(', ')} />

            {/* Open Graph Meta Tags */}
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:type" content={ogType} />
            <meta property="og:url" content={siteUrl} />
            <meta property="og:image" content={`${siteUrl}${ogImage}`} />
            <meta property="og:site_name" content="Optisizer" />

            {/* Twitter Meta Tags */}
            <meta name="twitter:card" content={twitterCard} />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={`${siteUrl}${ogImage}`} />

            {/* Additional Meta Tags */}
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <meta name="theme-color" content="#ffffff" />
            <link rel="canonical" href={siteUrl} />

            {/* Favicon */}
            <link rel="icon" type="image/png" href="/favicon.png" />
            <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        </Helmet>
    );
} 