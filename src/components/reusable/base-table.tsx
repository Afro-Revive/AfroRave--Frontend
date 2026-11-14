import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Column = {
  key: string;
  label: string;
};

type ReusableTableProps<T> = {
  columns: Column[];
  data: T[];
  caption?: string;
};

export default function BaseTable<T extends Record<string, any>>({
  columns,
  data,
  caption = "A table of your data.",
}: ReusableTableProps<T>) {
  return (
    <Table className="w-full">
      <TableCaption className="sr-only text-black">{caption}</TableCaption>

      <TableHeader className="bg-charcoal">
        <TableRow className="hover:bg-charcoal">
          {columns.map((col) => (
            <TableHead
              key={col.key}
              className="text-xs font-inter-tight font-medium capitalize first:rounded-tl-[5px] last:rounded-tr-[5px]"
            >
              {col.label}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>

      <TableBody className="border-x border-b border-charcoal/50 rounded-b-[5px]">
        {data.map((row, i) => (
          <TableRow
            key={i}
            className="text-xs text-black font-inter-tight capitalize"
          >
            {columns.map((col) => (
              <TableCell key={col.key} className="text-inherit">
                {String(row[col.key])}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
