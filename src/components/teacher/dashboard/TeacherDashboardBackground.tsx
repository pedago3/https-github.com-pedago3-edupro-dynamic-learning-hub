
import React from 'react';

export const TeacherDashboardBackground = () => {
  return (
    <>
      {/* Floating elements for visual appeal */}
      <div className="fixed top-20 left-10 w-32 h-32 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 rounded-full blur-xl animate-blob"></div>
      <div className="fixed bottom-20 right-10 w-40 h-40 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-xl animate-blob animation-delay-2000"></div>
      <div className="fixed top-1/2 right-20 w-24 h-24 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 rounded-full blur-xl animate-blob animation-delay-4000"></div>
    </>
  );
};
