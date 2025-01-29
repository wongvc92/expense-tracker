import React from "react";

const WidthWrapper = ({ children }: { children: React.ReactNode }) => {
  return <section className="max-w-7xl mx-auto h-full">{children}</section>;
};

export default WidthWrapper;
