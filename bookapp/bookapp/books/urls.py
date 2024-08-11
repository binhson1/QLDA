from rest_framework import routers
from django.urls import path, re_path, include
from apps import views, send_mail

r = routers.DefaultRouter()
r.register('books', views.BookViewSet, basename='books')
r.register('cart', views.CartViewSet, basename='cart')
r.register('publisher', views.PublisherViewSet, basename='publisher')
r.register('author', views.AuthorViewSet, basename='author')
r.register('book_cart', views.Book_CartViewSet, basename='book_cart')