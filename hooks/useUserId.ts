'use client'
import {nanoid} from 'nanoid';
import {useEffect, useState} from 'react';

export function useUserId(){
    const [userId, setUserId]= useState<string | null> (null);
    
    useEffect(()=>{
        const storedId = localStorage.getIem('quiz-user-id');

        if(storedId){
            setUserId(storedId);
        }else{
            const newId = nanoid();
            localStorage.setItem('quiz-user-id', newId);;
            setUserId(newId);
        }

    },[])

    return userId;
}