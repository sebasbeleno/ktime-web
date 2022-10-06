import { UserProfile } from "@auth0/nextjs-auth0";
import Image from "next/image";
import Link from "next/link";
import ActiveLink from "../Atoms/ActiveLink";

interface SidebarProps {
  user?: UserProfile;
}

const Sidebar = ({ user }: SidebarProps) => {
  if (!user) {
    return null;
  }

  return (
    <aside className="hidden sm:inline w-72 bg-" aria-label="Sidebar">
      <div className="overflow-y-auto min-h-screen py-4 px-3 bg-white rounded flex flex-col justify-between">
        <div>
          <div className="space-y-2 flex justify-center mb-5">
            <Image
              src="/logo.svg"
              alt="An SVG of an eye"
              width={151}
              height={62}
            />
          </div>

          <ul className="space-y-2">
            <li>
              <ActiveLink
                href="/dashboard"
                activeClass="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg bg-gray-100"
                defaultClass="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg hover:bg-gray-100"
              >
                <svg
                  aria-hidden="true"
                  className="w-6 h-6 text-gray-500 transition duration-75  group-hover:text-gray-900"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"></path>
                  <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"></path>
                </svg>
                <span className="ml-3">Dashboard</span>
              </ActiveLink>
            </li>
          </ul>
        </div>
        <div className="border-t-2">
          <Link href="api/auth/logout">
            <div className="flex items-center space-x-4 px-3 mt-6 cursor-pointer">
              <Image
                alt="logout icon"
                src="/logout.svg"
                width={30}
                height={39}
              />
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Logout
              </h3>
            </div>
          </Link>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
