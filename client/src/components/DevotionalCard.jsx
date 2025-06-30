// components/DevotionalCard.jsx
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const DevotionalCard = ({ devotional }) => {
  // Function to truncate text to 12 words
  const truncateText = (text, wordCount) => {
    const words = text.split(' ');
    if (words.length > wordCount) {
      return words.slice(0, wordCount).join(' ') + '...';
    }
    return text;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
    >
      <div className="h-48 overflow-hidden">
        <img
          src={devotional.image || '/default-devotional.jpg'}
          alt={devotional.title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{devotional.title}</h3>
        <p className="text-sm text-gray-600 mb-2">
          <span className="font-semibold">Passage:</span> {devotional.passage}
        </p>
        <p className="text-gray-700 mb-4">
          {truncateText(devotional.shortDescription || devotional.content, 12)}
        </p>
        <Link
          to={`/devotionals/${devotional._id}`}
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors duration-300"
        >
          Read More
        </Link>
      </div>
    </motion.div>
  );
};

export default DevotionalCard;