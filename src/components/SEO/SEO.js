import React from 'react';
import { Helmet } from 'react-helmet';

const getWindowSafe = () => {
	try {
		return window;
	} catch (e) {
		return undefined;
	}
};

export default function SEO({
	title,
	description = 'Mr. Elfallah | المستر الفلاح - منصة تفاعلية لتعلم الإنجليزية بطريقة ممتعة وبسيطة للأطفال. دروس، ألعاب، وأسئلة تفاعلية.',
	lang = 'ar',
	path,
	image = 'https://res.cloudinary.com/duovxefh6/image/upload/v1750670187/logo_mm135b.png',
	type = 'website',
}) {
	const win = getWindowSafe();
	const origin = win?.location?.origin || 'https://elmisterelfallah.com';
	const pathname = path || win?.location?.pathname || '/';
	const canonicalUrl = `${origin}${pathname}`;

	const siteNameEn = 'Mr. Elfallah';
	const siteNameAr = 'المستر الفلاح';
	const resolvedTitle = title ? `${title} | ${siteNameAr} • ${siteNameEn}` : `${siteNameAr} • ${siteNameEn}`;

	const organizationLd = {
		'@context': 'https://schema.org',
		'@type': 'Organization',
		name: siteNameEn,
		alternateName: siteNameAr,
		url: origin,
		logo: image,
		sameAs: [
			'https://www.facebook.com/profile.php?id=100064363628042',
			'https://www.instagram.com/el_mister_el_fallah/',
		],
	};

	const websiteLd = {
		'@context': 'https://schema.org',
		'@type': 'WebSite',
		name: `${siteNameAr} • ${siteNameEn}`,
		url: origin,
		inLanguage: lang === 'ar' ? 'ar' : 'en',
	};

	const breadcrumbLd = {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: [
			{
				'@type': 'ListItem',
				position: 1,
				name: lang === 'ar' ? 'الرئيسية' : 'Home',
				item: origin,
			},
			{
				'@type': 'ListItem',
				position: 2,
				name: resolvedTitle,
				item: canonicalUrl,
			},
		],
	};

	return (
		<Helmet
			htmlAttributes={{ lang, dir: lang === 'ar' ? 'rtl' : 'ltr' }}
			title={resolvedTitle}
			titleTemplate={`%s`}
			defaultTitle={`${siteNameAr} • ${siteNameEn}`}
		>
			<meta name="description" content={description} />
			<meta name="keywords" content="English for kids, تعلم الإنجليزية للأطفال, دروس إنجليزي, ألعاب تعليمية, تفاعلي, Kids English, Learning, Education" />
			<meta name="author" content={`${siteNameEn} | ${siteNameAr}`} />
			<meta name="robots" content="index, follow, max-image-preview:large" />

			{/* Open Graph */}
			<meta property="og:type" content={type} />
			<meta property="og:title" content={resolvedTitle} />
			<meta property="og:description" content={description} />
			<meta property="og:site_name" content={`${siteNameAr} • ${siteNameEn}`} />
			<meta property="og:url" content={canonicalUrl} />
			<meta property="og:image" content={image} />
			<meta property="og:locale" content={lang === 'ar' ? 'ar_AR' : 'en_US'} />
			<meta property="og:locale:alternate" content={lang === 'ar' ? 'en_US' : 'ar_AR'} />

			{/* Twitter */}
			<meta name="twitter:card" content="summary_large_image" />
			<meta name="twitter:title" content={resolvedTitle} />
			<meta name="twitter:description" content={description} />
			<meta name="twitter:image" content={image} />

			<link rel="canonical" href={canonicalUrl} />
			<link rel="alternate" hrefLang="ar" href={canonicalUrl} />
			<link rel="alternate" hrefLang="x-default" href={canonicalUrl} />

			<script type="application/ld+json">{JSON.stringify(organizationLd)}</script>
			<script type="application/ld+json">{JSON.stringify(websiteLd)}</script>
			<script type="application/ld+json">{JSON.stringify(breadcrumbLd)}</script>
		</Helmet>
	);
}


