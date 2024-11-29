import { format } from 'date-fns';

export function formatDate(inputDate: string | Date): string {
    const date = new Date(inputDate);

    if (isNaN(date.getTime())) {
        throw new Error("Invalid date format");
    }

    return format(date, "dd-MMM-yy hh:mm a");
}

export function getTimeFinished(startTime: string | Date, endTime: string | Date): number {
    const start = new Date(startTime);
    const end = new Date(endTime);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        throw new Error("Invalid date format");
    }
    const timeDifference = end.getTime() - start.getTime();
    const hoursDifference = Math.round(timeDifference / (1000 * 60 * 60));

    return hoursDifference;
}
