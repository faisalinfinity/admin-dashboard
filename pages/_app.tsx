import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { FeedbackProvider } from "./context/FeedbackContext";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <FeedbackProvider>
      <Component {...pageProps} />
    </FeedbackProvider>
  );
}
