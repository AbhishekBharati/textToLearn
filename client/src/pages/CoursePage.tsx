import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCourse } from '../context/CourseContext';
import { API_BASE_URL } from '../utils/constants';
import { motion } from 'motion/react';
import { IconLayoutGrid } from '@tabler/icons-react';

interface Module {
  id: string;
  title: string;
}

interface Course {
  id: string;
  title: string;
  description: string;
  modules: Module[];
}

export const CoursePage = () => {
  const { courseId } = useParams();
  const { apiFetch } = useAuth();
  const { setCourseTitle } = useCourse();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      setLoading(true);
      try {
        const response = await apiFetch(`${API_BASE_URL}/api/courses/view/${courseId}`);
        if (response.ok) {
          const data = await response.json();
          setCourse(data);
          setCourseTitle(data.title);
        }
      } catch (error) {
        console.error('Error fetching course:', error);
      } finally {
        setLoading(false);
      }
    };

    if (courseId) fetchCourse();
  }, [courseId, setCourseTitle]);

  const LoadingShimmer = () => (
    <div className="w-full max-w-4xl space-y-8 animate-pulse mx-auto">
      <div className="text-center space-y-4">
        <div className="h-12 w-3/4 bg-neutral-200 dark:bg-neutral-800 rounded-2xl mx-auto" />
        <div className="h-6 w-1/2 bg-neutral-200 dark:bg-neutral-800 rounded-xl mx-auto" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 bg-neutral-200 dark:bg-neutral-800 rounded-[2.5rem] border border-neutral-300 dark:border-neutral-700" />
        ))}
      </div>
    </div>
  );

  if (loading) return (
    <div className="h-full bg-white dark:bg-neutral-900 flex items-center justify-center p-6">
       <LoadingShimmer />
    </div>
  );

  if (!course) return (
    <div className="h-full flex items-center justify-center bg-white dark:bg-neutral-900">
      <p className="text-neutral-500">Course not found.</p>
    </div>
  );

  return (
    <div className="h-full bg-white dark:bg-neutral-900 transition-colors duration-200 overflow-y-auto custom-scrollbar">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full"
        >
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-bold uppercase tracking-widest mb-6">
              Ready to Start
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold text-neutral-900 dark:text-neutral-100 mb-6 leading-tight tracking-tight">
              {course.title}
            </h1>
            <p className="text-xl text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto leading-relaxed">
              {course.description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {course.modules.map((module, idx) => (
              <Link 
                key={module.id} 
                to={`/modules/${module.id}`}
                className="flex items-center gap-5 p-8 bg-neutral-50 dark:bg-neutral-800/40 rounded-[2.5rem] border border-neutral-200 dark:border-neutral-800 hover:border-blue-500 hover:bg-white dark:hover:bg-neutral-800 transition-all group shadow-sm"
              >
                <div className="h-14 w-14 rounded-2xl bg-white dark:bg-neutral-900 flex items-center justify-center shadow-xl border border-neutral-100 dark:border-neutral-800 group-hover:scale-110 group-hover:text-blue-600 transition-all">
                  <IconLayoutGrid size={28} />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-bold text-xs text-blue-600 dark:text-blue-400 uppercase tracking-[0.2em] mb-1">Module {idx + 1}</h3>
                  <p className="text-xl font-bold text-neutral-800 dark:text-neutral-200 leading-tight">
                    {module.title}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
