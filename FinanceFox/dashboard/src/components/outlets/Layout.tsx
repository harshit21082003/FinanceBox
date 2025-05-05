import { Outlet } from "react-router-dom";
import HeaderComponnet from "../shared/header";

export default function RootLayout() {
  return (
    <>
      <div className="bg-gradient-to-b text-white from-blue-700 to-blue-500 px-4 py-8 lg:px-14 pb-36">
        <HeaderComponnet />
        <div className="flex flex-col gap-3">
          <p className="text-2xl lg:text-4xl font-semibold">Welcome Back,</p>
          <p className="text-sm lg:text-base font-medium opacity-50">
            This is your Financial Overview Report
          </p>
        </div>
      </div>
      <div className="-mt-24 px-4 py-8 lg:px-14">
        <Outlet />
      </div>
    </>
  );
}
