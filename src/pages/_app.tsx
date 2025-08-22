import { type AppType } from "next/app";
import { Geist } from "next/font/google";
import { MantineProvider, ColorSchemeScript } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { ModalsProvider } from '@mantine/modals';
import { NavigationProgress } from '@mantine/nprogress';

import { api } from "~/utils/api";
import { mantineTheme } from "~/theme/mantine-theme";

import "~/styles/globals.css";
// Mantine core styles
import '@mantine/core/styles.css';
// Mantine notifications styles
import '@mantine/notifications/styles.css';

// Mantine nprogress styles
import '@mantine/nprogress/styles.css';

const geist = Geist({
  subsets: ["latin"],
});

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <>
      <ColorSchemeScript />
      <MantineProvider theme={mantineTheme}>
        <ModalsProvider>
          <Notifications />
          <NavigationProgress />
          <div className={geist.className}>
            <Component {...pageProps} />
          </div>
        </ModalsProvider>
      </MantineProvider>
    </>
  );
};

export default api.withTRPC(MyApp);
