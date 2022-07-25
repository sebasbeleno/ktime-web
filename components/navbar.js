/* This example requires Tailwind CSS v2.0+ */
import { useUser } from "@auth0/nextjs-auth0";
import { Disclosure, Menu } from "@headlessui/react";
import { MenuIcon, XIcon } from "@heroicons/react/outline";
import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import Image from "next/image";
import { useRouter } from "next/router";

const navigation = [{ name: "Dashboard", href: "#", current: true }];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Navbar() {
  const router = useRouter();
  const { user, isLoading, error } = useUser();

  const onSignOut = async () => {
    console.log("Signing out");
    const { logout } = await supabaseClient.auth.signOut();

    router.push("/");
  };

  const renderUserAvatar = (user) => {
    if (user) {
      return (
        <Menu as="div" className="ml-3 relative">
          <div>
            <Menu.Button className="bg-gray-50 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
              <span className="sr-only">Open user menu</span>
              <Image
                className="h-8 w-8 rounded-full"
                src={user.picture}
                alt=""
                width="40%"
                height="40%"
              />
            </Menu.Button>
          </div>
        </Menu>
      );
    }
  };

  const RenderWelcomeMessage = () => {
    if (user) {
      return (
        <div className="">
          <h1 className="font-bold text-gray-600 text-xl">Hi, {user.name}</h1>
          <h1 className="font-sans text-gray-500">Welcome back to Ktime</h1>
        </div>
      );
    } else {
      return null;
    }
  };

  return (
    <Disclosure as="nav" className="bg-gray-50">
      {({ open }) => (
        <>
          <div className="px-2 sm:px-6 lg:px-8">
            <div className="relative flex items-center justify-between h-24">
              <div className="absolute inset-y-0 left-0 flex items-center  sm:hidden">
                {/* Mobile menu button*/}
                <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="absolute inset-y-0 right-0 flex min-w-full justify-between items-center pr-2 sm:static sm:inset-auto sm:pl-4 sm:pr-2 ">
                {RenderWelcomeMessage()}
                {renderUserAvatar(user)}
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  href={item.href}
                  className={classNames(
                    item.current
                      ? "bg-gray-900 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white",
                    "block px-3 py-2 rounded-md text-base font-medium"
                  )}
                  aria-current={item.current ? "page" : undefined}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
