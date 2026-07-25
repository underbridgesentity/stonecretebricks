/**
 * The signature move: a hairline laid in from the left, the way a bricklayer
 * runs a string line before setting a course. Left to right, in the reading
 * direction, once per section.
 *
 * It used to carry a bold datasheet number as well ("01 / WHAT WE MAKE").
 * Across a dozen sections that reads as a device rather than a system, so the
 * number is gone and only the quiet label remains.
 *
 * The rule scales from scaleX(0), but that only happens inside the @supports
 * block in globals.css. Without scroll timelines it renders at full width,
 * which is the resting state anyway.
 */

const tones = {
  line: "bg-line",
  oxide: "bg-oxide",
} as const;

type Tone = keyof typeof tones;

export function CourseRule({
  label,
  tone = "line",
  className = "",
}: {
  /** Retained so existing call sites keep compiling. Not rendered. */
  datum?: string;
  label?: string;
  tone?: Tone;
  className?: string;
}) {
  return (
    <div className={`flex w-full flex-col gap-5 ${className}`}>
      <span aria-hidden className={`h-px w-full origin-left ${tones[tone]} animate-course-lay`} />
      {label ? <p className="text-datum uppercase text-ink-secondary">{label}</p> : null}
    </div>
  );
}
