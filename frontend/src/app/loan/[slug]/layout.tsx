export function generateStaticParams() {
  return [
    { slug: 'personal-loan' },
    { slug: 'business-loan' },
    { slug: 'home-loan' },
    { slug: 'loan-against-property' },
    { slug: 'education-loan' },
    { slug: 'car-loan' },
  ];
}

export default function LoanLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
