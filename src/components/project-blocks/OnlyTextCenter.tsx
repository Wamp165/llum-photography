type Props = {
  text: string;
};

export default function OnlyTextCenter({
  text,
}: Props) {
  return (
    <section className="my-24">
      <div className="mx-auto max-w-2xl">
        <p className="whitespace-pre-line text-body">
          {text}
        </p>
      </div>
    </section>
  );
}