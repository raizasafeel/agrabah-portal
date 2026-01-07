import { call } from "frappe-ui"
import { MAX_RECORDS_LIMIT } from "../constants"

export async function fetchUserData(userName) {
	const response = await call("frappe.client.get", {
		doctype: "User",
		name: userName,
		fields: ["name", "full_name", "user_image", "email"],
	})

	return response
}

export async function fetchBills(serviceType) {
	const response = await call("frappe.client.get_list", {
		doctype: "Utility Bill",
		fields: [
			"name",
			"payment_status",
			"bill_number",
			"bill_date",
			"due_date",
			"total_amount",
			"service_type",
			"units_consumed",
			"rate_per_unit",
			"payment_date",
		],
		filters: {
			docstatus: ["in", [0, 1]],
			service_type: serviceType,
		},
		order_by: "creation desc",
		limit_page_length: MAX_RECORDS_LIMIT,
	})

	return response || []
}

export async function createServiceRequest(data) {
	const response = await call("frappe.client.insert", {
		doc: {
			doctype: "Service Request",
			...data,
		},
	})

	return response
}

function generatePaymentReferenceId() {
	const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
	const LETTER_COUNT = 4
	const MIN_NUMBER = 1000
	const MAX_NUMBER = 9999

	const randomLetters = Array.from(
		{ length: LETTER_COUNT },
		() => LETTERS[Math.floor(Math.random() * LETTERS.length)],
	).join("")

	const randomNumbers = Math.floor(
		MIN_NUMBER + Math.random() * (MAX_NUMBER - MIN_NUMBER + 1),
	)

	return `PYR.${randomLetters}-${randomNumbers}`
}

export async function processPayment(billName, paymentMethod) {
	const paymentRefId = generatePaymentReferenceId()
	const today = new Date().toISOString().split("T")[0]

	const response = await call("frappe.client.insert", {
		doc: {
			doctype: "Payment Reference",
			name: paymentRefId,
			bill: billName,
			payment_method: paymentMethod,
			date: today,
		},
	})

	return response
}

export async function updateBillPayment(billName, paymentData) {
	const response = await call("frappe.client.set_value", {
		doctype: "Utility Bill",
		name: billName,
		fieldname: paymentData,
	})

	return response
}
