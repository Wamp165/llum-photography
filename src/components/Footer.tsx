type Props = {
  photographerName: string;
};

export default function Footer({ photographerName }: Props) {
  const year = new Date().getFullYear();

  return (
    <footer data-site-footer className="px-5 pt-16 pb-[18px] text-left text-[12px] leading-[1.5] text-neutral-600 md:px-7 md:pb-[22px]">
      <p>
        © {year} | {photographerName}
      </p>
    </footer>
  );
}
