interface StructuredDataProps {
  data: object;
}

export function StructuredData({ data }: StructuredDataProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "State Of The Art",
  description:
    "Community-driven platform to discover, vote on, and discuss the state-of-the-art implementations across different technology categories.",
  url: "https://stateofart.dev",
  logo: "https://stateofart.dev/logo.png",
  foundingDate: "2024",
  sameAs: ["https://github.com/stateofart", "https://twitter.com/stateofart"],
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "State Of The Art",
  description:
    "Community-driven platform to discover, vote on, and discuss the state-of-the-art implementations across different technology categories.",
  url: "https://stateofart.dev",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://stateofart.dev/search?q={search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
};

export const webApplicationSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "State Of The Art",
  description:
    "Community-driven platform to discover, vote on, and discuss the state-of-the-art implementations across different technology categories.",
  url: "https://stateofart.dev",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Vote on tech implementations",
    "Discover state-of-the-art tools",
    "Community discussions",
    "Technology comparisons",
    "Developer recommendations",
  ],
};
