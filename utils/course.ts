import courses from '@/constants/courses';

export const getPar = (courseid) =>{
    const dis = courses.find(a => a.id === courseid)?.par;
    console.log("desto", dis);
    return dis;
  }