"use client";
import { Switch } from "@ui/components/ui/switch";

export default function InteractiveSwitch({
  postId,
  slug,
  enabled,
  publicationId,
}: {
  postId: string;
  slug: string;
  enabled: boolean;
  publicationId: number;
}) {
  return (
    <Switch
      id="interactive-mode"
      onClick={async () => {
        await fetch("/api/post", {
          body: JSON.stringify({
            id: postId,
            enabled: !enabled,
            publicationId: publicationId,
            slug: slug,
          }),
          method: "POST",
        });
      }}
      defaultChecked={enabled}
      name="interactive-mode"
    />
  );
}
