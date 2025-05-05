import DataTable, { Cols } from "@/components/shared/table";
import { Button, buttonVariants } from "@/components/ui/button";
import { Plus } from "akar-icons";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useEffect, useRef, useState } from "react";
import { _get, _post } from "@/utils/network";
import { useAuth } from "@/context/Auth";
import {
  ACCOUNT_ROUTE,
  CATEGORIES_ROUTE,
  TRANSACTION_ROUTE,
} from "@/constants/urls";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";

export default function TransactionDetails() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const { user } = useAuth();

  function fetch() {
    _get(CATEGORIES_ROUTE + "/" + user?._id).then((e) => {
      const resp = e.data;
      if (resp.success) {
        setCategories(resp.data.categories);
      }
    });

    _get(ACCOUNT_ROUTE + "/" + user?._id).then((e) => {
      const resp = e.data;
      if (resp.success) {
        setAccounts(resp.data.accounts);
      }
    });
  }

  const [form, setForm] = useState({
    category: "",
    payee: "",
    amount: undefined,
    account: "",
  });

  function setFields(key: string, value: any) {
    return setForm({ ...form, [key]: value });
  }

  const { toast } = useToast();

  useEffect(() => {
    _get(TRANSACTION_ROUTE + "/" + user?._id).then((e) => {
      const resp = e.data;

      if (resp.success) {
        setData(resp.data.transactions);
        setLoading(false);
      } else {
        toast({
          title: "Some error occured",
          description: resp.errors[0],
          variant: "destructive",
        });
      }
    });
  }, []);

  const columns: Cols[] = [
    {
      title: "Date",
      filter: "created_at",
      classNames: "w-[120px]",
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

  const btnRef = useRef(null as any);

  const handleSubmit = () => {
    _post(TRANSACTION_ROUTE, {
      ...form,
      user_id: user?._id,
    }).then((e) => {
      const resp = e.data;
      if (resp.success) {
        const newData = [resp.data.transaction, ...data];
        setData(newData);
        btnRef.current.click();
      } else {
        toast({
          title: "Some error occured",
          description: resp.errors[0],
          variant: "destructive",
        });
      }
    });
  };

  return (
    <>
      <Toaster />
      <div className="flex flex-col gap-8 bg-white p-8 border rounded-md">
        <div className="flex flex-col lg:flex-row gap-4 justify-between">
          <h1 className="text-2xl font-semibold">Transaction History</h1>
          <div className="flex flex-col lg:flex-row">
            <Sheet>
              <SheetTrigger
                ref={btnRef}
                className={buttonVariants({ variant: "default" })}
                onClick={() => {
                  fetch();
                }}
              >
                <Plus size={16} /> Add New
              </SheetTrigger>
              <SheetContent side={"right"}>
                <SheetHeader>
                  <SheetTitle>Add a new transaction</SheetTitle>
                  <SheetDescription>New transaction.</SheetDescription>
                </SheetHeader>
                <div className="flex flex-col mt-8 gap-4">
                  <div className="flex flex-col gap-2">
                    <p className="text-sm font-semibold">Category</p>
                    <Select onValueChange={(e) => setFields("category", e)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((el: any, i) => {
                          return (
                            <SelectItem key={i} value={el.category_name}>
                              {el.category_name}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <p className="text-sm font-semibold">Account</p>
                    <Select onValueChange={(e) => setFields("account", e)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Account" />
                      </SelectTrigger>
                      <SelectContent>
                        {accounts.map((el: any, i) => {
                          return (
                            <SelectItem key={i} value={el.account_name}>
                              {el.account_name}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <p className="text-sm font-semibold">Payee</p>
                    <Input
                      onChange={(e) => {
                        setFields("payee", e.target.value);
                      }}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <p className="text-sm font-semibold">Amount</p>
                    <Input
                      placeholder="- for expense, normal for income"
                      type="number"
                      onChange={(e) => {
                        setFields("amount", parseInt(e.target.value));
                      }}
                    />
                  </div>
                  <Button
                    disabled={
                      form.account === "" ||
                      form.amount === undefined ||
                      form.amount === 0 ||
                      form.category === "" ||
                      form.payee === "" ||
                      isNaN(parseInt(form.amount))
                    }
                    onClick={handleSubmit}
                  >
                    Submit
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
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
