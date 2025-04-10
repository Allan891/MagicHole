import courses from '@/constants/courses';

export const getPar = (courseid) =>{
    return courses.find(a => a.id === courseid)?.par;
  }

export const getHole = (courseid, i) =>{
  return courses.find(a => a.id === courseid)?.holes[i];
}
export const getHoles = (courseid) =>{
  return courses.find(a => a.id === courseid)?.holes;
}

export const getCourse = (courseid) => {
  return courses.find(a => a.id == courseid);
}

