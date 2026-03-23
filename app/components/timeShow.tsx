import { useEffect, useState } from "react";

export default function TimeShow(){
    const [todayDate, setTodayDate] = useState(new Date());

    useEffect(() => {
        setInterval(() => {
            setTodayDate(new Date());
            const intervalTime = 60000 - (todayDate.getSeconds() * 1000);
            
        }, 60000 - (todayDate.getSeconds() * 1000));
    }, [])

    
    return(
        <>
        {todayDate.getHours()} : {todayDate.getMinutes()} - {todayDate.getDate()}/{todayDate.getMonth() + 1}
        </>
    );
}