import moment from "moment";

export function getFileBodyRequest(req) {
  const body = req.body;
  const sub = req.user.sub;

  if (body) {
    const files = getFileLogs(body, sub);
    const projects = getProjectLogs(body, sub);

    if (files && projects) {
      return {
        files,
        projects,
      };
    }
  } else {
    return null;
  }
}

function getFileLogs(body, userid) {
  const filePath = body.filePath;
  const language = body.language;
  const timeSpend = body.timeSpend;
  const projectFolder = body.projectFolder;
  const date = body.date;

  if (filePath && language && timeSpend && userid) {
    return {
      filePath,
      language,
      timeSpend,
      projectFolder,
      dateTime: date,
      sub: userid,
      operatingSystem: "darwin",
    };
  } else {
    return null;
  }
}

function getProjectLogs(body, userid) {
  const projectFolder = body.projectFolder;
  const date = body.date;
  const timeSpend = body.timeSpend;

  if (projectFolder && date && userid) {
    return {
      projectFolder,
      date,
      sub: userid,
      timeSpend,
    };
  } else {
    return null;
  }
}

function padTo2Digits(num) {
  return num.toString().padStart(2, "0");
}

export function msToTime(ms) {
  let seconds = (ms / 1000).toFixed(1);
  let minutes = (ms / (1000 * 60)).toFixed(1);
  let hours = (ms / (1000 * 60 * 60)).toFixed(1);
  let days = (ms / (1000 * 60 * 60 * 24)).toFixed(1);
  if (seconds < 60) return seconds + " Seconds";
  else if (minutes < 60) return minutes + " Minutes";
  else if (hours < 24) return hours + " Hours";
  else return days + " Days";
}

export function convertMsToHM(milliseconds) {
  let seconds = Math.floor(milliseconds / 1000);
  let minutes = Math.floor(seconds / 60);
  let hours = Math.floor(minutes / 60);

  seconds = seconds % 60;
  minutes = seconds >= 30 ? minutes + 1 : minutes;

  minutes = minutes % 60;

  return `${padTo2Digits(hours)}.${padTo2Digits(minutes)}`;
}

export const getTimeSpentOnLanguagesByDay = async (file_logs) => {
  const timSpentOnLanguagesByDay = file_logs.reduce((acc, file) => {
    const { language, dateTime } = file;
    const dateString = dateTime;
    if (acc[dateString]) {
      if (acc[dateString][language]) {
        acc[dateString][language] = +(
          Math.round(
            msToHours(file.timeSpend) + acc[dateString][language] + "e+2"
          ) + "e-2"
        );
      } else {
        acc[dateString][language] = msToHours(file.timeSpend);
      }
    } else {
      acc[dateString] = {};
      acc[dateString][language] = msToHours(file.timeSpend);
    }
    return acc;
  }, {});

  const timSpentOnLanguagesByDayArray = Object.keys(
    timSpentOnLanguagesByDay
  ).map((key) => {
    return {
      date: key,
      ...timSpentOnLanguagesByDay[key],
    };
  });
  return timSpentOnLanguagesByDayArray;
};

export const getTimeSpendByLanguages = async (file_logs) => {
  const timeSpendByLanguages = file_logs.reduce((acc, file) => {
    const { language, timeSpend } = file;
    if (acc[language]) {
      acc[language] += msToHours(timeSpend);
    } else {
      acc[language] = msToHours(timeSpend);
    }
    return acc;
  }, {});

  // convert object to array
  const timeSpendByLanguagesArray = Object.keys(timeSpendByLanguages)
    .map((key) => {
      return {
        id: key,
        label: key,
        timeSpend: +(Math.round(timeSpendByLanguages[key] + "e+2") + "e-2"),
      };
    })
    .slice(0, 5);

  return timeSpendByLanguagesArray;
};

export const getEffortByDay = async (file_logs) => {
  const effortByDay = file_logs.reduce((acc, file) => {
    const { dateTime } = file;
    const dateString = dateTime;
    if (acc[dateString]) {
      acc[dateString] += msToHours(file.timeSpend);
    } else {
      acc[dateString] = msToHours(file.timeSpend);
    }
    return acc;
  }, {});

  const effortByDayArray = Object.keys(effortByDay).map((key) => {
    return {
      day: key,
      value: effortByDay[key],
    };
  });

  return effortByDayArray;
};

function msToHours(millisec) {
  var hours = (millisec / (1000 * 60 * 60)).toFixed(1);

  return parseFloat(hours);
}

function msToMinutes(millisec) {
  var minutes = (millisec / (1000 * 60)).toFixed(1);

  return parseFloat(minutes);
}

export const getMostCodedLanguages = async (file_logs) => {
  const mostCodedLanguages = file_logs.reduce((acc, file) => {
    const { language, timeSpend } = file;
    if (acc[language]) {
      acc[language] += timeSpend;
    } else {
      acc[language] = timeSpend;
    }
    return acc;
  }, {});

  const mostCodedLanguagesArray = Object.keys(mostCodedLanguages)
    .map((key) => {
      return {
        id: key,
        label: key,
        time: +(
          Math.round(msToMinutes(mostCodedLanguages[key]) + "e+2") + "e-2"
        ),
      };
    })
    .sort((a, b) => {
      return b.time - a.time;
    })
    .slice(0, 5);

  return mostCodedLanguagesArray;
};

export const getMostCodedProjects = async (file_logs) => {
  const mostCodedProjects = file_logs.reduce((acc, file) => {
    const { projectFolder, timeSpend } = file;
    if (acc[projectFolder]) {
      acc[projectFolder] += timeSpend;
    } else {
      acc[projectFolder] = timeSpend;
    }
    return acc;
  }, {});

  const mostCodedProjectsArray = Object.keys(mostCodedProjects)
    .map((key) => {
      return {
        id: key,
        label: key,
        time: +(
          Math.round(msToMinutes(mostCodedProjects[key]) + "e+2") + "e-2"
        ),
      };
    })
    .sort((a, b) => {
      return b.time - a.time;
    })
    .slice(0, 5);

  return mostCodedProjectsArray;
};


export const getTimeSpendByDay = (file_logs) => {
  const timeSpendByDay = file_logs.reduce((acc, file) => {
    const { dateTime } = file;
    const dateString = dateTime;
    if (acc[dateString]) {
      acc[dateString] += file.timeSpend;
    } else {
      acc[dateString] = file.timeSpend;
    }
    return acc;
  }, {});

  const timeSpendByDayArray = Object.keys(timeSpendByDay).map((key) => {
    return {
      x: key,
      y: msToHours(timeSpendByDay[key]),
    };
  });

  // if the array is length is less than 7, add the missing days
  if (timeSpendByDayArray.length < 7) {
    const lastDate = timeSpendByDayArray[timeSpendByDayArray.length - 1].x;
    const lastDateObject = new Date(lastDate);
    const lastDateNumber = lastDateObject.getDate();
    const lastDateMonth = lastDateObject.getMonth();
    const lastDateYear = lastDateObject.getFullYear();

    for (let i = 1; i < 7; i++) {
      const newDate = new Date(
        lastDateYear,
        lastDateMonth,
        lastDateNumber - i
      ).toISOString();
      const newDateString = newDate.split("T")[0];
      const newDateObject = {
        x: newDateString,
        y: 0,
      };

      timeSpendByDayArray.unshift(newDateObject);
    }
  }

  console.log(timeSpendByDayArray);
  return [
    {
      id: 'Hours',
      data: timeSpendByDayArray,
    }
  ];
};
