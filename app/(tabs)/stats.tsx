import { Redirect } from "expo-router";
import db from '../db/db';
import { useEffect, useRef, useState } from 'react';

const Index = () => {
    useEffect(() => {
    db.initDb();
  }, []);
  //return <Redirect href="/map" />;
};
export default Index;