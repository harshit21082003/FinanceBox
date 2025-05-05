import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CardProps {
  title?: string;
  value?: number;
  icon?: React.ReactNode;
}
export default function CardDisplay({ title, value, icon }: CardProps) {
  return (
    <Card className="flex-1">
      <CardHeader className="flex flex-row justify-between space-y-0 pb-2">
        <div className="flex flex-col justify-between">
          <CardTitle className="text-2xl font-semibold">{title}</CardTitle>
        </div>
        <div className="bg-blue-100 flex items-center justify-center h-14 w-14 rounded-md text-blue-400">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">${value ? value : 0.0}</div>
      </CardContent>
    </Card>
  );
}
