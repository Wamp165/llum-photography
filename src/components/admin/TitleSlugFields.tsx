"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { slugify } from "@/lib/slugify";
import Field from "./Field";

type Props = {
  titleName: string;
  titleLabel: string;
  defaultTitle: string;
  defaultSlug: string;
  /** Text before the slug in the URL preview, e.g. "/projects/". */
  urlPrefix: string;
};

/**
 * Title + slug. The slug follows the title while it still matches the generated
 * one; once edited by hand it stays as typed.
 */
export default function TitleSlugFields({
  titleName,
  titleLabel,
  defaultTitle,
  defaultSlug,
  urlPrefix,
}: Props) {
  const [title, setTitle] = useState(defaultTitle);
  const [slug, setSlug] = useState(defaultSlug);
  const [linked, setLinked] = useState(defaultSlug === slugify(defaultTitle));

  return (
    <>
      <Field label={titleLabel} name={titleName}>
        {(id) => (
          <Input
            id={id}
            name={titleName}
            value={title}
            required
            onChange={(event) => {
              setTitle(event.target.value);
              if (linked) setSlug(slugify(event.target.value));
            }}
          />
        )}
      </Field>

      <Field label="Slug" name="slug" hint={`URL: ${urlPrefix}${slug || "…"}`}>
        {(id) => (
          <Input
            id={id}
            name="slug"
            value={slug}
            required
            onChange={(event) => {
              setSlug(event.target.value);
              setLinked(false);
            }}
          />
        )}
      </Field>
    </>
  );
}
