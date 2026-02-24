import { format, isValid, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';

export const formatedDate = (timestamp: string): string => {
	const date = parseISO(timestamp);

	if (!isValid(date)) {
		return timestamp;
	}

	return format(date, "d MMM HH:mm", { locale: ru });
};
