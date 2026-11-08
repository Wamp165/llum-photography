import type { ReactNode } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import { getSettings } from "@/data/settings";
import { SIZES_WIDE_ABOUT, lcpProps } from "@/lib/image-sizes";
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
  const hasPhoto = Boolean(settings.profile_picture);

  return (
    <div className="site-container-wide pb-16">
      <section
        className={`grid items-start gap-10 ${hasPhoto ? "md:grid-cols-2" : "mx-auto max-w-2xl"}`}
      >
        {settings.profile_picture && (
          <div className="relative h-[45svh] min-h-[18rem] overflow-hidden bg-neutral-100 md:h-[60svh]">
            <Image
              src={settings.profile_picture}
              alt={settings.photographer_name}
              fill
              sizes={SIZES_WIDE_ABOUT}
              {...lcpProps(true)}
              className="object-cover"
            />
          </div>
        )}

        <div className="md:pt-8">
          <h1 className="mb-6 text-display font-semibold">
            About me
          </h1>

          {settings.bio && (
            <p className="whitespace-pre-line break-words text-body">
              {settings.bio}
            </p>
          )}

          <dl className="mt-8 border-t border-neutral-200 text-body">
            {settings.location && (
              <InfoRow label="Based in">{settings.location}</InfoRow>
            )}

            {settings.instagram && (
              <InfoRow label="Instagram">
                <a
                  href={`https://instagram.com/${settings.instagram}`}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:underline"
                >
                  {settings.instagram}
                </a>
              </InfoRow>
            )}

            {settings.substack && (
              <InfoRow label="Substack">
                <a
                  href={`https://${settings.substack}.substack.com`}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:underline"
                >
                  {settings.substack}
                </a>
              </InfoRow>
            )}

            {settings.contact_email && (
              <InfoRow label="Email">
                <a
                  href={`mailto:${settings.contact_email}`}
                  className="break-all hover:underline"
                >
                  {settings.contact_email}
                </a>
              </InfoRow>
            )}
          </dl>
        </div>
      </section>
    </div>
  );
}

function InfoRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-[6.5rem_1fr] items-baseline gap-4 border-b border-neutral-200 py-3">
      <dt className="text-meta uppercase tracking-[0.2em] text-neutral-500">{label}</dt>
      <dd>{children}</dd>
    </div>
  );
}
