const LessonProgress = ({ completedLessons, totalLessons }) => {
  const progressPercentage = Math.round(
    (completedLessons / totalLessons) * 100
  );

  return (
    <div className="w-[200px] bg-gray-200 rounded-full h-4 relative">
      {' '}
      <div
        className="bg-yellow-600 h-4 rounded-full"
        style={{ width: `${progressPercentage}%` }}
      ></div>
      <span
        className={`absolute inset-0 flex items-center justify-center text-xs font-medium ${
          progressPercentage > 0 ? 'text-white' : 'text-black'
        }`}
      >
        {completedLessons}/{totalLessons} bài học ({progressPercentage}%)
      </span>
    </div>
  );
};

export default LessonProgress;
