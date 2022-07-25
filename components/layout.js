import Navbar from "./navbar";
import Sidebar from "./sidebar";

export default function Layout({ children, user }) {
  return (
    <div className="min-h-screen">
      <div className="flex ">
        <Sidebar user={user}/>
        <div className="grow">
          <Navbar user={user} />
          <main className="flex flex-row min-h-max p-4">{children}</main>
        </div>
      </div>
      {/* <button
        className="absolute bottom-5 right-5 w-10 h-10 rounded-full bg-gray-800 flex justify-center items-center text-white"
        id="theme-toggle"
      >
        <ThemeSwitcher />
      </button> */}
    </div>
  );
}
