import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React from "react";

export type Cols = {
  title: string;
  filter: string;
  classNames?: string;
  render?: (value: string | any, data?: Data) => React.ReactNode;
};

export type Data = {
  [key: string]: string;
};
interface props {
  caption: string;
  columns: Cols[];
  data: Data[];
  loading?: boolean;
}

export default function DataTable({ caption, columns, data, loading }: props) {
  return (
    <div className="bg-white rounded-md border">
      {!loading ? (
        <Table>
          <TableCaption>{caption}</TableCaption>
          <TableHeader>
            <TableRow>
              {columns.map((col, i) => {
                return (
                  <TableHead key={i} className={`${col.classNames ?? ""}`}>
                    {col.title}
                  </TableHead>
                );
              })}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, i) => {
              return (
                <TableRow key={i}>
                  {columns.map((col, i) => {
                    return (
                      <TableCell className={col.classNames ?? ""} key={i}>
                        {col.render
                          ? col.render(row[col.filter], row)
                          : row[col.filter]}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      ) : (
        <div className="flex items-center justify-center p-12 text-3xl font-semibold">
          Loading...
        </div>
      )}
    </div>
  );
}
