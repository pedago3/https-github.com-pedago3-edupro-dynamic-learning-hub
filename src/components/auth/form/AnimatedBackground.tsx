
export const AnimatedBackground = () => {
  return (
    <>
      {/* Background animated blobs with lighter colors */}
      <div className="absolute -top-20 -left-20 w-40 h-40 bg-gradient-to-r from-blue-200 to-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob"></div>
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-r from-purple-200 to-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob animation-delay-2000"></div>
      <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-yellow-200 to-orange-300 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob animation-delay-4000"></div>
    </>
  );
};
