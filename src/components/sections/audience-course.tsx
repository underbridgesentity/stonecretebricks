import { CourseRule } from "@/components/ui/course-rule";
import { Course, Stretcher, Wall } from "@/components/ui/wall";
import { AUDIENCES } from "@/data/company";

/**
 * Who buys. Five tiles across a twelve column wall, which does not divide
 * evenly, so the row deliberately does not resolve into a tidy grid.
 */
export function AudienceCourse() {
  return (
    <section className="border-b border-line py-16 md:py-24">
      <Wall>
        <CourseRule datum="03" label="Who we supply" />

        <Course bond="odd" className="mt-10">
          <Stretcher span="wide">
            <h2 className="text-display uppercase text-ink">
              Built for the people who buy by the pallet.
            </h2>
          </Stretcher>
        </Course>

        <div className="mt-12 grid grid-cols-1 gap-[var(--joint)] sm:grid-cols-2 lg:grid-cols-5">
          {AUDIENCES.map((audience, i) => (
            <div
              key={audience.label}
              className="animate-course-set border-t-2 border-line-strong pt-5"
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <p className="text-datum uppercase text-ink-secondary">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-3 text-h3 uppercase text-ink">{audience.label}</h3>
              <p className="mt-2 text-small text-ink-secondary">{audience.note}</p>
            </div>
          ))}
        </div>
      </Wall>
    </section>
  );
}
