type Props = {
  photographerName: string;
};

export default function Footer({ photographerName }: Props) {
  const year = new Date().getFullYear();

  return (
    <footer className="site-container pb-8 pt-16 text-left text-meta text-neutral-600">
      <p>
        © {year} | {photographerName}
      </p>
    </footer>
  );
}
