import DataTable, { Cols } from "@/components/shared/table";
import { Button, buttonVariants } from "@/components/ui/button";
import { MoreHorizontalFill, Plus } from "akar-icons";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useRef, useState } from "react";
import { _delete, _get, _post } from "@/utils/network";
import { ACCOUNT_ROUTE } from "@/constants/urls";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/Auth";
import { Input } from "@/components/ui/input";

export default function AccountDetails() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [account, setAccount] = useState("");

  const btnRef = useRef(null as any);

  const { user } = useAuth();

  useEffect(() => {
    _get(ACCOUNT_ROUTE + "/" + user?._id).then((e) => {
      const resp = e.data;
      if (resp.success) {
        setData(resp.data.accounts);
        setLoading(false);
      } else {
        toast({
          title: "Some error occurred",
          description: resp.errors[0],
          variant: "destructive",
        });
      }
    });
  }, []);

  const { toast } = useToast();

  const deleteAccount = (id: string) => {
    _delete(ACCOUNT_ROUTE + "/" + id).then((e) => {
      const resp = e.data;
      if (resp.success) {
        const filter = data.filter((e: any) => e._id != id);
        setData(filter);
        toast({
          description: "Success",
        });
      } else {
        toast({
          title: "Some error occurred",
          description: resp.errors[0],
          variant: "destructive",
        });
      }
    });
  };

  const handleSubmit = () => {
    _post(ACCOUNT_ROUTE, {
      user_id: user?._id,
      account_name: account,
    }).then((e) => {
      const resp = e.data;

      if (resp.success) {
        const newData = [resp.data.account, ...data];
        setData(newData);
        btnRef.current.click();
      } else {
        toast({
          title: "Some error occurred",
          description: resp.errors[0],
          variant: "destructive",
        });
      }
    });
  };

  const columns: Cols[] = [
    {
      title: "Name",
      filter: "account_name",
    },
    {
      title: "Actions",
      filter: "action",
      classNames: "w-[100px]",
      render: (_, row) => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger
              className={buttonVariants({ variant: "secondary" })}
            >
              <MoreHorizontalFill />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                onClick={() => {
                  deleteAccount(row!._id);
                }}
              >
                Delete Category
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
  return (
    <>
      <Toaster />
      <div className="flex flex-col gap-8 bg-white p-8 border rounded-md">
        <div className="flex flex-col lg:flex-row gap-4 justify-between">
          <h1 className="text-2xl font-semibold">Accounts Page</h1>
          <div className="flex flex-col lg:flex-row">
            <Sheet>
              <SheetTrigger
                ref={btnRef}
                className={buttonVariants({ variant: "default" })}
              >
                <Plus size={16} /> Add New
              </SheetTrigger>
              <SheetContent side={"right"}>
                <SheetHeader>
                  <SheetTitle>Create new account</SheetTitle>
                  <SheetDescription>
                    Create a new account to track your transactions.
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-8 flex flex-col gap-1">
                  <span className="text-sm font-medium">Account Name</span>
                  <Input
                    value={account}
                    onChange={(e) => {
                      setAccount(e.target.value);
                    }}
                    placeholder="eg. Cash, Bank, Credit Card, etc"
                  />
                </div>
                <Button
                  disabled={account === ""}
                  onClick={() => {
                    handleSubmit();
                  }}
                  className="mt-4 w-full"
                >
                  Submit
                </Button>
              </SheetContent>
            </Sheet>
          </div>
        </div>
        <DataTable
          loading={loading}
          caption="Your accounts"
          columns={columns}
          data={data}
        />
      </div>
    </>
  );
}
