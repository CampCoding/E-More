import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

const EMOJIS = ['🌟', '🎈', '🎉', '🎊', '🦄', '📋', '🍭', '🎪'];
const MESSAGES = ['رائع!', 'ممتاز!', 'عمل رائع!', 'أحسنت!', 'مذهل!'];
const TRY_AGAIN_MESSAGES = [
  "يمكنك فعلها!",
  "اقتربت!",
  "استمر بالمحاولة!",
  "لا تستسلم!",
  "حاول مرة أخرى!"
];

const FloatingEmoji = ({ emoji, index }) => (
  <motion.div
    initial={{ 
      scale: 0,
      y: 0,
      x: 0,
      opacity: 0,
      rotate: 0
    }}
    animate={{ 
      scale: [0, 1.2, 1],
      y: [-50, -150 - (index * 20)],
      x: [0, (index % 2 ? 50 : -50)],
      opacity: [0, 1, 0],
      rotate: [0, (index % 2 ? 360 : -360)]
    }}
    transition={{ 
      duration: 2,
      delay: index * 0.2,
      ease: "easeOut"
    }}
    className="absolute text-6xl"
  >
    {emoji}
  </motion.div>
);

const BouncingCharacter = ({ text, delay }) => (
  <motion.span
    initial={{ y: 0 }}
    animate={{ y: [-20, 0] }}
    transition={{
      duration: 0.5,
      delay,
      repeat: 2,
      ease: "easeOut"
    }}
    className="inline-block"
    style={{ textShadow: '3px 3px 0 rgba(0,0,0,0.1)' }}
  >
    {text}
  </motion.span>
);

const WrongAnswerAnimation = () => {
  const randomMessage = TRY_AGAIN_MESSAGES[Math.floor(Math.random() * TRY_AGAIN_MESSAGES.length)];
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center z-[999999] pointer-events-none"
      style={{ direction: 'rtl', fontFamily: "'Cairo', 'Tajawal', 'Amiri', sans-serif" }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-blue-400/20 to-red-400/20 backdrop-blur-sm" />
      
      <div className="relative flex flex-col items-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ 
            scale: [0, 1.2, 1],
            y: [0, -20, 0]
          }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="bg-gradient-to-r from-blue-400 via-blue-400 to-red-400 rounded-full p-24 shadow-[0_0_50px_20px_rgba(147,197,253,0.3)]"
        >
          <motion.div
            animate={{ 
              rotate: [0, -10, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 1.5,
              repeat: Infinity,
              repeatType: "reverse"
            }}
            className="text-8xl relative"
          >
            🤔
            <motion.div
              animate={{ 
                opacity: [0, 1, 0],
                y: [-20, -40],
                x: [0, 20]
              }}
              transition={{ 
                duration: 1,
                repeat: Infinity,
                repeatType: "loop"
              }}
              className="absolute -top-10 -right-10 text-4xl"
            >
              ✨
            </motion.div>
          </motion.div>
        </motion.div>

        {['💪', '💭', '💡', '✨'].map((emoji, i) => (
          <motion.div
            key={i}
            initial={{ 
              scale: 0,
              y: 0,
              opacity: 0
            }}
            animate={{ 
              scale: [0, 1.2, 1],
              y: [-30, -80],
              opacity: [0, 1, 0],
              x: [0, (i % 2 ? 60 : -60)]
            }}
            transition={{ 
              duration: 1.5,
              delay: i * 0.2,
              repeat: Infinity,
              repeatDelay: 1
            }}
            className="absolute text-4xl"
          >
            {emoji}
          </motion.div>
        ))}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="absolute -bottom-28 text-center"
        >
          <motion.div
            className="text-5xl font-bold mb-4 text-blue-600"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ 
              repeat: Infinity,
              duration: 1
            }}
          >
            {randomMessage}
          </motion.div>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.1, 1] }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="text-3xl text-blue-500"
          >
            لنحاول بطريقة أخرى! 🌟
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

