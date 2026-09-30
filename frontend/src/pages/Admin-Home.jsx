import React from "react";
import {
  EllipsisVerticalIcon,
  ArrowUpIcon,
} from "@heroicons/react/24/outline";
import { StatisticsCard } from "@/widgets/cards";
import { StatisticsChart } from "@/widgets/charts";
import {
  statisticsCardsData,
  statisticsChartsData,
  projectsTableData,
  ordersOverviewData,
} from "@/data";
import { CheckCircleIcon, ClockIcon } from "@heroicons/react/24/solid";

const AdminHome = () => {
  return (
    <div className="mx-auto max-w-[1400px] space-y-8">
      <div>
        <span className="eyebrow">Dashboard</span>
        <h1 className="mt-3 text-[26px] font-bold leading-tight text-ink md:text-[30px]">
          Platform overview
        </h1>
        <p className="mt-1 text-[15px] text-muted">
          Key metrics and recent activity across DiagnoAI.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {statisticsCardsData.map(({ icon, title, footer, ...rest }) => (
          <StatisticsCard
            key={title}
            {...rest}
            title={title}
            icon={React.createElement(icon, {
              className: "w-5 h-5",
            })}
            footer={
              <p className="text-muted">
                <strong className={`font-semibold ${footer.color}`}>
                  {footer.value}
                </strong>
                &nbsp;{footer.label}
              </p>
            }
          />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {statisticsChartsData.map((props) => (
          <StatisticsChart
            key={props.title}
            {...props}
            footer={
              <p className="flex items-center gap-1.5 text-muted">
                <ClockIcon className="h-4 w-4 text-slate-400" aria-hidden="true" />
                {props.footer}
              </p>
            }
          />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <div className="card overflow-hidden xl:col-span-2">
          <div className="flex items-center justify-between gap-4 p-5 sm:p-6">
            <div>
              <h2 className="text-[17px] font-semibold text-ink">Projects</h2>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-muted">
                <CheckCircleIcon className="h-4 w-4 text-accent-500" aria-hidden="true" />
                <strong className="font-semibold text-ink-700">30 done</strong> this
                month
              </p>
            </div>
            <details className="relative">
              <summary
                className="flex h-9 w-9 cursor-pointer list-none items-center justify-center rounded-full text-muted transition hover:bg-surface focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-100 [&::-webkit-details-marker]:hidden"
                aria-label="Project actions"
              >
                <EllipsisVerticalIcon strokeWidth={2} className="h-5 w-5" />
              </summary>
              <ul className="absolute right-0 z-10 mt-2 w-48 rounded-xl bg-white p-1.5 text-sm shadow-lift ring-1 ring-line">
                {["Action", "Another Action", "Something else here"].map((a) => (
                  <li key={a}>
                    <button
                      type="button"
                      className="w-full rounded-lg px-3 py-2 text-left text-ink-700 hover:bg-surface"
                    >
                      {a}
                    </button>
                  </li>
                ))}
              </ul>
            </details>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="border-y border-line bg-surface">
                <tr>
                  {["Companies", "Members", "Budget", "Completion"].map((el) => (
                    <th
                      key={el}
                      scope="col"
                      className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-muted"
                    >
                      {el}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {projectsTableData.map(
                  ({ img, name, members, budget, completion }) => (
                    <tr key={name} className="transition hover:bg-surface/70">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={img}
                            alt={name}
                            className="h-9 w-9 rounded-lg bg-surface object-contain p-1 ring-1 ring-line"
                          />
                          <span className="font-semibold text-ink">{name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex">
                          {members.map(({ img, name }, key) => (
                            <img
                              key={name}
                              src={img}
                              alt={name}
                              title={name}
                              className={`h-7 w-7 rounded-full object-cover ring-2 ring-white ${
                                key === 0 ? "" : "-ml-2"
                              }`}
                            />
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-ink-700">
                        {budget}
                      </td>
                      <td className="px-6 py-4">
                        <div className="w-40">
                          <span className="mb-1.5 block text-xs font-semibold text-ink-700">
                            {completion}%
                          </span>
                          <div
                            className="h-1.5 w-full overflow-hidden rounded-full bg-line"
                            role="progressbar"
                            aria-valuenow={completion}
                            aria-valuemin={0}
                            aria-valuemax={100}
                          >
                            <div
                              className={`h-full rounded-full ${
                                completion === 100 ? "bg-accent-500" : "bg-brand-600"
                              }`}
                              style={{ width: `${completion}%` }}
                            />
                          </div>
                        </div>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card p-5 sm:p-6">
          <h2 className="text-[17px] font-semibold text-ink">Orders Overview</h2>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-muted">
            <ArrowUpIcon strokeWidth={3} className="h-3.5 w-3.5 text-accent-500" />
            <strong className="font-semibold text-ink-700">24%</strong> this month
          </p>
          <ol className="mt-6">
            {ordersOverviewData.map(({ icon, title, description }, key) => (
              <li key={title} className="relative flex gap-4 pb-6 last:pb-0">
                {key !== ordersOverviewData.length - 1 && (
                  <span
                    aria-hidden="true"
                    className="absolute left-4 top-9 h-[calc(100%-2.25rem)] w-px bg-line"
                  />
                )}
                <span className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600 ring-1 ring-inset ring-brand-100">
                  {React.createElement(icon, { className: "h-4 w-4" })}
                </span>
                <div className="pt-1">
                  <p className="text-sm font-semibold text-ink">{title}</p>
                  <p className="mt-0.5 text-xs font-medium text-muted">
                    {description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
