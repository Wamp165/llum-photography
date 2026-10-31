type Props = {
  photographerName: string;
};

export default function Footer({ photographerName }: Props) {
  const year = new Date().getFullYear();

  return (
    <footer className="site-container pb-8 pt-16 text-left text-xs text-neutral-600 sm:text-sm">
      <p>
        © {year} | {photographerName}
      </p>
    </footer>
  );
}
