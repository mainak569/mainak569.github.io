import React from 'react'
import Head from 'next/head';

const TITLE = "Mainak Das — Full-Stack Developer | Portfolio";
const DESCRIPTION = "Mainak Das (mainak569) — Full-Stack Developer and B.Tech CCE student at LNMIIT Jaipur. Next.js, React, TypeScript, Django & deep learning projects. LeetCode Knight. Ubuntu-themed portfolio.";
const URL = "https://mainak.me/";

export default function Meta() {
    return (
        <Head>
            {/* Primary Meta Tags */}
            <title>{TITLE}</title>
            <meta charSet="utf-8" />
            <meta name="title" content={TITLE} />
            <meta name="description" content={DESCRIPTION} />
            <meta name="author" content="Mainak Das (mainak569)" />
            <meta name="keywords"
                content="Mainak Das, mainak569, mainak13, mainak.me, Mainak Das portfolio, Mainak Das LNMIIT, full-stack developer, Next.js developer, ubuntu portfolio" />
            <meta name="robots" content="index, follow" />
            <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
            <meta name="language" content="English" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <meta name="theme-color" content="#E95420" />
            <link rel="canonical" href={URL} />

            {/* Schema.org for Google */}
            <meta itemProp="name" content={TITLE} />
            <meta itemProp="description" content={DESCRIPTION} />
            <meta itemProp="image" content={`${URL}images/logos/logo_1024.png`} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "Person",
                    "name": "Mainak Das",
                    "url": URL,
                    "email": "mailto:mainak.lnmiit@gmail.com",
                    "jobTitle": "Full-Stack Developer",
                    "alumniOf": "The LNM Institute of Information Technology",
                    "sameAs": [
                        "https://github.com/mainak569",
                        "https://www.linkedin.com/in/mainak13",
                        "https://leetcode.com/u/mainak13/",
                        "https://codeforces.com/profile/mainak13",
                        "https://www.codechef.com/users/mainak_13"
                    ]
                })
            }} />
            {/* Twitter */}
            <meta name="twitter:card" content="summary" />
            <meta name="twitter:title" content={TITLE} />
            <meta name="twitter:description" content={DESCRIPTION} />
            <meta name="twitter:image" content={`${URL}images/logos/logo_1024.png`} />
            {/* Open Graph */}
            <meta property="og:title" content={TITLE} />
            <meta property="og:description" content={DESCRIPTION} />
            <meta property="og:image" content={`${URL}images/logos/logo_1024.png`} />
            <meta property="og:url" content={URL} />
            <meta property="og:site_name" content="Mainak Das Portfolio" />
            <meta property="og:locale" content="en_IN" />
            <meta property="og:type" content="website" />

            <link rel="icon" href="images/logos/fevicon.svg" type="image/svg+xml" />
            <link rel="icon" href="images/logos/fevicon.png" type="image/png" />
            <link rel="apple-touch-icon" href="images/logos/logo_192.png" />
            <link href="https://fonts.googleapis.com/css2?family=Ubuntu:wght@300;400;500;700&display=swap" rel="stylesheet"></link>
        </Head>
    )
}
