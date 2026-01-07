# Copyright (c) 2026, raiza and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document

class CustomerConnection(Document):
	def before_insert(self):
		self.connection_date = frappe.utils.nowdate()

def get_permission_query_conditions(user):
    if not user: user = frappe.session.user
    
    if "System Manager" in frappe.get_roles(user):
        return ""

    return f"customer = {frappe.db.escape(user)}"