import React from 'react';

/**
 * TarefaViewSkeleton - Loading skeleton for task detail view
 * 
 * Provides a visual placeholder while task data is being fetched,
 * improving perceived performance and user experience.
 */
export const TarefaViewSkeleton: React.FC = () => {
  return (
    <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10 animate-pulse">
      {/* Breadcrumb Skeleton */}
      <div className="mb-6">
        <div className="flex items-center gap-2">
          <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>

      {/* Header Skeleton */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex-1">
          <div className="h-10 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
          <div className="flex items-center gap-3">
            <div className="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="h-11 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-11 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Content - 2/3 width */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description Card Skeleton */}
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke px-6 py-4 dark:border-strokedark">
              <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
            <div className="p-6 space-y-3">
              <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-4 w-5/6 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-4 w-4/6 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>

          {/* Solution Card Skeleton */}
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke px-6 py-4 dark:border-strokedark">
              <div className="h-5 w-40 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
            <div className="p-6 space-y-3">
              <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-4 w-5/6 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-4 w-3/6 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>

        {/* Sidebar - 1/3 width */}
        <div className="lg:col-span-1 space-y-6">
          {/* Status Card Skeleton */}
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="p-6">
              <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
              <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>

          {/* Assignee Card Skeleton */}
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke px-6 py-4 dark:border-strokedark">
              <div className="h-5 w-28 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
            <div className="p-6">
              <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>

          {/* Priority Card Skeleton */}
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke px-6 py-4 dark:border-strokedark">
              <div className="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
            <div className="p-6">
              <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>

          {/* Due Date Card Skeleton */}
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke px-6 py-4 dark:border-strokedark">
              <div className="h-5 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
            <div className="p-6">
              <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>

          {/* Metadata Card Skeleton */}
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke px-6 py-4 dark:border-strokedark">
              <div className="h-5 w-28 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
            <div className="p-6 space-y-3">
              <div>
                <div className="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
              <div>
                <div className="h-3 w-28 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
