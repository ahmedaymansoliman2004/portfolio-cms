const MONTHS_EN = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const MONTHS_AR = [
  "يناير",
  "فبراير",
  "مارس",
  "أبريل",
  "مايو",
  "يونيو",
  "يوليو",
  "أغسطس",
  "سبتمبر",
  "أكتوبر",
  "نوفمبر",
  "ديسمبر",
];

export function formatPeriod(item, lang = "en") {
  if (!item?.startDate) return "";

  const start = new Date(item.startDate);

  const end = item.present || !item.endDate
    ? null
    : new Date(item.endDate);

  const months = lang === "ar" ? MONTHS_AR : MONTHS_EN;
  const present = lang === "ar" ? "الآن" : "Present";

  const startText = `${months[start.getMonth()]} ${start.getFullYear()}`;

  if (!end) return `${startText} — ${present}`;

  const endText = `${months[end.getMonth()]} ${end.getFullYear()}`;

  return `${startText} — ${endText}`;
}

export function calculateDuration(item) {
  if (!item?.startDate) return 0;

  const start = new Date(item.startDate);
  const end =
    item.present || !item.endDate
      ? new Date()
      : new Date(item.endDate);

  const months =
    (end.getFullYear() - start.getFullYear()) * 12 +
    (end.getMonth() - start.getMonth());

  return Math.max(months, 0);
}

export function calculateTotalExperience(experience = []) {
  if (!Array.isArray(experience)) return "0+";

  const validCategories = [
    "work",
    "internship",
    "freelance",
  ];

  let totalMonths = 0;

  experience.forEach((item) => {
    if (validCategories.includes(item.category)) {
      totalMonths += calculateDuration(item);
    }
  });

  const years = Math.floor(totalMonths / 12);

  return `${years}+`;
}

export function formatExperience(months) {
  const years = Math.floor(months / 12);
  const remain = months % 12;

  if (years === 0) return `${remain} Months`;

  if (remain === 0) return `${years} Years`;

  return `${years} Years ${remain} Months`;
}