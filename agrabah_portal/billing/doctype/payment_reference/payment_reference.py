# Copyright (c) 2026, raiza and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class PaymentReference(Document):
	def set_payment_reference(self):
		frappe.db.set_value("Utility Bill", self.bill, {
			"payment_reference": self.name,
			"payment_status": "Paid",
			"payment_date": self.date,
			"docstatus": 1
		})

	def after_insert(self):
		self.set_payment_reference()

def get_permission_query_conditions(user):
    if not user: user = frappe.session.user
    
    if "System Manager" in frappe.get_roles(user):
        return ""

    return f"customer = {frappe.db.escape(user)}"