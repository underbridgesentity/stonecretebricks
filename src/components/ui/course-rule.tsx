/**
 * The signature move: a hairline laid in from the left, the way a bricklayer
 * runs a string line before setting a course.
 *
 * The datum sits in the joint, engineering-datasheet style. Left to right, in
 * the reading direction, once per section.
 *
 * The rule scales from scaleX(0), but that only ever happens inside the
 * @supports block in globals.css. Without scroll timelines it renders at full
 * width, which is the resting state anyway.
 */

const tones = {
  line: "bg-line-strong",
  oxide: "bg-oxide",
} as const;

type Tone = keyof typeof tones;

export function CourseRule({
  datum,
  label,
  tone = "line",
  className = "",
}: {
  datum?: string;
  label?: string;
  tone?: Tone;
  className?: string;
}) {
  const hasCaption = Boolean(datum || label);

  return (
    <div className={`flex w-full flex-col gap-3 ${className}`}>
      <span aria-hidden className={`h-px w-full origin-left ${tones[tone]} animate-course-lay`} />
      {hasCaption ? (
        <p className="flex items-baseline gap-3 text-datum uppercase text-ink-secondary">
          {datum ? <span className="font-extrabold text-ink">{datum}</span> : null}
          {label ? <span>{label}</span> : null}
        </p>
      ) : null}
    </div>
  );
}
