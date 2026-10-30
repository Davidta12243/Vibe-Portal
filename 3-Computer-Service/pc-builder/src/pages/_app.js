import { store } from "@/redux/store";
import "../styles/globals.css";
import { SessionProvider } from "next-auth/react";
import { Provider } from "react-redux";
import Head from "next/head";

export default function MyApp({ Component, pageProps }) {
  const getLayout = Component.getLayout || ((page) => page);

  return (
    <Provider store={store}>
      <SessionProvider session={pageProps.session}>
        <Head>
          <title>Pc-builder</title>
          <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
          <link rel="alternate icon" href="/favicon.ico" />
        </Head>
        {getLayout(<Component {...pageProps} />)}
      </SessionProvider>
    </Provider>
  );
}

