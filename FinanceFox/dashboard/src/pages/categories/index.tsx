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
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/context/Auth";
import { _delete, _get, _post } from "@/utils/network";
import { CATEGORIES_ROUTE } from "@/constants/urls";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";

export default function Categories() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const btnRef = useRef(null as any);

  const [category, setCategory] = useState("");

  useEffect(() => {
    _get(CATEGORIES_ROUTE + "/" + user?._id).then((e) => {
      const resp = e.data;

      if (resp.success) {
        setData(resp.data.categories);
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

  const { toast } = useToast();

  const deleteCategory = (id: string) => {
    _delete(CATEGORIES_ROUTE + "/" + id).then((e) => {
      const resp = e.data;
      if (resp.success) {
        const filteredData = data.filter((e: any) => e._id != id);
        setData(filteredData);
        toast({
          title: "Success",
        });
      } else {
        toast({
          title: "Some error occured",
          description: resp.errors[0],
          variant: "destructive",
        });
      }
    });
  };

  const handleSubmit = () => {
    _post(CATEGORIES_ROUTE, {
      user_id: user?._id,
      category_name: category,
    }).then((e) => {
      const resp = e.data;

      if (resp.success) {
        const newData = [resp.data.category, ...data];
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
      filter: "category_name",
    },
    {
      title: "Actions",
      filter: "",
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
                  deleteCategory(row!._id);
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
          <h1 className="text-2xl font-semibold">Categories Page</h1>
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
                  <SheetTitle>Create new category</SheetTitle>
                  <SheetDescription>
                    Create a new category to organize your transactions.
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-8 flex flex-col gap-1">
                  <span className="text-sm font-medium">Category Name</span>
                  <Input
                    value={category}
                    onChange={(e) => {
                      setCategory(e.target.value);
                    }}
                    placeholder="eg. Food, Travel, etc"
                  />
                </div>
                <Button
                  disabled={category === ""}
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
          caption="Existing categories"
          columns={columns}
          data={data}
        />
      </div>
    </>
  );
}
