"use client";

import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";

export function DataTable({ columns, data }: any) {
  const table = useReactTable({
    data: data?.records ?? data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="bg-white rounded-xl overflow-hidden">
      {/* TABLE */}
            <div className="p-5">

      <table className="w-full text-sm">
        {/* HEADER */}
        <thead className="bg-gray-50">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header, index) => (
                <th
                  key={header.id}
                  className={`px-5 py-4 text-left font-medium text-gray-600 ${
                    index === 0 ? "rounded-l-xl" : ""
                  } ${
                    index === headerGroup.headers.length - 1
                      ? "rounded-r-xl"
                      : ""
                  }`}
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        {/* BODY */}
        <tbody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="border-b last:border-b-0 hover:bg-gray-50 transition"
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-5 py-5 align-middle">
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length}
                className="text-center py-12 text-gray-400"
              >
                No records found
              </td>
            </tr>
          )}
        </tbody>
      </table>
      </div>

      {/* PAGINATION */}
      <div className="flex items-center justify-end gap-4 px-5 py-4 border-t">
        <button
          className="px-3 py-1.5 border rounded-md text-sm disabled:opacity-50"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          ‹
        </button>

        <span className="text-sm text-gray-600">
          {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </span>

        <button
          className="px-3 py-1.5 border rounded-md text-sm disabled:opacity-50"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          ›
        </button>
      </div>
    </div>
  );
}
