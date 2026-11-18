/* Course card shared by Home, Courses and category views. */
/* Every course picture is the same square size (1000x1000), so all cards line up. */
/* The whole card is clickable through one stretched link (no nested links); the course title */
/* is already printed on the picture, so the heading is kept for screen readers only. */

import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { SafeImage } from "@/components/SafeImage";
import type { Course } from "@/data/courses";

export function CourseCard({ course }: { course: Course }) {
  const Icon = course.icon;

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-brand has-[:focus-visible]:ring-offset-2">
      <div className="p-1.5 pb-0 sm:p-2 sm:pb-0">
        <div className={`relative aspect-square w-full overflow-hidden rounded-xl ${course.tint}`}>
          <span className="absolute inset-0 flex items-center justify-center" aria-hidden>
            <Icon className={`h-9 w-9 opacity-50 ${course.accent}`} />
          </span>

          <SafeImage
            src={course.image}
            alt={course.imageAlt}
            width={1000}
            height={1000}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        </div>
      </div>

      <div className="flex flex-1 flex-col px-2.5 pb-2.5 pt-2 sm:px-3.5 sm:pb-3 sm:pt-2.5">
        <h3 className="sr-only">{course.title}</h3>

        <p className="line-clamp-2 text-[11px] leading-snug text-muted-foreground sm:text-xs">
          {course.description}
        </p>

        <span className="mt-auto flex items-center justify-between gap-1 pt-2 text-xs font-semibold text-brand sm:pt-3 sm:text-[13px]">
          <Link
            to="/courses/$slug"
            params={{ slug: course.slug }}
            className="outline-none after:absolute after:inset-0 after:content-['']"
          >
            Explore Course
            <span className="sr-only">: {course.title}</span>
          </Link>

          <span
            aria-hidden
            className="pointer-events-none inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand sm:h-7 sm:w-7 text-primary-foreground shadow-md transition-transform duration-200 group-hover:translate-x-0.5 group-hover:scale-105"
          >
            <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </span>
      </div>
    </article>
  );
}
