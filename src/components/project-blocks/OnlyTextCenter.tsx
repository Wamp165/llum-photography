type Props = {
  text: string;
};

export default function OnlyTextCenter({
  text,
}: Props) {
  return (
    <section className="my-24">
      <div className="mx-auto max-w-2xl">
        <p className="whitespace-pre-line leading-8">
          {text}
        </p>
      </div>
    </section>
  );
}