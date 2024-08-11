from datetime import datetime

from authlib.integrations.requests_client import OAuth2Session
from django.shortcuts import render, redirect
from oauth2_provider.models import AccessToken, RefreshToken, get_application_model
from oauth2_provider.settings import oauth2_settings
from oauthlib.common import generate_token
from django.db.models import Q
from django.shortcuts import render
from rest_framework import viewsets, status, generics
from rest_framework.views import APIView

from apps import serializers, pagination
from apps.models import *

from rest_framework import viewsets, status, generics, parsers

from rest_framework.decorators import action
from rest_framework.response import Response

from apps import serializers, permissions
from apps.models import *
from apps.vnpay import vnpay
from bookapp import settings

class TagViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = Tag.objects.all()
    serializer_class = serializers.TagSerializer

    def get_queryset(self):
        queries = self.queryset
        name = self.request.query_params.get("name")
        if name:
            queries = queries.filter(name__icontains=name)

        return queries

    @action(methods=['get'], url_path='books', detail=True)
    def get_book_by_tag(self, request, pk):
        tag = self.get_object()
        books = Book_Tag.objects.filter(tag=tag).all()
        return Response(serializers.Book_TagSerializer(books, many=True).data, status=status.HTTP_200_OK)


class PublisherViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = Publisher.objects.all()
    serializer_class = serializers.PublisherSerializer

    def get_queryset(self):
        queries = self.queryset
        q = self.request.query_params.get("name")
        if q:
            queries = queries.filter(name__icontains=q)

        return queries

class AuthorViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = Author.objects.all()
    serializer_class = serializers.AuthorSerializer


class BookViewSet(viewsets.ViewSet, generics.ListAPIView, generics.RetrieveUpdateAPIView):
    queryset = Book.objects.all()
    serializer_class = serializers.BookSerializer
    pagination_class = pagination.BookPagination

    def get_queryset(self):
        queryset = self.queryset
        if self.action == 'list':
            q = self.request.query_params.get('q')
            if q:
                queryset = queryset.filter(title__icontains=q)
            category = self.request.query_params.get('cate')
            if category:
                book_cate = Book_Category.objects.filter(category=category)
                queryset = queryset.filter(id__in=book_cate.values_list('book__id', flat=True))
        return queryset

    @action(methods=['post'], url_path='add_cart', detail=True, permission_classes=[permissions.IsCustomerOrEmployee])
    def add_cart(self, request, pk):
        book = self.get_object()
        cart = Cart.objects.get(customer_account=request.user.id)
        quantity = request.data.get('quantity')
        book_cart, new_book_cart = Book_Cart.objects.get_or_create(book=book, cart=cart)
        if not new_book_cart:
            book_cart.quantity += int(quantity)
            book_cart.save()
            return Response(serializers.Book_CartSerializer(book_cart).data, status=status.HTTP_200_OK)
        else:
            book_cart.quantity = int(quantity)
            book_cart.save()
            return Response(serializers.Book_CartSerializer(book_cart).data, status=status.HTTP_200_OK)

    @action(methods=['get'], url_path='comments', detail=True)
    def get_comments(self, request, pk):
        book = self.get_object()
        comments = Comment.objects.filter(book=book)
        return Response(serializers.CommentSerializer(comments, many=True).data, status=status.HTTP_200_OK)


class CartViewSet(viewsets.ViewSet, generics.CreateAPIView):
    queryset = Cart.objects.all()
    serializer_class = serializers.CartSerializer

    @action(methods=['get'], url_path='books', detail=False)
    def get_book_cart(self, request):
        user_id = request.user.id
        cart = Cart.objects.get(customer_account__id=user_id)
        books = Book_Cart.objects.filter(cart=cart)
        return Response(serializers.Book_CartSerializer(books, many=True).data, status=status.HTTP_200_OK)


class Book_CartViewSet(viewsets.ViewSet, generics.DestroyAPIView, generics.UpdateAPIView):
    queryset = Book_Cart.objects.all()
    serializer_class = serializers.Book_CartSerializer
