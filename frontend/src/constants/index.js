export const SERVICE_TYPES = [
	{ label: "Electricity", value: "Electricity" },
	{ label: "Water", value: "Water" },
	{ label: "Gas", value: "Gas" },
];

export const SERVICE_TYPES_WITH_GENERAL = [
	...SERVICE_TYPES,
	{ label: "General", value: "General" },
];

export const PAYMENT_METHODS = [
	{ label: "Credit Card", value: "Credit Card" },
	{ label: "Debit Card", value: "Debit Card" },
	{ label: "Net Banking", value: "Net Banking" },
	{ label: "UPI", value: "UPI" },
];

export const REQUEST_TYPES = [
	{ label: "Complaint", value: "Complaint" },
	{ label: "Meter Issue", value: "Meter Issue" },
	{ label: "Billing Issue", value: "Billing Issue" },
	{ label: "Other", value: "Other" },
];

export const PAYMENT_STATUS = {
	PAID: "Paid",
	UNPAID: "Unpaid",
	OVERDUE: "Overdue",
};

export const REQUEST_STATUS = {
	PENDING: "Pending",
	IN_PROGRESS: "In Progress",
	RESOLVED: "Resolved",
	CLOSED: "Closed",
};

export const MAX_RECORDS_LIMIT = 999999;

