import Image from "next/image";
import { getSettings } from "@/data/settings";

export default async function AboutPage() {
  const settings = await getSettings();

  return (
    <main className="mx-auto max-w-[1400px] px-8">
      <section className="mt-12 flex gap-20">
        <div className="shrink-0">
          {settings.profile_picture && (
            <Image
              src={settings.profile_picture}
              alt={settings.photographer_name}
              width={700}
              height={500}
              className="h-auto w-auto max-w-[700px]"
            />
          )}
        </div>

        <div className="max-w-md">
          <h1 className="mb-8 text-sm font-medium uppercase tracking-wide">
            About Me
          </h1>

          {settings.bio && (
            <p className="leading-8 text-neutral-700">
              {settings.bio}
            </p>
          )}
        </div>
      </section>

      <hr className="my-20 border-neutral-200" />

      <section className="mx-auto max-w-sm space-y-12 text-center">
        <div>
          <h2 className="mb-2 text-sm font-medium">
            Find me on:
          </h2>

          {settings.instagram && (
            <a
              href={`https://instagram.com/${settings.instagram}`}
              target="_blank"
              rel="noreferrer"
              className="underline"
            >
              Instagram: {settings.instagram}
            </a>
          )}
        </div>

        <div>
          <h2 className="mb-2 text-sm font-medium">
            Email me:
          </h2>

          {settings.contact_email && (
            <a
              href={`mailto:${settings.contact_email}`}
              className="underline"
            >
              {settings.contact_email}
            </a>
          )}
        </div>
      </section>
    </main>
  );
}