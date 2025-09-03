import { useState, useEffect } from 'react';
import { ArrowLeft, SkipForward, SkipBack, Book, Star, Award, Download, Menu, X, Users, Clock, Trophy, Heart, Play } from 'lucide-react';

export default function KidsCourseContent() {
  const [currentView, setCurrentView] = useState('course');
  const [selectedVideo, setSelectedVideo] = useState({ objId: 0, videoId: 0 });

  const [showContent, setShowContent] = useState(true);
  const [currentTab, setCurrentTab] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [player, setPlayer] = useState(1);
  const [progress, setProgress] = useState(65);

  // Mock data - similar structure to your original
  const courseData = {
    courseName: "Fun English Adventures",
    units: [
      {
        id: 1,
        title: "🌟 Hello World",
        videos: [
          { id: 1, name: "Say Hello!", link_video: "dQw4w9WgXcQ", duration: "5:30" },
          { id: 2, name: "My Name is...", link_video: "dQw4w9WgXcQ", duration: "4:20" },
          { id: 3, name: "Nice to Meet You", link_video: "dQw4w9WgXcQ", duration: "6:10" }
        ]
      },
      {
        id: 2,
        title: "🎨 Colors & Numbers",
        videos: [
          { id: 4, name: "Rainbow Colors", link_video: "dQw4w9WgXcQ", duration: "7:15" },
          { id: 5, name: "Count to Ten", link_video: "dQw4w9WgXcQ", duration: "5:45" },
          { id: 6, name: "Color Games", link_video: "dQw4w9WgXcQ", duration: "8:20" }
        ]
      },
      {
        id: 3,
        title: "🐾 Animals & Friends",
        videos: [
          { id: 7, name: "Farm Animals", link_video: "dQw4w9WgXcQ", duration: "6:30" },
          { id: 8, name: "Pet Friends", link_video: "dQw4w9WgXcQ", duration: "5:50" },
          { id: 9, name: "Zoo Adventure", link_video: "dQw4w9WgXcQ", duration: "9:10" }
        ]
      }
    ]
  };

  const currentVideo = courseData.units[currentTab]?.videos[currentIndex];

  const handleBackToGrades = () => {
    setCurrentView('grades');
  };

  const handleNextVideo = () => {
    if (currentIndex < courseData.units[currentTab]?.videos?.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else if (currentTab < courseData.units.length - 1) {
      setCurrentTab(prev => prev + 1);
      setCurrentIndex(0);
    }
  };

  const handlePrevVideo = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    } else if (currentTab > 0) {
      setCurrentTab(prev => prev - 1);
      setCurrentIndex(courseData.units[currentTab - 1]?.videos?.length - 1 || 0);
    }
  };

  const handleSelectVideo = (unitIndex, videoIndex) => {
    setCurrentTab(unitIndex);
    setCurrentIndex(videoIndex);
  };

  if (currentView === 'grades') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-400 via-blue-400 to-blue-400">
        <div className="text-center py-20">
          <h1 className="text-6xl font-bold text-white mb-8">Back to Grade Levels!</h1>
          <button 
            onClick={() => setCurrentView('course')}
            className="bg-yellow-400 hover:bg-yellow-300 text-blue-800 font-bold py-4 px-8 rounded-full text-xl transform hover:scale-105 transition-all duration-300"
          >
            Return to Course
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 via-blue-200 to-pink-200">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-lg shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={handleBackToGrades}
              className="flex items-center text-blue-700 hover:text-pink-600 transition-colors duration-300 bg-white/50 rounded-full px-4 py-2 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <ArrowLeft className="mr-2 text-xl" />
              <span className="font-bold text-lg">Back to Grade Levels</span>
            </button>

            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full px-6 py-2 shadow-lg">
                <div className="flex items-center text-white font-bold">
                  <Trophy className="mr-2" />
                  Progress: {progress}%
                </div>
              </div>
              
              <button
                onClick={() => setShowContent(!showContent)}
                className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                {showContent ? <X /> : <Menu />}
              </button>
            </div>
          </div>

          {/* Course Title */}
          <div className="text-center mt-4">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-pink-600 bg-clip-text text-transparent">
              {courseData.courseName}
            </h1>
            <p className="text-gray-600 mt-2 text-lg">Learn English the Fun Way! 📋</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Video Player Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
              
              {/* Video Header */}
              <div className="bg-gradient-to-r from-blue-500 to-pink-500 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-white">
                    <Play className="mr-3 text-2xl" />
                    <div>
                      <h2 className="text-2xl font-bold">{currentVideo?.name}</h2>
                      <p className="opacity-80">Duration: {currentVideo?.duration}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition-all duration-300">
                      <Heart className="text-white" />
                    </button>
                    <button className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition-all duration-300">
                      <Download className="text-white" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Video Player */}
              <div className="relative bg-black aspect-video">
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${currentVideo?.link_video}?autoplay=0&controls=1&rel=0`}
                  title="Video Player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
                
                {/* Cute overlay elements */}
                <div className="absolute top-4 right-4 bg-yellow-400 text-blue-800 px-3 py-1 rounded-full font-bold text-sm animate-bounce">
                  🌟 You're doing great!
                </div>
              </div>

              {/* Navigation Controls */}
              <div className="bg-gradient-to-r from-blue-50 to-blue-50 px-6 py-4">
                <div className="flex items-center justify-between">
                  <button
                    onClick={handlePrevVideo}
                    className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 flex items-center"
                  >
                    <SkipBack className="mr-2" />
                    <span className="font-bold">Previous</span>
                  </button>
                  
                  <div className="text-center">
                    <div className="bg-white rounded-full px-6 py-3 shadow-lg">
                      <div className="flex items-center text-blue-700">
                        <Users className="mr-2" />
                        <span className="font-bold">234 friends watching</span>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleNextVideo}
                    className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 flex items-center"
                  >
                    <span className="font-bold">Next</span>
                    <SkipForward className="ml-2" />
                  </button>
                </div>

                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="bg-white rounded-full h-3 shadow-inner">
                    <div 
                      className="bg-gradient-to-r from-yellow-400 to-orange-400 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <p className="text-center text-blue-600 font-bold mt-2">
                    Keep going! You're {progress}% complete! 🎉
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Course Content Sidebar */}
          {showContent && (
            <div className="lg:col-span-1">
              <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                
                {/* Sidebar Header */}
                <div className="bg-gradient-to-r from-green-400 to-blue-400 px-6 py-4">
                  <div className="flex items-center text-white">
                    <Book className="mr-3 text-2xl" />
                    <div>
                      <h3 className="text-xl font-bold">Course Lessons</h3>
                      <p className="opacity-80">Choose your adventure!</p>
                    </div>
                  </div>
                </div>

                {/* Lessons List */}
                <div className="max-h-96 overflow-y-auto">
                  {courseData.units.map((unit, unitIndex) => (
                    <div key={unit.id} className="border-b border-gray-100">
                      
                      {/* Unit Header */}
                      <div className="bg-gradient-to-r from-blue-100 to-pink-100 px-6 py-4">
                        <h4 className="font-bold text-blue-800 text-lg flex items-center">
                          <span className="mr-2">{unit.title}</span>
                          {unitIndex === currentTab && (
                            <span className="bg-yellow-400 text-blue-800 px-2 py-1 rounded-full text-xs animate-pulse">
                              Current
                            </span>
                          )}
                        </h4>
                      </div>

                      {/* Videos List */}
                      <div className="px-4 py-2">
                        {unit.videos.map((video, videoIndex) => (
                          <button
                            key={video.id}
                            onClick={() => handleSelectVideo(unitIndex, videoIndex)}
                            className={`w-full text-left p-4 rounded-2xl mb-2 transition-all duration-300 transform hover:scale-105 ${
                              unitIndex === currentTab && videoIndex === currentIndex
                                ? 'bg-gradient-to-r from-blue-500 to-pink-500 text-white shadow-lg'
                                : 'bg-gray-50 hover:bg-blue-50 text-gray-700'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                                  unitIndex === currentTab && videoIndex === currentIndex
                                    ? 'bg-white text-blue-500'
                                    : 'bg-blue-200 text-blue-600'
                                }`}>
                                  {videoIndex + 1}
                                </div>
                                <div>
                                  <p className="font-semibold">{video.name}</p>
                                  <p className={`text-sm ${
                                    unitIndex === currentTab && videoIndex === currentIndex
                                      ? 'text-white/80'
                                      : 'text-gray-500'
                                  }`}>
                                    {video.duration}
                                  </p>
                                </div>
                              </div>
                              
                              {unitIndex === currentTab && videoIndex === currentIndex && (
                                <div className="flex items-center">
                                  <Star className="text-yellow-300 fill-current" />
                                </div>
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Achievement Section */}
                <div className="bg-gradient-to-r from-yellow-100 to-orange-100 px-6 py-4">
                  <div className="text-center">
                    <Award className="mx-auto text-4xl text-yellow-600 mb-2" />
                    <h4 className="font-bold text-orange-800">Great Job!</h4>
                    <p className="text-orange-600 text-sm">You've completed {Math.floor(progress/10)} lessons!</p>
                    
                    <div className="flex justify-center mt-3 space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`text-lg ${i < Math.floor(progress/20) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Fun Footer */}
        <div className="mt-8 text-center">
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-6 shadow-lg">
            <h3 className="text-2xl font-bold text-blue-800 mb-4">🎉 Keep Learning, Keep Growing! 🌱</h3>
            <div className="flex justify-center space-x-8">
              <div className="text-center">
                <div className="bg-blue-100 rounded-full p-4 mb-2">
                  <Clock className="text-blue-600 text-2xl mx-auto" />
                </div>
                <p className="text-blue-800 font-semibold">Daily Practice</p>
              </div>
              <div className="text-center">
                <div className="bg-green-100 rounded-full p-4 mb-2">
                  <Trophy className="text-green-600 text-2xl mx-auto" />
                </div>
                <p className="text-green-800 font-semibold">Earn Rewards</p>
              </div>
              <div className="text-center">
                <div className="bg-pink-100 rounded-full p-4 mb-2">
                  <Heart className="text-pink-600 text-2xl mx-auto" />
                </div>
                <p className="text-pink-800 font-semibold">Have Fun!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}