const DATE_STRING_OPTIONS = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
};

export default function toLocaleDateString(date) {
    return new Date(date).toLocaleDateString(ForisTranslations.locale, DATE_STRING_OPTIONS);
}
