import React from 'react';

const SkeletonCard = () => {
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white flex flex-col h-full animate-pulse">
      {/* Image Skeleton */}
      <div className="h-[165px] bg-gray-100 skeleton w-full"></div>
      
      <div className="p-4 flex flex-col flex-1 gap-3">
        {/* Category Badge Skeleton */}
        <div className="h-3 w-16 bg-gray-100 skeleton rounded-md"></div>
        
        {/* Title Skeleton */}
        <div className="space-y-2">
          <div className="h-4 w-full bg-gray-100 skeleton rounded-md"></div>
          <div className="h-4 w-2/3 bg-gray-100 skeleton rounded-md"></div>
        </div>
        
        {/* Price Skeleton */}
        <div className="h-6 w-20 bg-gray-100 skeleton rounded-md mt-1"></div>
        
        {/* Description Skeleton */}
        <div className="space-y-1 mt-1">
          <div className="h-3 w-full bg-gray-50 skeleton rounded-md"></div>
          <div className="h-3 w-full bg-gray-50 skeleton rounded-md"></div>
        </div>
        
        {/* Button Skeleton */}
        <div className="h-10 w-full bg-gray-100 skeleton rounded-lg mt-auto"></div>
      </div>
    </div>
  );
};

export default SkeletonCard;
