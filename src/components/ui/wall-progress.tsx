/**
 * Scroll progress as a course of discrete bricks filling left to right.
 *
 * The mask lives on the parent and the animation on the child, so the brick
 * joints stay a fixed 40px pitch instead of stretching with the fill.
 *
 * Hidden entirely unless the browser can drive it: a half-drawn bar that never
 * moves is worse than no bar. It is aria-hidden and carries no information the
 * page does not already show, so hiding it under reduced motion is safe.
 */

const MASK = "repeating-linear-gradient(90deg, #000 0 40px, transparent 40px 43px)";

export function WallProgress() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-[var(--header-h)] z-30 h-[3px]"
      style={{ maskImage: MASK, WebkitMaskImage: MASK }}
    >
      <span className="block h-full w-full bg-oxide animate-wall-fill" />
    </div>
  );
}
