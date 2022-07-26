import { UserProvider } from '@auth0/nextjs-auth0';
import "../styles/globals.css";

export default function MyApp({
  Component,
  pageProps: { session, ...pageProps },
}) {
  const { user } = pageProps;

  return (
    <main className={"dark"}>
      <UserProvider user={user}>
        {/* <ThemeProvider attribute="class" defaultTheme="system">
          <Component {...pageProps} />
        </ThemeProvider> */}
        <Component {...pageProps} />
      </UserProvider>
    </main>
  );
}
