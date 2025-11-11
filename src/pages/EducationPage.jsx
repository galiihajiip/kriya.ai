import { useState } from 'react';
import { generateCulturalNarrative, generateQuizQuestions } from '../services/geminiService';

const EducationPage = () => {
  const [selectedMotif, setSelectedMotif] = useState(null);
  const [narrative, setNarrative] = useState('');
  const [isLoadingNarrative, setIsLoadingNarrative] = useState(false);
  const [quizMode, setQuizMode] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  const motifTopics = [
    {
      id: 1,
      name: 'Tenun Ikat Sumba',
      daerah: 'Sumba, NTT',
      image: 'https://images.unsplash.com/photo-1609127102567-8a9a21dc27d8?w=500',
      difficulty: 'Menengah'
    },
    {
      id: 2,
      name: 'Batik Parang',
      daerah: 'Yogyakarta',
      image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=500',
      difficulty: 'Mudah'
    },
    {
      id: 3,
      name: 'Songket Palembang',
      daerah: 'Palembang',
      image: 'https://images.unsplash.com/photo-1610349656925-0ec921557c70?w=500',
      difficulty: 'Sulit'
    },
    {
      id: 4,
      name: 'Ulos Batak',
      daerah: 'Sumatera Utara',
      image: 'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=500',
      difficulty: 'Menengah'
    },
    {
      id: 5,
      name: 'Batik Mega Mendung',
      daerah: 'Cirebon',
      image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=500',
      difficulty: 'Mudah'
    },
    {
      id: 6,
      name: 'Tenun Toraja',
      daerah: 'Tana Toraja',
      image: 'https://images.unsplash.com/photo-1583623025817-d180a2221d0a?w=500',
      difficulty: 'Menengah'
    }
  ];

  const loadNarrative = async (motif) => {
    setSelectedMotif(motif);
    setIsLoadingNarrative(true);
    setQuizMode(false);
    setShowResults(false);

    try {
      const story = await generateCulturalNarrative(motif.name, motif.daerah);
      setNarrative(story);
    } catch (error) {
      console.error('Error loading narrative:', error);
      setNarrative('Maaf, terjadi kesalahan saat memuat narasi. Silakan coba lagi.');
    } finally {
      setIsLoadingNarrative(false);
    }
  };

  const startQuiz = async () => {
    if (!selectedMotif) return;

    setIsLoadingNarrative(true);
    try {
      const questions = await generateQuizQuestions(selectedMotif.name);
      setQuizQuestions(questions);
      setQuizMode(true);
      setCurrentQuestion(0);
      setUserAnswers([]);
      setShowResults(false);
    } catch (error) {
      console.error('Error generating quiz:', error);
      alert('Gagal membuat quiz. Silakan coba lagi.');
    } finally {
      setIsLoadingNarrative(false);
    }
  };

  const handleAnswer = (answerIndex) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setUserAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    let correctCount = 0;
    quizQuestions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correct_answer) {
        correctCount++;
      }
    });
    setScore(correctCount);
    setShowResults(true);
  };

  const resetQuiz = () => {
    setQuizMode(false);
    setShowResults(false);
    setCurrentQuestion(0);
    setUserAnswers([]);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Mudah': return 'bg-green-100 text-green-800';
      case 'Menengah': return 'bg-yellow-100 text-yellow-800';
      case 'Sulit': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF5] py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1
            className="text-4xl md:text-5xl font-bold text-[#403F2E] mb-4"
            style={{ fontFamily: 'Merriweather, serif' }}
          >
            Edukasi Motif Nusantara
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Pelajari sejarah, filosofi, dan cerita di balik motif tradisional Indonesia
            dengan narasi AI interaktif dan kuis edukatif
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar - Motif List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
              <h2 className="text-xl font-bold text-[#403F2E] mb-4">
                Pilih Topik Motif
              </h2>
              <div className="space-y-3">
                {motifTopics.map((motif) => (
                  <button
                    key={motif.id}
                    onClick={() => loadNarrative(motif)}
                    className={`w-full text-left p-3 rounded-lg transition-all ${
                      selectedMotif?.id === motif.id
                        ? 'bg-[#F8C471] text-[#403F2E] font-semibold'
                        : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={motif.image}
                        alt={motif.name}
                        className="w-12 h-12 rounded object-cover"
                      />
                      <div className="flex-1">
                        <div className="font-semibold">{motif.name}</div>
                        <div className="text-xs opacity-75">{motif.daerah}</div>
                      </div>
                    </div>
                    <div className="mt-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(motif.difficulty)}`}>
                        {motif.difficulty}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            {!selectedMotif ? (
              <div className="bg-white rounded-lg shadow-lg p-12 text-center">
                <svg
                  className="mx-auto h-24 w-24 text-gray-400 mb-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
                <h3 className="text-2xl font-bold text-gray-700 mb-3">
                  Mulai Belajar
                </h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  Pilih salah satu topik motif di sebelah kiri untuk memulai perjalanan
                  edukatif Anda tentang warisan budaya Nusantara
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                {/* Motif Header */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={selectedMotif.image}
                    alt={selectedMotif.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h2 className="text-3xl font-bold mb-2">{selectedMotif.name}</h2>
                    <p className="text-lg opacity-90">{selectedMotif.daerah}</p>
                  </div>
                </div>

                <div className="p-8">
                  {/* Navigation Tabs */}
                  <div className="flex gap-4 mb-6 border-b border-gray-200">
                    <button
                      onClick={() => setQuizMode(false)}
                      className={`pb-3 px-4 font-semibold transition-colors ${
                        !quizMode
                          ? 'border-b-2 border-[#F8C471] text-[#403F2E]'
                          : 'text-gray-500 hover:text-[#403F2E]'
                      }`}
                    >
                      📖 Narasi Budaya
                    </button>
                    <button
                      onClick={startQuiz}
                      disabled={isLoadingNarrative}
                      className={`pb-3 px-4 font-semibold transition-colors ${
                        quizMode
                          ? 'border-b-2 border-[#F8C471] text-[#403F2E]'
                          : 'text-gray-500 hover:text-[#403F2E]'
                      }`}
                    >
                      🎯 Quiz Interaktif
                    </button>
                  </div>

                  {/* Content Area */}
                  {!quizMode ? (
                    <div>
                      {isLoadingNarrative ? (
                        <div className="text-center py-12">
                          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#403F2E] mx-auto mb-4"></div>
                          <p className="text-gray-600">AI sedang menyusun narasi budaya...</p>
                        </div>
                      ) : (
                        <div className="prose max-w-none">
                          <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                            {narrative}
                          </div>
                        </div>
                      )}

                      <div className="mt-8 p-4 bg-[#FDFBF5] rounded-lg border border-gray-200">
                        <h4 className="font-bold text-[#403F2E] mb-2 flex items-center">
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                          </svg>
                          Tahukah Anda?
                        </h4>
                        <p className="text-sm text-gray-700">
                          Narasi ini dibuat oleh Gemini AI berdasarkan data budaya Indonesia.
                          Siap menguji pengetahuan Anda? Coba Quiz Interaktif!
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div>
                      {isLoadingNarrative ? (
                        <div className="text-center py-12">
                          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#403F2E] mx-auto mb-4"></div>
                          <p className="text-gray-600">Mempersiapkan quiz...</p>
                        </div>
                      ) : showResults ? (
                        <div className="text-center py-8">
                          <div className="mb-6">
                            {score / quizQuestions.length >= 0.8 ? (
                              <div className="text-6xl mb-4">🎉</div>
                            ) : score / quizQuestions.length >= 0.6 ? (
                              <div className="text-6xl mb-4">👏</div>
                            ) : (
                              <div className="text-6xl mb-4">💪</div>
                            )}
                          </div>
                          <h3 className="text-3xl font-bold text-[#403F2E] mb-4">
                            Skor Anda: {score} / {quizQuestions.length}
                          </h3>
                          <p className="text-lg text-gray-600 mb-8">
                            {score / quizQuestions.length >= 0.8
                              ? 'Luar biasa! Anda ahli budaya Nusantara! 🌟'
                              : score / quizQuestions.length >= 0.6
                              ? 'Bagus! Terus belajar untuk meningkatkan pengetahuan Anda.'
                              : 'Jangan menyerah! Baca narasi budaya dan coba lagi.'}
                          </p>

                          {/* Review Answers */}
                          <div className="text-left space-y-4 mb-8">
                            {quizQuestions.map((q, idx) => (
                              <div
                                key={idx}
                                className={`p-4 rounded-lg border ${
                                  userAnswers[idx] === q.correct_answer
                                    ? 'bg-green-50 border-green-200'
                                    : 'bg-red-50 border-red-200'
                                }`}
                              >
                                <p className="font-semibold mb-2">
                                  {idx + 1}. {q.question}
                                </p>
                                <p className="text-sm text-gray-700 mb-1">
                                  <strong>Jawaban Anda:</strong> {q.options[userAnswers[idx]]}
                                </p>
                                {userAnswers[idx] !== q.correct_answer && (
                                  <p className="text-sm text-green-700 mb-1">
                                    <strong>Jawaban Benar:</strong> {q.options[q.correct_answer]}
                                  </p>
                                )}
                                <p className="text-sm text-gray-600 mt-2">
                                  💡 {q.explanation}
                                </p>
                              </div>
                            ))}
                          </div>

                          <div className="flex gap-4 justify-center">
                            <button
                              onClick={resetQuiz}
                              className="px-6 py-3 bg-[#403F2E] text-white rounded-lg font-semibold hover:bg-[#5a5847] transition-colors"
                            >
                              Kembali ke Narasi
                            </button>
                            <button
                              onClick={startQuiz}
                              className="px-6 py-3 bg-[#F8C471] text-[#403F2E] rounded-lg font-semibold hover:bg-[#f0b854] transition-colors"
                            >
                              Coba Quiz Lagi
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          {/* Progress Bar */}
                          <div className="mb-6">
                            <div className="flex justify-between text-sm text-gray-600 mb-2">
                              <span>Pertanyaan {currentQuestion + 1} dari {quizQuestions.length}</span>
                              <span>{Math.round(((currentQuestion + 1) / quizQuestions.length) * 100)}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-[#F8C471] h-2 rounded-full transition-all"
                                style={{ width: `${((currentQuestion + 1) / quizQuestions.length) * 100}%` }}
                              ></div>
                            </div>
                          </div>

                          {/* Question */}
                          {quizQuestions[currentQuestion] && (
                            <div>
                              <h3 className="text-xl font-bold text-[#403F2E] mb-6">
                                {quizQuestions[currentQuestion].question}
                              </h3>

                              {/* Options */}
                              <div className="space-y-3 mb-8">
                                {quizQuestions[currentQuestion].options.map((option, idx) => (
                                  <button
                                    key={idx}
                                    onClick={() => handleAnswer(idx)}
                                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                                      userAnswers[currentQuestion] === idx
                                        ? 'border-[#F8C471] bg-[#FFF9E6]'
                                        : 'border-gray-200 hover:border-gray-300 bg-white'
                                    }`}
                                  >
                                    <div className="flex items-center">
                                      <div
                                        className={`w-6 h-6 rounded-full border-2 mr-3 flex items-center justify-center ${
                                          userAnswers[currentQuestion] === idx
                                            ? 'border-[#F8C471] bg-[#F8C471]'
                                            : 'border-gray-300'
                                        }`}
                                      >
                                        {userAnswers[currentQuestion] === idx && (
                                          <svg className="w-4 h-4 text-[#403F2E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/>
                                          </svg>
                                        )}
                                      </div>
                                      <span>{option}</span>
                                    </div>
                                  </button>
                                ))}
                              </div>

                              {/* Next Button */}
                              <button
                                onClick={nextQuestion}
                                disabled={userAnswers[currentQuestion] === undefined}
                                className="w-full px-6 py-3 bg-[#403F2E] text-white rounded-lg font-semibold hover:bg-[#5a5847] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                              >
                                {currentQuestion < quizQuestions.length - 1 ? 'Lanjut' : 'Selesai'}
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EducationPage;
