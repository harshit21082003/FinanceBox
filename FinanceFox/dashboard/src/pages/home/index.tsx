import { StatisticDown, StatisticUp } from "akar-icons";
import CardDisplay from "../components/Card";
import DataTable, { Cols } from "@/components/shared/table";
import { useEffect, useState } from "react";
import { _get } from "@/utils/network";
import { DETAILS_ROUTE, TRANSACTION_ROUTE } from "@/constants/urls";
import { useAuth } from "@/context/Auth";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";

export default function HomePage() {
  const { user } = useAuth();
  const [data, setData] = useState([]);
  const [ledger, setLedger] = useState({
    income: 0,
    expenses: 0,
  });
  const [loading, setLoading] = useState(true);

  const { toast } = useToast();
  useEffect(() => {
    _get(TRANSACTION_ROUTE + "/" + user?._id + "/5").then((e) => {
      const resp = e.data;

      if (resp.success) {
        setData(resp.data.transactions);
        setLoading(false);
      } else {
        toast({
          title: "Some error occurred",
          description: resp.errors[0],
          variant: "destructive",
        });
      }
    });

    _get(DETAILS_ROUTE + "/" + user?._id).then((e) => {
      const resp = e.data;

      if (resp.success) {
        setLedger({
          income: resp.data.income,
          expenses: resp.data.expenses,
        });
      }
    });
  }, []);
  const columns: Cols[] = [
    {
      title: "Date",
      filter: "created_at",
      classNames: "w-[100px]",
      render: (e) => <>{new Date(e).toLocaleDateString()}</>,
    },
    {
      title: "Category",
      filter: "category",
    },
    {
      title: "Payee",
      filter: "payee",
    },
    {
      title: "Amount",
      filter: "amount",
    },
    {
      title: "Account",
      filter: "account",
    },
  ];
  return (
    <>
      <Toaster />
      <div className="flex flex-col gap-12">
        <div className="flex flex-col lg:flex-row gap-8 flex-wrap">
          {/* <CardDisplay
            title="Remaining"
            value="100"
            icon={<Coin size={32} />}
          /> */}
          <CardDisplay
            title="Expenses"
            value={ledger.expenses}
            icon={<StatisticDown size={32} />}
          />
          <CardDisplay
            title="Income"
            value={ledger.income}
            icon={<StatisticUp size={32} />}
          />
        </div>
        <DataTable
          caption="Your recent transactions"
          columns={columns}
          data={data}
          loading={loading}
        />
      </div>
    </>
  );
}
