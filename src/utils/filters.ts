export const getFullName = (
  lastName: string,
  firstName: string,
  middleName: null | string
): string => {
  return lastName + " " + firstName + (middleName ? " " + middleName : "");
};

export const getGenderName = (gender: string): string => {
  switch (gender) {
    case "male":
      return "Мужчина";
    case "female":
      return "Женщина";
  }

  return "Любой";
};

export const getAgeFromBirthdate = (birthdate: string): number => {
  const ageDiff = Date.now() - new Date(birthdate).getTime();
  const ageDate = new Date(ageDiff);

  return Math.abs(ageDate.getUTCFullYear() - 1970);
};
