import { toZonedTime, format } from "date-fns-tz";

export function formatDateToArgentina(date: Date): string {
	const zonedDate = toZonedTime(date, "America/Argentina/Buenos_Aires");

	return format(zonedDate, "dd/MM/yyyy HH:mm:ss");
}
