import React from "react";

const ErrorPage: React.FC = () => {
  return (
    <>
      <div className="flex h-[100vh] flex-col items-center justify-center gap-4">
        <div className="text-9xl md:text-6xl">404</div>
        <div className="text-4xl md:text-2xl">Page Not Found</div>
      </div>
    </>
  );
};

export default ErrorPage;
