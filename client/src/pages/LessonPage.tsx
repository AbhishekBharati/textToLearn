import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCourse } from '../context/CourseContext';
import { API_BASE_URL } from '../utils/constants';
import { motion } from 'motion/react';
import { 
  IconChevronLeft, 
  IconVideo, 
  IconHelpCircle, 
  IconCheck, 
  IconBulb 
} from '@tabler/icons-react';

interface ContentBlock {
  type: 'heading' | 'paragraph' | 'code' | 'video' | 'mcq';
  text?: string;
  language?: string;
  query?: string;
  videoId?: string;
  question?: string;
  options?: string[];
  answer?: number;
  explanation?: string;
}

interface Lesson {
  id: string;
  title: string;
  content: ContentBlock[];
}

export const LessonPage = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const { apiFetch } = useAuth();
  const { setCourseTitle } = useCourse();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [videoIds, setVideoIds] = useState<Record<number, string>>({});

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const response = await apiFetch(`${API_BASE_URL}/api/courses/lessons/${lessonId}`);
        if (response.ok) {
          const data = await response.json();
          const lessonData = data.lesson;
          setLesson(lessonData);
          
          if (data.courseTitle) {
            setCourseTitle(data.courseTitle);
          }
          
          // Fetch video IDs for video blocks
          lessonData.content.forEach(async (block: ContentBlock, idx: number) => {
            if (block.type === 'video' && block.query && !block.videoId) {
              try {
                const ytResponse = await apiFetch(`${API_BASE_URL}/api/courses/youtube/search?query=${encodeURIComponent(block.query)}`);
                if (ytResponse.ok) {
                  const ytData = await ytResponse.json();
                  setVideoIds(prev => ({ ...prev, [idx]: ytData.videoId }));
                }
              } catch (err) {
                console.error('Error fetching video ID:', err);
              }
            }
          });
        }
      } catch (error) {
        console.error('Error fetching lesson:', error);
      } finally {
        setLoading(false);
      }
    };

    if (lessonId) fetchLesson();
  }, [lessonId, setCourseTitle]);

  const handleAnswerSelect = (blockIdx: number, optionIdx: number) => {
    setSelectedAnswers(prev => ({ ...prev, [blockIdx]: optionIdx }));
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-full bg-white dark:bg-neutral-900 transition-colors">
      <div className="h-12 w-12 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin mb-4" />
      <p className="text-neutral-500 font-medium">Preparing your lesson...</p>
    </div>
  );

  if (!lesson) return (
    <div className="flex items-center justify-center h-full">
      <p className="text-neutral-500">Lesson not found.</p>
    </div>
  );

  return (
    <div className="h-full bg-white dark:bg-neutral-900 transition-colors duration-200 overflow-y-auto custom-scrollbar">
      <div className="max-w-3xl mx-auto p-6 md:p-12 pb-24">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-neutral-500 hover:text-blue-600 mb-12 transition-colors group"
        >
          <IconChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Module</span>
        </button>

        <motion.article
          id="lesson-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl md:text-5xl font-extrabold text-neutral-900 dark:text-neutral-100 mb-12 leading-tight tracking-tight">
            {lesson.title}
          </h1>

          <div className="space-y-10">
            {lesson.content.map((block, idx) => {
              switch (block.type) {
                case 'heading':
                  return (
                    <h2 key={idx} className="text-2xl font-bold text-neutral-800 dark:text-neutral-200 mt-16 first:mt-0 tracking-tight">
                      {block.text}
                    </h2>
                  );
                
                case 'paragraph':
                  return (
                    <p key={idx} className="text-lg leading-relaxed text-neutral-600 dark:text-neutral-400">
                      {block.text}
                    </p>
                  );
                
                case 'code':
                  return (
                    <div key={idx} className="relative group my-8">
                      <div className="absolute right-4 top-4 text-[10px] font-bold font-mono text-neutral-500 uppercase tracking-widest bg-neutral-800/50 px-2 py-1 rounded backdrop-blur-sm border border-white/10">
                        {block.language}
                      </div>
                      <pre className="p-8 bg-neutral-900 text-neutral-100 rounded-[2rem] overflow-x-auto font-mono text-sm shadow-2xl border border-neutral-800">
                        <code className="block leading-relaxed">{block.text}</code>
                      </pre>
                    </div>
                  );

                case 'video':
                  const currentVideoId = block.videoId || videoIds[idx];
                  return (
                    <div key={idx} className="my-12">
                      {currentVideoId ? (
                        <div className="aspect-video w-full rounded-[2.5rem] overflow-hidden shadow-2xl border border-neutral-200 dark:border-neutral-800">
                          <iframe
                            width="100%"
                            height="100%"
                            src={`https://www.youtube.com/embed/${currentVideoId}`}
                            title="YouTube video player"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                          ></iframe>
                        </div>
                      ) : (
                        <div className="group relative aspect-video bg-neutral-100 dark:bg-neutral-800/50 rounded-[2.5rem] flex flex-col items-center justify-center gap-6 border-2 border-dashed border-neutral-200 dark:border-neutral-700 hover:border-blue-500/50 transition-colors overflow-hidden shadow-inner">
                          <div className="h-20 w-20 rounded-full bg-white dark:bg-neutral-900 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform z-10 border border-neutral-100 dark:border-neutral-800 animate-pulse">
                            <IconVideo size={36} className="text-blue-600" />
                          </div>
                          <div className="text-center px-6 z-10">
                            <p className="text-neutral-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-2">Finding Video...</p>
                            <p className="text-neutral-800 dark:text-neutral-200 font-bold text-xl leading-snug max-w-sm mx-auto">
                              "{block.query}"
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  );

                case 'mcq':
                  const isAnswered = selectedAnswers[idx] !== undefined;
                  const isCorrect = selectedAnswers[idx] === block.answer;
                  
                  return (
                    <div key={idx} className="p-8 md:p-10 bg-blue-50/20 dark:bg-blue-900/5 rounded-[2.5rem] border border-blue-100/50 dark:border-blue-900/20 my-16 shadow-sm">
                      <div className="flex items-start gap-4 mb-8">
                        <div className="h-10 w-10 rounded-xl bg-blue-600 text-white flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-600/20">
                          <IconHelpCircle size={24} />
                        </div>
                        <h3 className="text-xl md:text-2xl font-bold text-neutral-800 dark:text-neutral-200 leading-tight tracking-tight">
                          {block.question}
                        </h3>
                      </div>
                      
                      <div className="grid gap-4">
                        {block.options?.map((option, oIdx) => {
                          const isSelected = selectedAnswers[idx] === oIdx;
                          const showCorrect = isAnswered && oIdx === block.answer;
                          const showWrong = isAnswered && isSelected && !isCorrect;

                          return (
                            <button 
                              key={oIdx} 
                              disabled={isAnswered}
                              onClick={() => !isAnswered && handleAnswerSelect(idx, oIdx)}
                              className={`
                                w-full text-left p-5 rounded-2xl border-2 transition-all flex items-center justify-between group relative overflow-hidden
                                ${!isAnswered ? 'bg-white dark:bg-neutral-900 border-neutral-100 dark:border-neutral-800 hover:border-blue-500 shadow-sm' : ''}
                                ${showCorrect ? 'bg-green-50/50 dark:bg-green-900/10 border-green-500 text-green-700 dark:text-green-400' : ''}
                                ${showWrong ? 'bg-red-50/50 dark:bg-red-900/10 border-red-500 text-red-700 dark:text-red-400' : ''}
                                ${isAnswered && !showCorrect && !showWrong ? 'bg-neutral-50 dark:bg-neutral-900/50 border-neutral-100 dark:border-neutral-800 opacity-40' : ''}
                              `}
                            >
                              <span className="text-lg font-medium z-10 text-neutral-900 dark:text-neutral-100">{option}</span>
                              {showCorrect && <IconCheck size={24} className="z-10" />}
                            </button>
                          );
                        })}
                      </div>

                      {isAnswered && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-8 p-6 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 flex gap-4 shadow-sm"
                        >
                          <div className={`h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 ${isCorrect ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                            <IconBulb size={20} />
                          </div>
                          <div>
                            <p className="font-bold text-neutral-800 dark:text-neutral-200 mb-1">
                              {isCorrect ? 'Correct!' : 'Answer Key'}
                            </p>
                            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed font-medium">
                              {block.explanation}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  );
                
                default:
                  return null;
              }
            })}
          </div>
        </motion.article>
      </div>
    </div>
  );
};
