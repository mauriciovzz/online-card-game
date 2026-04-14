import { useIsMobile } from "@/hooks/useIsMobile";

export const Card = ({
  svgGroup,
}: {
  svgGroup: string;
}) => {
  const isMobile = useIsMobile();
  let scale = isMobile ? 1 : 2;

  if (!svgGroup) return null;

  // Extract x, y from the <rect> element inside the group
  const extractCoordinates = (group: Element) => {
    const rect = group.querySelector("rect");
    const x = rect
      ? parseFloat(rect.getAttribute("x") ?? "0")
      : 0;
    const y = rect
      ? parseFloat(rect.getAttribute("y") ?? "0")
      : 0;
    return { x, y };
  };

  const transformSvg = (svgString: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(
      svgString,
      "image/svg+xml"
    );

    // Get outermost <g>
    const g = doc.querySelector("g");
    if (!g) return svgString;

    // if WC reduce scale by 1/4
    const id = g.getAttribute("id") ?? "";
    if (id === "WC") scale *= 0.25;

    g.removeAttribute("transform");

    const { x, y } = extractCoordinates(g);

    // Serialize the inner <g>
    const serializer = new XMLSerializer();
    const innerGroup = serializer.serializeToString(g);

    const result = `
      <g transform="translate(${(-x * scale).toString()}, ${(-y * scale).toString()})">
        <g transform="scale(${scale.toString()})">
          ${innerGroup}
        </g>
      </g>
    `;

    return result;
  };

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: 60 * scale, height: 90 * scale }}
      dangerouslySetInnerHTML={{
        __html: transformSvg(svgGroup),
      }}
    />
  );
};
