from rest_framework.permissions import BasePermission
from books.models import *


class IsCustomerOrEmployee(BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False

        if request.user.role in [User.RoleChoices.CUSTOMER, User.RoleChoices.EMPLOYEE]:  # Ví dụ: kiểm tra theo group
            return True

        return False
