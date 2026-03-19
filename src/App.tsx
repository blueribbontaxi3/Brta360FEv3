import { useMemo, Suspense } from "react";
import { ConfigProvider, Spin } from "antd";
import { RouterProvider } from "react-router-dom";
import { MediaModalProvider } from "@pages/MediaManager/MediaManagerProvider";
import useRoutes from "./routing/Pages";
import { pdfjs } from "react-pdf";
import { PDFJS_WORKER_URL, PRIMARY_COLOR } from "./configs/env.config";
import "./styles/ui-consistency.css";

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
        colorBgLayout: '#f5f7fb',
        colorBgContainer: '#ffffff',
        borderRadius: 10,
        borderRadiusLG: 12,
        controlHeight: 40,
        fontSize: 14,
      },
      components: {
        Button: {
          controlHeight: 40,
          fontWeight: 600,
          borderRadius: 10,
        },
        Card: {
          borderRadiusLG: 12,
          headerFontSize: 16,
        },
        Input: {
          controlHeight: 40,
          borderRadius: 10,
        },
        InputNumber: {
          controlHeight: 40,
          borderRadius: 10,
        },
        Select: {
          controlHeight: 40,
          borderRadius: 10,
        },
        DatePicker: {
          controlHeight: 40,
          borderRadius: 10,
        },
        Table: {
          headerBg: '#fafafa',
          rowHoverBg: '#f7faff',
          borderColor: '#eef2f6',
        },
        Form: {
          itemMarginBottom: 18,
          labelFontSize: 14,
        },
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
