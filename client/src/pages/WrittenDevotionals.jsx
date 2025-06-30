import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import DevotionalCard from '../components/DevotionalCard';
import { getAllDevotionals } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const WrittenDevotionals = () => {
  const [visibleDevotionals, setVisibleDevotionals] = useState(12);

  const {
    data: response, // Renamed from 'devotionals' to 'response'
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['devotionals'],
    queryFn: getAllDevotionals,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const loadMore = () => {
    setVisibleDevotionals((prev) => prev + 12);
  };

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <ErrorMessage message={error.message} />;

  // Safely access the devotionals array
  const devotionals = response?.data || [];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Written Devotionals
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {devotionals.slice(0, visibleDevotionals).map((devotional) => (
            <DevotionalCard key={devotional._id} devotional={devotional} />
          ))}
        </div>

        {devotionals.length > visibleDevotionals && (
          <div className="mt-10 text-center">
            <button
              onClick={loadMore}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              Load More Devotionals
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WrittenDevotionals;