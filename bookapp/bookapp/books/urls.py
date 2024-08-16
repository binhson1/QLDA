from rest_framework import routers
from django.urls import path, re_path, include
from books import views, send_mail

r = routers.DefaultRouter()
r.register('customer', views.CustomerViewSet, basename='customer')
r.register('books', views.BookViewSet, basename='books')
r.register('user', views.UserViewSet, basename='user')
r.register('category', views.CategoryViewSet, basename='category')
r.register('cart', views.CartViewSet, basename='cart')
r.register('receipt', views.ReceiptViewSet, basename='receipt')
r.register('publisher', views.PublisherViewSet, basename='publisher')
r.register('author', views.AuthorViewSet, basename='author')
r.register('employee', views.EmployeeViewSet, basename='employee')
r.register('receipt_detail', views.ReceiptDetailViewSet, basename='receipt_detail')
r.register('promotion', views.PromotionViewSet, basename='promotion')
r.register('book_promotion', views.Book_PromotionViewSet, basename='book_promotion')
r.register('send_mail', send_mail.SendEmailViewSet, basename='send_mail')
r.register('book_cart', views.Book_CartViewSet, basename='book_cart')
r.register('vnpay_payment', views.PaymentAPIViewSet, basename='vnpay_payment')
r.register('vnpay_payment_return', views.PaymentReturnAPIViewSet, basename='vnpay_payment_return')

urlpatterns = [
    path('', include(r.urls))
]