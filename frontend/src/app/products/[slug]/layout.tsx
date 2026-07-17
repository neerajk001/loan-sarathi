export function generateStaticParams() {
  return [
    { slug: 'personal-loan' },
    { slug: 'business-loan' },
    { slug: 'home-loan' },
    { slug: 'loan-against-property' },
    { slug: 'credit-card' },
  ];
}

export default function ProductLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
