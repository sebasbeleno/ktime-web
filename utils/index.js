export function getFileBodyRequest(req) {
  const body = req.body;
  const sub = req.user.sub;

  if (body) {
    const filePath = body.filePath;
    const language = body.language;
    const timeSpend = body.timeSpend;
    const project_folder = body.projectFolder;

    if (filePath && language && timeSpend) {
      return {
        file_path: filePath,
        language: language,
        time_spend: timeSpend,
        sub,
        project_folder,
      };
    } else {
      return null;
    }
  } else {
    return null;
  }
}

export function msToTime(ms) {
  let seconds = (ms / 1000).toFixed(1);
  let minutes = (ms / (1000 * 60)).toFixed(1);
  let hours = (ms / (1000 * 60 * 60)).toFixed(1);
  let days = (ms / (1000 * 60 * 60 * 24)).toFixed(1);
  if (seconds < 60) return seconds + " Seconds";
  else if (minutes < 60) return minutes + " Minutes";
  else if (hours < 24) return hours + " Hours";
  else return days + " Days"
}
