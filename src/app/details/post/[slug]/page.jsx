import React from "react";
import Banner from "@/components/Common/Banner";
import PostDetails from "@/components/Posts/PostDetails";
import blogData from "@/Data/Posts/postdetails.data";

const Page = async ({ params }) => {
  const { slug } = params;

  return (
    <div>
      <Banner
        url={blogData.image?.url || "/images/placeholders/1.svg"}
        title={"Blog Post Details"}
        subtitle={
          "Discover insights, tips, and in-depth knowledge from our expert educators and thought leaders."
        }
      />
      <PostDetails postData={blogData} />
    </div>
  );
};

export default Page;
