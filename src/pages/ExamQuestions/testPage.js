export const testQuestions = [
  {
    question_id: "135",
    question_text: "One of the following doesn’t refer to left Lung : ",
    question_image: "",
    question_answers:
      "A. Has 2 lobes because is this true\n//CAMP//B. Has oblique fissurebecause is this\n//CAMP//C. Has transverse fissurebecause is this false",
    question_valid_answer: "B. Has oblique fissure",
    course_id: "14",
    unit_id: "142",
    video_id: null,
    real_answers: [
      {
        answer_text: "A. Has 2 lobes",
        answer_exp: "because is this true\n",
        answer_check: false,
      },
      {
        answer_text: "B. Has oblique fissure",
        answer_exp: "because is this\n",
        answer_check: true,
      },
      {
        answer_text: "C. Has transverse fissure",
        answer_exp: "because is this false",
        answer_check: false,
      },
    ],
  },
  // line match question
  {
    question_id: "12343",
    course_id: "14",
    unit_id: "142",
    video_id: null,

    // line match data
    type: "line-match",
    leftColumn: [
      { id: "l1", text: "Python", type: "language", icon: "🐍" },
      { id: "l2", text: "Apple", type: "company", icon: "🍎" },
      { id: "l3", text: "Photosynthesis", type: "process", icon: "🌱" },
      { id: "l4", text: "Jupiter", type: "planet", icon: "🪐" },
      { id: "l5", text: "Shakespeare", type: "author", icon: "📚" },
    ],
    rightColumn: [
      { id: "r1", text: "Programming Language", type: "language", icon: "💻" },
      { id: "r2", text: "Largest Planet", type: "planet", icon: "🌌" },
      { id: "r3", text: "Tech Company", type: "company", icon: "🏢" },
      { id: "r4", text: "Plant Process", type: "process", icon: "☀️" },
      { id: "r5", text: "Famous Playwright", type: "author", icon: "🎭" },
    ],
  },
  {
    question_id: "1412",
    course_id: "14",
    unit_id: "142",
    video_id: null,

    // line rearrangePuzzle
    type: "arrangePuzzle",
    gameType: "word", // word or character
    correctSentence: "Birds fly in the blue sky", // if it is Birds
    words: ["Birds", "fly", "in", "the", "blue", "sky"], // ["B" , "i" , "r", "d", "s"]
    scrambledWords: ["blue", "sky", "fly", "in", "Birds", "the"],// ["i" , "r" , "d", "B", "s"]
    translation: "Birds fly in the blue sky", // Birds
  },
  {
    question_id: "136",
    question_text: " Palatine tonsils are situated:",
    question_image: "",
    question_answers:
      "A) In the nasopharynx.//CAMP//B) Roof of the month.//CAMP//C) Anterior to the palatopharyngeal arch.//CAMP//D) Between Palatopharyngeal and Palatoglossal arches.",
    question_valid_answer:
      "D) Between Palatopharyngeal and Palatoglossal arches.",
    course_id: "14",
    unit_id: "142",
    video_id: null,
    real_answers: [
      {
        answer_text: "A) In the nasopharynx.",
        answer_exp: "",
        answer_check: false,
      },
      {
        answer_text: "B) Roof of the month.",
        answer_exp: "",
        answer_check: false,
      },
      {
        answer_text: "C) Anterior to the palatopharyngeal arch.",
        answer_exp: "",
        answer_check: false,
      },
      {
        answer_text: "D) Between Palatopharyngeal and Palatoglossal arches.",
        answer_exp: "",
        answer_check: true,
      },
    ],
  },
  {
    question_id: "136",
    question_text: " Palatine tonsils are situated:",
    question_image: "",
    question_answers:
      "A) In the nasopharynx.//CAMP//B) Roof of the month.//CAMP//C) Anterior to the palatopharyngeal arch.//CAMP//D) Between Palatopharyngeal and Palatoglossal arches.",
    question_valid_answer:
      "D) Between Palatopharyngeal and Palatoglossal arches.",
    course_id: "14",
    unit_id: "142",
    video_id: null,
    real_answers: [
      {
        answer_text: "A) In the nasopharynx.",
        answer_exp: "",
        answer_check: false,
      },
      {
        answer_text: "B) Roof of the month.",
        answer_exp: "",
        answer_check: false,
      },
      {
        answer_text: "C) Anterior to the palatopharyngeal arch.",
        answer_exp: "",
        answer_check: false,
      },
      {
        answer_text: "D) Between Palatopharyngeal and Palatoglossal arches.",
        answer_exp: "",
        answer_check: true,
      },
    ],
  },
  {
    question_id: "135",
    question_text: "One of the following doesn’t refer to left Lung : ",
    question_image: "",
    question_answers:
      "A. Has 2 lobesbecause is this true\n//CAMP//B. Has oblique fissurebecause is this\n//CAMP//C. Has transverse fissurebecause is this false",
    question_valid_answer: "B. Has oblique fissure",
    course_id: "14",
    unit_id: "142",
    video_id: null,
    real_answers: [
      {
        answer_text: "A. Has 2 lobes",
        answer_exp: "because is this true\n",
        answer_check: false,
      },
      {
        answer_text: "B. Has oblique fissure",
        answer_exp: "because is this\n",
        answer_check: true,
      },
      {
        answer_text: "C. Has transverse fissure",
        answer_exp: "because is this false",
        answer_check: false,
      },
    ],
  },
  {
    question_id: "135",
    question_text: "One of the following doesn’t refer to left Lung : ",
    question_image: "",
    question_answers:
      "A. Has 2 lobesbecause is this true\n//CAMP//B. Has oblique fissurebecause is this\n//CAMP//C. Has transverse fissurebecause is this false",
    question_valid_answer: "B. Has oblique fissure",
    course_id: "14",
    unit_id: "142",
    video_id: null,
    real_answers: [
      {
        answer_text: "A. Has 2 lobes",
        answer_exp: "because is this true\n",
        answer_check: false,
      },
      {
        answer_text: "B. Has oblique fissure",
        answer_exp: "because is this\n",
        answer_check: true,
      },
      {
        answer_text: "C. Has transverse fissure",
        answer_exp: "because is this false",
        answer_check: false,
      },
    ],
  },
];

export const testExams = [
  {
    show_exam_id: "1",
    exam_id: "1",
    course_id: "1",
    start_date: "0000-00-00",
    end_date: "2024-09-23",
    show_value: "1",
    exam_name: "Example On Exams",
    exam_description: "Exam Mock",
    exam_time: "1",
  },
];
