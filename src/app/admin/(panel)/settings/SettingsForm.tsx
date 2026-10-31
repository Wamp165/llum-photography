"use client";

import ActionForm from "@/components/admin/ActionForm";
import Field from "@/components/admin/Field";
import ImageInput from "@/components/admin/ImageInput";
import ImageListInput from "@/components/admin/ImageListInput";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { Settings } from "@/types/settings";
import { saveSettings } from "./actions";

type Props = {
  settings: Settings;
};

export default function SettingsForm({ settings }: Props) {
  return (
    <ActionForm action={saveSettings} submitLabel="Save settings">
      <Field label="Photographer name" name="photographer_name">
        {(id) => (
          <Input id={id} name="photographer_name" defaultValue={settings.photographer_name} required />
        )}
      </Field>

      <Field label="Bio" name="bio" hint="Shown on the About page.">
        {(id) => <Textarea id={id} name="bio" defaultValue={settings.bio ?? ""} rows={6} />}
      </Field>

      <Field label="Profile picture" name="profile_picture">
        <ImageInput name="profile_picture" defaultValue={settings.profile_picture} />
      </Field>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Instagram" name="instagram" hint="Username only, without @.">
          {(id) => <Input id={id} name="instagram" defaultValue={settings.instagram ?? ""} />}
        </Field>

        <Field label="Substack" name="substack" hint="Full URL, e.g. https://name.substack.com.">
          {(id) => <Input id={id} type="url" name="substack" defaultValue={settings.substack ?? ""} />}
        </Field>

        <Field label="Contact email" name="contact_email">
          {(id) => (
            <Input
              id={id}
              type="email"
              name="contact_email"
              defaultValue={settings.contact_email ?? ""}
            />
          )}
        </Field>

        <Field
          label="Location"
          name="location"
          hint="City or country. Shown on the About page and in the footer."
        >
          {(id) => <Input id={id} name="location" defaultValue={settings.location ?? ""} />}
        </Field>
      </div>

      <Field
        label="Homepage images"
        name="homepage_images"
        hint="Shown in the homepage carousel, in this order."
      >
        <ImageListInput name="homepage_images" defaultValue={settings.homepage_images} />
      </Field>
    </ActionForm>
  );
}
