type Props = {
  photographerName: string;
  location: string | null;
};

export default function Footer({ photographerName, location }: Props) {
  const year = new Date().getFullYear();
  const place = location?.trim();

  return (
    <footer className="site-container pb-8 pt-16 text-right text-sm text-neutral-600">
      <p>
        {photographerName} © {year}
        {place ? ` | ${place}` : null}
      </p>
    </footer>
  );
}
