import { useMemo, Suspense } from "react";
import { ConfigProvider, Spin } from "antd";
import { RouterProvider } from "react-router-dom";
import { MediaModalProvider } from "@pages/MediaManager/MediaManagerProvider";
import useRoutes from "./routing/Pages";
import { pdfjs } from "react-pdf";
import { PDFJS_WORKER_URL, PRIMARY_COLOR } from "./configs/env.config";

// Using environment variable for PDF.js worker URL
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  PDFJS_WORKER_URL,
  import.meta.url,
).toString();

const App = () => {
  const routes = useRoutes();

  // Using environment variable for primary color
  const themeConfig = useMemo(
    () => ({
      token: {
        colorPrimary: PRIMARY_COLOR,
        colorLink: PRIMARY_COLOR,
        borderRadius: 5,
      },
    }),
    []
  );

  return (
    <ConfigProvider theme={themeConfig}>
      <MediaModalProvider>
        <Suspense
          fallback={
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
              }}
            >
              <Spin size="large" />
            </div>
          }
        >
          <RouterProvider router={routes} />
        </Suspense>
      </MediaModalProvider>
    </ConfigProvider>
  );
};

export default App;
