import type { Metadata } from "next";
import Image from "next/image";
import { getSettings } from "@/data/settings";
import { SIZES_HALF_GAP_16, lcpProps } from "@/lib/image-sizes";
import { excerpt, socialMetadata } from "@/lib/social-metadata";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const description = settings.bio ? excerpt(settings.bio) : undefined;

  return {
    title: "About",
    description,
    ...socialMetadata({
      siteName: settings.photographer_name,
      title: `About | ${settings.photographer_name}`,
      description,
      image: settings.profile_picture,
    }),
  };
}

export default async function AboutPage() {
  const settings = await getSettings();

  return (
    <div className="site-container pb-24">
      <section className="grid items-start gap-10 md:grid-cols-2 md:gap-16">
        {settings.profile_picture && (
          <Image
            src={settings.profile_picture}
            alt={settings.photographer_name}
            width={1200}
            height={800}
            sizes={SIZES_HALF_GAP_16}
            {...lcpProps(true)}
            className="h-auto w-full"
          />
        )}

        <div>
          <h1 className="mb-6 text-display font-medium">
            About me
          </h1>

          {settings.bio && (
            <p className="max-w-prose whitespace-pre-line break-words text-body">
              {settings.bio}
            </p>
          )}
        </div>
      </section>

      <section className="mt-16 space-y-8 text-body">
        {settings.location && (
          <div>
            <h2 className="mb-1 text-meta font-normal uppercase tracking-[0.08em] text-muted">
              Based in:
            </h2>

            <p>{settings.location}</p>
          </div>
        )}

        {(settings.instagram || settings.substack) && (
          <div>
            <h2 className="mb-1 text-meta font-normal uppercase tracking-[0.08em] text-muted">
              Find me on:
            </h2>

            {settings.instagram && (
              <div>
                <a
                  href={`https://instagram.com/${settings.instagram}`}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:underline"
                >
                  <span className="font-normal text-muted">Instagram:</span>{" "}
                  {settings.instagram}
                </a>
              </div>
            )}

            {settings.substack && (
              <div>
                <a
                  href={`https://${settings.substack}.substack.com`}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:underline"
                >
                  <span className="font-normal text-muted">Substack:</span>{" "}
                  {settings.substack}
                </a>
              </div>
            )}
          </div>
        )}

        {settings.contact_email && (
          <div>
            <h2 className="mb-1 text-meta font-normal uppercase tracking-[0.08em] text-muted">
              Email me:
            </h2>

            <a
              href={`mailto:${settings.contact_email}`}
              className="hover:underline"
            >
              {settings.contact_email}
            </a>
          </div>
        )}
      </section>
    </div>
  );
}
