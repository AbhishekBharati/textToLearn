import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCourse } from '../context/CourseContext';
import { API_BASE_URL } from '../utils/constants';
import { motion } from 'motion/react';
import { IconChevronLeft, IconBook, IconCircleCheck } from '@tabler/icons-react';

interface Lesson {
  id: string;
  title: string;
  isEnriched: boolean;
}

export const ModulePage = () => {
  const { moduleId } = useParams();
  const { apiFetch } = useAuth();
  const { setCourseTitle } = useCourse();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [moduleTitle, setModuleTitle] = useState("");
  const [courseId, setCourseId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const response = await apiFetch(`${API_BASE_URL}/api/courses/modules/${moduleId}/lessons`);
        if (response.ok) {
          const data = await response.json();
          setLessons(data.lessons);
          setModuleTitle(data.moduleTitle);
          setCourseId(data.courseId);
          if (data.courseTitle) {
            setCourseTitle(data.courseTitle);
          }
        }
      } catch (error) {
        console.error('Error fetching lessons:', error);
      } finally {
        setLoading(false);
      }
    };

    if (moduleId) fetchLessons();
  }, [moduleId, setCourseTitle]);

  return (
    <div className="h-full bg-white dark:bg-neutral-900 transition-colors duration-200 overflow-y-auto custom-scrollbar">
      <div className="max-w-4xl mx-auto p-6 md:p-12">
        <Link 
          to={courseId ? `/courses/${courseId}` : "/"}
          className="flex items-center gap-2 text-neutral-500 hover:text-blue-600 mb-10 transition-colors group"
        >
          <IconChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Course</span>
        </Link>

        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 dark:text-neutral-100 mb-4 tracking-tight">
            {moduleTitle || "Module Content"}
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 text-lg">
            Complete the lessons below to master this section.
          </p>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="h-10 w-10 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
            <p className="text-neutral-500 font-medium">Loading lessons...</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {lessons.length > 0 ? lessons.map((lesson, idx) => (
              <motion.div
                key={lesson.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Link
                  to={`/lessons/${lesson.id}`}
                  className="flex items-center justify-between p-6 bg-neutral-50 dark:bg-neutral-800/50 rounded-3xl border border-neutral-200 dark:border-neutral-700/50 hover:border-blue-500/50 hover:bg-white dark:hover:bg-neutral-800 transition-all group shadow-sm"
                >
                  <div className="flex items-center gap-5">
                    <div className="h-12 w-12 rounded-2xl bg-white dark:bg-neutral-900 flex items-center justify-center shadow-sm border border-neutral-100 dark:border-neutral-800 group-hover:scale-110 transition-transform">
                      <IconBook size={22} className="text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-neutral-800 dark:text-neutral-200 group-hover:text-blue-600 transition-colors">
                        {lesson.title}
                      </h3>
                      <p className="text-sm text-neutral-500 dark:text-neutral-500 font-medium">
                        Lesson {idx + 1}
                      </p>
                    </div>
                  </div>
                  {lesson.isEnriched && (
                    <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-xs font-bold uppercase tracking-wider">
                      <IconCircleCheck size={14} />
                      AI Enriched
                    </div>
                  )}
                </Link>
              </motion.div>
            )) : (
              <div className="text-center py-20 bg-neutral-50 dark:bg-neutral-800/30 rounded-3xl border-2 border-dashed border-neutral-200 dark:border-neutral-800">
                <p className="text-neutral-500">No lessons available yet.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
