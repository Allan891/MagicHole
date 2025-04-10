import courses from '@/constants/courses';

export const getPar = (courseid) =>{
    return courses.find(a => a.id === courseid)?.par;
  }

export const getHole = (courseid, i) =>{
  return courses.find(a => a.id === courseid)?.holes[i];
}