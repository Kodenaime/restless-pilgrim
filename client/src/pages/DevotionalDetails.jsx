
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { getDevotionalById } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { motion } from 'framer-motion';

const DevotionalDetails = () => {
  const { id } = useParams();

  const { data: devotional, isLoading, isError, error, } = useQuery({
    queryKey: ['devotional', id],
    queryFn: () => getDevotionalById(id),
  });

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <ErrorMessage message={error.message} />;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="h-64 sm:h-80 overflow-hidden">
          <img
            src={devotional.image || '/default-devotional.jpg'}
            alt={devotional.title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            {devotional.title}
          </h1>
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              Bible Passage:
            </h2>
            <p className="text-blue-600 font-medium">{devotional.passage}</p>
          </div>
          <div className="prose max-w-none text-gray-700">
            <p className="text-lg mb-6">{devotional.shortDescription}</p>
            <div className="space-y-4">{devotional.content}</div>
          </div>
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Published on {new Date(devotional.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DevotionalDetails;