const SuccessAnimation = () => {
  const randomMessage = MESSAGES[Math.floor(Math.random() * MESSAGES.length)];
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center z-[999999] pointer-events-none"
      style={{ direction: 'rtl', fontFamily: "'Cairo', 'Tajawal', 'Amiri', sans-serif" }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-blue-400/30 via-red-400/30 to-yellow-400/30 backdrop-blur-sm" />
      
      <div className="relative flex flex-col items-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ 
            scale: [0, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="bg-gradient-to-r from-yellow-400 via-red-400 to-blue-500 rounded-full p-32 shadow-[0_0_100px_30px_rgba(255,182,193,0.5)]"
        >
          <motion.div
            animate={{ 
              rotate: 360,
              scale: [1, 1.3, 1]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse"
            }}
            className="text-9xl relative"
          >
            🏆
          </motion.div>
        </motion.div>

        {EMOJIS.map((emoji, i) => (
          <motion.div
            key={i}
            initial={{ 
              scale: 0,
              y: 0,
              opacity: 0
            }}
            animate={{ 
              scale: [0, 1.2, 1],
              y: [-50, -150],
              opacity: [0, 1, 0],
              x: [0, (i % 2 ? 100 : -100)]
            }}
            transition={{ 
              duration: 2,
              delay: i * 0.2
            }}
            className="absolute text-6xl"
          >
            {emoji}
          </motion.div>
        ))}

        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="absolute -bottom-32 text-center"
        >
          <motion.div
            className="text-6xl font-bold mb-4 text-blue-600"
            animate={{ y: [-20, 0] }}
            transition={{ 
              repeat: 3,
              duration: 0.3
            }}
          >
            {randomMessage}
          </motion.div>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.2, 1] }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="text-4xl"
          >
            🎯 استمر! 🎯
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

const QuizModal = ({ 
  isOpen, 
  onClose, 
  question, 
  selectedAnswer, 
  setSelectedAnswer, 
  onSubmit,
  isFullscreen = false,
  showSuccess = false,
  showWrong = false
}) => {
  if (!isOpen || !question) return null;

  return (
    <div>
      {showSuccess && <SuccessAnimation />}
      {showWrong && <WrongAnswerAnimation />}
      
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className={`$${
            isFullscreen ? 'absolute' : 'fixed'
          } inset-0 z-[99999] flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-md pointer-events-auto`}
          style={{ position: isFullscreen ? 'absolute' : 'fixed', direction: 'rtl', fontFamily: "'Cairo', 'Tajawal', 'Amiri', sans-serif" }}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="w-full max-w-3xl mx-2 sm:mx-4 bg-gradient-to-b from-white to-gray-50 shadow-2xl rounded-2xl sm:rounded-3xl pointer-events-auto"
            onClick={(e) => e.stopPropagation()}
            style={{ padding: '32px 24px', textAlign: 'right' }}
          >
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200" style={{ flexDirection: 'row', paddingBottom: 24 }}>
              <div className="flex items-center space-x-3" style={{ flexDirection: 'row-reverse', gap: 16 }}>
                
                <div className="flex flex-col">
                                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 text-right">
                    سؤال سريع
                  </h2>
                  <p className="text-sm sm:text-base text-gray-600 text-right">
                    أجب على السؤال لتحصل على النقاط!
                  </p>
                </div>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="p-2 bg-blue-100 rounded-lg flex items-center flex-row-reverse"
                  dir="ltr"
                >
                  <i className="fas fa-question-circle text-blue-600 text-lg sm:text-xl" />
                </motion.div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="p-2 text-gray-400 rounded-full hover:text-gray-600 hover:bg-gray-100"
                aria-label="إغلاق"
                style={{ marginLeft: 8 }}
              >
                <i className="text-lg fas fa-times" />
              </motion.button>
            </div>

            <div className="p-4 sm:p-8" style={{ padding: '32px 0 0 0' }}>
              <div className="mb-6 sm:mb-8" dir="ltr">
                <h3 className= "mb-4 sm:mb-6 text-lg sm:text-xl font-semibold text-gray-800 leading-relaxed text-left">
                  {question.question}
                </h3>

                <div className="space-y-3 sm:space-y-4 mr-[auto]" dir="ltr">
                  {question.options.map((option) => (
                    <motion.label
                      key={option}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={selectedAnswer === option 
                        ? "flex items-center p-3 sm:p-4 border-2 border-gray-200 rounded-xl cursor-pointer bg-blue-100 group"
                        : "flex items-center p-3 sm:p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:bg-blue-50 hover:border-blue-300 group"}
                      style={{ flexDirection: 'row', gap: 12 }}
                    >
                      <input
                        type="radio"
                        name="answer"
                        value={option}
                        checked={selectedAnswer === option}
                        onChange={(e) => setSelectedAnswer(e.target.value)}
                        className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 border-gray-300 focus:ring-blue-500 focus:ring-2"
                        style={{ marginLeft: 12 }}
                      />
                      <span className="mr-3 sm:mr-4 text-base sm:text-lg font-medium text-gray-700 group-hover:text-blue-600">
                        {option}
                      </span>
                    </motion.label>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-3 sm:space-x-4" style={{ flexDirection: 'row-reverse', gap: 16 }}>
              <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={()=>onSubmit(question)}
                  className="px-6 sm:px-8 py-2 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium shadow-lg hover:shadow-xl text-sm sm:text-base"
                >
                  إرسال الإجابة
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="px-6 sm:px-8 py-2 sm:py-3 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium text-sm sm:text-base"
                  style={{ marginLeft: 8 }}
                >
                  إلغاء
                </motion.button>
               
              </div>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        .shake-animation {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default QuizModal; 