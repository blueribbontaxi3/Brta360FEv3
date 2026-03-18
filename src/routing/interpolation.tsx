import React from "react";
import { Route, useParams, useLocation } from "react-router-dom";

function interpolateParams(string: string, params: { [key: string]: string } = {}): string {
  return string.replace(
    /:([a-zA-Z]+)/g,
    (match, token1) => `${params[token1]}`,
  );
}

const Error404: React.FC = () => {
  return <h1>Page not found</h1>;
};

interface RouteWithSubRoutesProps {
  path: string;
  subRoutes: string[];
  baseComponent: React.ComponentType<any>;
}

const RouteWithSubRoutes: React.FC<RouteWithSubRoutesProps> = ({ path, subRoutes, baseComponent: BaseComponent }) => {
  const params:any = useParams();
  const location = useLocation();

  return (
    <Route
      path={path}
      element={
        <>
          {(() => {
            const validRoutes = [path, ...subRoutes].map((route) => interpolateParams(route, params));

            return validRoutes.includes(location.pathname) ? (
              <BaseComponent />
            ) : (
              <Error404 />
            );
          })()}
        </>
      }
    />
  );
};

export default RouteWithSubRoutes;
