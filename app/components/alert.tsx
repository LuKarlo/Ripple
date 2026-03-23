import { alertType } from "@/constants/type";
import { FaRegClock } from "react-icons/fa6";
import { IoWarningOutline } from "react-icons/io5";
import { FaRegSmile } from "react-icons/fa";

export type AlertData = {
    message: string;
    type: alertType;
}

interface AlertComponentProps {
    data: AlertData;
}

export default function AlertComponent({ data }: AlertComponentProps) {
    const typeClass = alertType[data.type]; // "time" | "mock" | "warning"

    return (
        <div className={`alert-banner ${typeClass}`}>
            <div className="icon">
                {data.type === alertType.time && <FaRegClock />}
                {data.type === alertType.mock && <FaRegSmile />}
                {data.type === alertType.warning && <IoWarningOutline />}
            </div>
            <div className="text">
                {data.message}
            </div>
        </div>
    );
}