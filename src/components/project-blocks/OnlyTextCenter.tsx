type Props = {
  text: string;
};

export default function OnlyTextCenter({
  text,
}: Props) {
  return (
    <section className="my-16">
      <div className="mx-auto max-w-2xl">
        <p className="leading-8">
          {text}
        </p>
      </div>
    </section>
  );
}