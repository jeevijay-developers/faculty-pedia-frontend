import ViewProfile from "@/components/Educator/ViewProfile";
import React from "react";

const page = async ({ params }) => {
  const { id } = params;
  return (
    <div>
      {/* sfsdf */}
      <ViewProfile userId={id} />
    </div>
  );
};

export default page;
