interface DateType {
    startTime: string;
    endTime: string;
}


export function sortTasks(taskArray: DateType[], sortType: string) {
    if (sortType === "startTimeASC") {
        taskArray.sort((a, b) => {
            const startTimeA = new Date(a.startTime).getTime();
            const startTimeB = new Date(b.startTime).getTime();
            return startTimeA - startTimeB;
        });
    } else if (sortType === "startTimeDESC") {
        taskArray.sort((a, b) => {
            const startTimeA = new Date(a.startTime).getTime();
            const startTimeB = new Date(b.startTime).getTime();
            return startTimeB - startTimeA;
        });
    } else if (sortType === "endTimeASC") {
        taskArray.sort((a, b) => {
            const endTimeA = new Date(a.endTime).getTime();
            const endTimeB = new Date(b.endTime).getTime();
            return endTimeA - endTimeB;
        });
    } else if (sortType === "endTimeDESC") {
        taskArray.sort((a, b) => {
            const endTimeA = new Date(a.endTime).getTime();
            const endTimeB = new Date(b.endTime).getTime();
            return endTimeB - endTimeA;
        });
    }
    return taskArray;
}