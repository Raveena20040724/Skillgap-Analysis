const Card = ({ children, className = '' }) => {
  return (
    <div className={`bg-white dark:bg-gray-800 dark:text-gray-100 rounded-lg shadow-md p-6 ${className}`}>
      {children}
    </div>
  );
};

export default Card;