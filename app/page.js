import { Suspense } from "react";
import { connection } from "next/server";
import { pool } from "@/lib/db";
import AddCourseForm from "./add-course-form";

export default function Home() {
  return (
    <main className="course-shell min-h-screen">
      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-16">
        <header className="mb-10 border-b border-emerald-200/15 pb-8">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1 text-xs font-semibold tracking-widest text-emerald-300 uppercase">
            <span className="size-2 rounded-full bg-emerald-400" />
            Academic Dashboard
          </p>

          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Course <span className="text-emerald-300">Catalog</span>
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-emerald-100/75">
            <p>Karn Yongsiriwit · 6090059</p>
            <p className="rounded-md border border-emerald-200/15 bg-emerald-950/60 px-2.5 py-1">
              Database <code className="text-emerald-200">6090059_mydb</code>
            </p>
          </div>
        </header>

        <Suspense
          fallback={
            <p role="status" className="text-sm text-emerald-200">
              Loading courses…
            </p>
          }
        >
          <Courses />
        </Suspense>
      </div>
    </main>
  );
}

async function Courses() {
  await connection();

  const [courses] = await pool.query(
    `SELECT c.id, c.code, c.title, c.credits, c.semester, c.seats,
            i.fullname AS instructor
     FROM courses c
     JOIN instructor i ON i.id = c.instructorId
     ORDER BY c.semester, c.code`
  );

  const [instructors] = await pool.query(
    "SELECT id, fullname FROM instructor ORDER BY fullname"
  );

  return (
    <>
      <section aria-labelledby="courses-heading">
        <div className="mb-5 flex flex-wrap items-center gap-3">
          <h2 id="courses-heading" className="text-2xl font-semibold tracking-tight">
            Courses
          </h2>
          <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-200">
            {courses.length} total
          </span>
        </div>

        {courses.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-emerald-200/25 p-6 text-emerald-100/75">
            No courses yet. Add your first course below.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <article
                key={course.id}
                className="flex flex-col rounded-2xl border border-emerald-200/15 bg-emerald-950/55 p-5 shadow-lg shadow-black/10 transition hover:border-emerald-400/50 motion-safe:hover:-translate-y-1"
              >
                <span className="mb-3 self-start rounded-full bg-emerald-400/15 px-3 py-1 font-mono text-xs font-semibold text-emerald-200">
                  {course.code}
                </span>

                <h3 className="mb-5 text-lg leading-snug font-semibold">
                  {course.title}
                </h3>

                <dl className="mt-auto grid grid-cols-3 gap-2 rounded-xl bg-black/20 px-3 py-3 text-center">
                  <div>
                    <dt className="text-xs text-emerald-100/70">Credits</dt>
                    <dd className="mt-1 font-semibold tabular-nums">{course.credits}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-emerald-100/70">Semester</dt>
                    <dd className="mt-1 font-semibold tabular-nums">{course.semester}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-emerald-100/70">Seats</dt>
                    <dd className="mt-1 font-semibold tabular-nums">{course.seats}</dd>
                  </div>
                </dl>

                <p className="mt-4 border-t border-emerald-200/15 pt-3 text-sm">
                  <span className="mr-2 text-emerald-100/65">Instructor</span>
                  <span className="font-medium">{course.instructor}</span>
                </p>
              </article>
            ))}
          </div>
        )}
      </section>

      <div className="mt-12 border-t border-emerald-200/15 pt-8">
        <AddCourseForm instructors={instructors} />
      </div>
    </>
  );
}