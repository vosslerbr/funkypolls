import type { AppProps } from "next/app";
import { ReactElement, ReactNode } from "react";
import { PrimeReactProvider } from "primereact/api";
import "@/styles/globals.css";
import "@/styles/navAndFooter.css";

//theme
import "primereact/resources/themes/lara-light-indigo/theme.css";
// import "primereact/resources/themes/lara-dark-indigo/theme.css";

//core
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import { NextPage } from "next";

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  // eslint-disable-next-line
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page) => page);

  return <PrimeReactProvider>{getLayout(<Component {...pageProps} />)}</PrimeReactProvider>;
}
