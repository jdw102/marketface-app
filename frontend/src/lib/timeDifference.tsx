

function getSimulatedDate(localStorage: Storage) {
    const difference = localStorage.getItem("date_difference");
    if (!difference) {
        return new Date();
    }
    const currentDate = new Date();
    const simulatedDate = new Date(currentDate.getTime() - parseInt(difference));
    return simulatedDate;
}


function updateSimulatedDate(newDate: Date, localStorage: Storage) {
    const currentDate = new Date();
    const difference = currentDate.getTime() - newDate.getTime();
    localStorage.setItem("date_difference", difference.toString());
}


export { getSimulatedDate, updateSimulatedDate };

