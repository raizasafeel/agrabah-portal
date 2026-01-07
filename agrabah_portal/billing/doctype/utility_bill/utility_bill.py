# Copyright (c) 2026, raiza and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document
import random
import string


class UtilityBill(Document):
	def autocalculate_bill_number(self):
		self.bill_number = ''.join(random.choices(string.ascii_uppercase + string.digits, k=12))

	def calculate_base_charges(self):
		if self.units_consumed and self.rate_per_unit:
			self.base_charges = float(self.units_consumed) * float(self.rate_per_unit)
		else:
			self.base_charges = 0
	
	def calculate_total_amount(self):
		self.total_amount = float(self.base_charges or 0) + float(self.fixed_charges or 0) + float(self.tax_amount or 0)
	
	def calculate_units_consumed(self):
		if self.current_reading:
			if self.previous_reading:
				self.units_consumed = float(self.current_reading) - float(self.previous_reading)
			else:
				self.units_consumed = float(self.current_reading)
	
	def validate_due_date(self):
		if self.due_date and self.bill_date and self.due_date < self.bill_date:
			frappe.throw("Due date cannot be before the bill date")
	
	def before_insert(self):
		self.bill_date = frappe.utils.nowdate()
		self.autocalculate_bill_number()

	def validate(self):
		self.validate_due_date()
		self.calculate_units_consumed()
		self.calculate_base_charges()
		self.calculate_total_amount()

	def on_submit(self):
		if self.payment_status == "Unpaid":
			frappe.throw("Bill is not paid")


def get_permission_query_conditions(user):
    if not user: user = frappe.session.user
    
    if "System Manager" in frappe.get_roles(user):
        return ""
		
    return f"customer = {frappe.db.escape(user)}"