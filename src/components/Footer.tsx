type Props = {
  photographerName: string;
};

export default function Footer({ photographerName }: Props) {
  const year = new Date().getFullYear();

  return (
    <footer data-site-footer className="text-left text-meta text-neutral-600">
      <p>
        © {year} | {photographerName}
      </p>
    </footer>
  );
}
