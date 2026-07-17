export function generateStaticParams() {
  return [
    { slug: 'health-insurance' },
    { slug: 'term-life-insurance' },
    { slug: 'car-insurance' },
    { slug: 'bike-insurance' },
    { slug: 'loan-protector' },
    { slug: 'emi-protector' },
  ];
}

export default function InsuranceLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
