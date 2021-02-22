export const formattedDateTime = (datetime: string) => {
  const date = new Date(datetime);
  const year = date.getFullYear();
  const month = (1 + date.getMonth()).toString().padStart(2, "0");
  const day = date
    .getDate()
    .toString()
    .padStart(2, "0");
  const hours = date.getHours();
  const minutes = date
    .getMinutes()
    .toString()
    .padStart(2, "0");
  const seconds = date
    .getSeconds()
    .toString()
    .padStart(2, "");

  return (
    day + "." + month + "." + year + " " + hours + ":" + minutes + ":" + seconds
  );
};
