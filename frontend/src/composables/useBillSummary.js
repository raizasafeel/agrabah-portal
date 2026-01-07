import { computed } from "vue";
import { formatMostRecentDate } from "../utils/date";
import { PAYMENT_STATUS } from "../constants";

export function useBillSummary(bills) {
	return computed(() => {
		if (!bills.value || bills.value.length === 0) {
			return [
				{ title: "Total Bills", value: 0 },
				{ title: "Total Unpaid Amount", value: 0, prefix: "₹" },
				{ title: "Last Payment Date", value: "-" },
			];
		}

		const paidBills = bills.value.filter(
			(bill) => bill.payment_status === PAYMENT_STATUS.PAID,
		);

		const paymentDates = paidBills
			.filter((bill) => bill.payment_date)
			.map((bill) => bill.payment_date);

		const lastPaymentDate = formatMostRecentDate(paymentDates);

		const totalUnpaidAmount = bills.value
			.filter((bill) => bill.payment_status === PAYMENT_STATUS.UNPAID)
			.reduce((sum, bill) => sum + (bill.total_amount || 0), 0);

		return [
			{
				title: "Total Bills",
				value: bills.value.length,
			},
			{
				title: "Total Unpaid Amount",
				value: totalUnpaidAmount,
				prefix: "₹",
			},
			{
				title: "Last Payment Date",
				value: lastPaymentDate,
			},
		];
	});
}

