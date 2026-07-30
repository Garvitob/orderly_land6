import { Label } from "./Label";

/**
 * §0.3. I cannot generate photography, and §5.1 bans referencing an image path
 * that does not exist on disk. So where a section genuinely wants a still, it
 * gets an honest empty block that names the asset required. Every instance is
 * listed in the final report.
 */
export function PhotoSlot({
  ratio = "3 / 2",
  name,
  dimensions,
}: {
  ratio?: string;
  name: string;
  dimensions: string;
}) {
  return (
    <div className="photoslot" style={{ aspectRatio: ratio }}>
      <div>
        <Label tone="text-2">{name}</Label>
        <Label tone="text-2" style={{ opacity: 0.7 }}>
          {dimensions}
        </Label>
      </div>
    </div>
  );
}
