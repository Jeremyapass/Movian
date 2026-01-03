import React from "react";

const AddReviewSkeleton = () => {
  return (
    <div className="flex flex-col gap-[10px]">
      {/* Avatar + Rate Buttons */}
      <div className="flex gap-[10px] items-center">
        <div className="w-8 h-8 rounded-full bg-[#2A2A2A]" />

        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="w-[36px] h-[36px] bg-[#2A2A2A] rounded-lg"
            />
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="ml-[40px]">
        <div className="h-[44px] w-full bg-[#2A2A2A] rounded-md" />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 self-end ml-[40px]">
        <div className="w-[80px] h-[36px] bg-[#2A2A2A] rounded-md" />
        <div className="w-[110px] h-[36px] bg-[#2A2A2A] rounded-md" />
      </div>
    </div>
  );
};

export default AddReviewSkeleton;
