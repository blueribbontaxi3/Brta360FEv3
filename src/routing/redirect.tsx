import * as React from 'react';
import { useNavigate } from 'react-router-dom';

function Redirect({ to }: { to: string }) {
  const navigate = useNavigate();
  React.useEffect(() => {
    navigate(to);
  }, [to, navigate]);

  return null;
}

export default Redirect;
