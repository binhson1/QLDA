from datetime import datetime

from django.contrib import admin
from django.db.models import Sum, Count
from django.db.models.functions import ExtractMonth, ExtractYear

from .models import *
from django.urls import path
from django.template.response import TemplateResponse


class MyAdminSite(admin.AdminSite):
    site_header = 'iBookApp'

    def get_urls(self):
        return [
            path('book-stats/', self.stats_view, name='stats_view')
        ] + super().get_urls()

    def stats_view(self, request):
        current_year = datetime.now().year
        current_month = datetime.now().month

        monthly_revenue = (ReceiptDetail.objects
                           .filter(created_date__year=current_year)
                           .annotate(month=ExtractMonth('created_date'))
                           .values('month')
                           .annotate(total_revenue=Sum('total_price'))
                           .order_by('month'))

        top_selling_books = (ReceiptDetail.objects
                             .values('book__title')
                             .annotate(total_sold=Sum('quantity'))
                             .order_by('-total_sold')[:3])

        return TemplateResponse(request, 'admin/stats.html', {
            'monthly_revenue': monthly_revenue,
            'top_selling_books': top_selling_books,
        })


admin_site = MyAdminSite(name='iBookApp')

admin_site.register(Category)
admin_site.register(Book)
admin_site.register(Cart)
admin_site.register(Tag)
admin_site.register(Author)
admin_site.register(Publisher)
admin_site.register(Comment)
admin_site.register(Book_Cart)
admin_site.register(Book_Category)
admin_site.register(Book_Tag)
admin_site.register(Receipt)
admin_site.register(ReceiptDetail)
admin_site.register(User)
admin_site.register(Employee)
admin_site.register(Customer)
admin_site.register(Promotion)
admin_site.register(Book_Promotion)
