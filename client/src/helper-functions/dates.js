// Author: Grace Yuzwin
// helper functions for date parsing

export function parseEventDate(dateString) {
    return new Date(dateString);
}

// getting the short month abbreviation
export function getMonthAbbreviation(dateString) {
    return parseEventDate(dateString)
        .toLocaleString("en-US", {
            month: "short"})
            .toUpperCase();
}

// get the day of the month
export function getDayOfMonth(dateString) {
    return parseEventDate(dateString)
        .getDate();
}

// get the long version format
export function getFormattedDate(dateString) {
    return parseEventDate(dateString)
        .toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric"
        });
}

// time formatted
export function getFormattedTime(dateString) {
    return parseEventDate(dateString)
        .toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit"
        });
}

// sort the dates into today, this week (not today), and later
export function getEventCategory(dateString) {
    const eventDate = parseEventDate(dateString);

    // today at the start of the day for reference
    const today = new Date();   
    today.setHours(0, 0, 0, 0);

    // get tomorrow date
    const tomorrow = new Date(today); 
    tomorrow.setDate(today.getDate() + 1);

    // check if the event is today
    if (eventDate >= today && eventDate < tomorrow) {
        return "today";
    }

    // get next week date
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);

    // check if the event is this week
    if (eventDate < nextWeek) {
        return "thisWeek";
    }

    // if it hasn't returned, it is later 
    return "later";
}