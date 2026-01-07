// Formats to DD/MM/YYYY format
export function formatDate(dateString) {
	if (!dateString) return "-"

	const date = new Date(dateString)

	if (Number.isNaN(date.getTime())) return "-"

	const day = String(date.getDate()).padStart(2, "0")
	const month = String(date.getMonth() + 1).padStart(2, "0")
	const year = date.getFullYear()

	return `${day}/${month}/${year}`
}

// Get the most recent date
export function getMostRecentDate(dates) {
	const validDates = dates
		.filter((date) => date)
		.map((date) => new Date(date))
		.filter((date) => !Number.isNaN(date.getTime()))

	if (validDates.length === 0) return null

	return new Date(Math.max(...validDates))
}

// Format the most recent date
export function formatMostRecentDate(dates) {
	const mostRecent = getMostRecentDate(dates)
	return mostRecent ? formatDate(mostRecent) : "-"
}
