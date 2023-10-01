import type { AppProps } from "next/app";
import { PrimeReactProvider } from "primereact/api";
import "@/styles/globals.css";

//theme
import "primereact/resources/themes/lara-light-indigo/theme.css";
// import "primereact/resources/themes/lara-dark-indigo/theme.css";

//core
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <PrimeReactProvider>
      <Component {...pageProps} />
    </PrimeReactProvider>
  );
}
