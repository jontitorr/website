import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="description"
          content="I am a full-stack web developer and a self-taught artist. I love using my skills to create things that are useful and beautiful."
        />
        <meta name="keywords" content="API, javascript, js, html, css, personal project, xminent, react, nextjs" />

        {/* Android */}
        <meta name="theme-color" content="#001dff" />
        <meta name="mobile-web-app-capable" content="yes" />

        {/* IOS */}
        <meta name="apple-mobile-web-app-title" content="Xminent | Fullstack Developer" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />

        {/* Windows */}
        <meta name="msapplication-navbutton-color" content="#001dff" />
        <meta name="msapplication-TileColor" content="#ee01ff" />
        <meta name="msapplication-TileImage" content="mstile-150x150.png" />
        <meta name="msapplication-config" content="browserconfig.xml" />

        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="manifest.json" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#0696a9" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
