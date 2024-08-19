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

from books import serializers, pagination
from books.models import *

from rest_framework import viewsets, status, generics, parsers

from rest_framework.decorators import action
from rest_framework.response import Response

from books import serializers, permissions
from books.models import *
from books.vnpay import vnpay
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


class EmployeeViewSet(viewsets.ViewSet, generics.CreateAPIView, generics.ListAPIView):
    queryset = Employee.objects.all()
    serializer_class = serializers.EmployeeSerializer

    def get_queryset(self):
        queries = self.queryset
        q = self.request.query_params.get("name")
        if q:
            queries = queries.filter(first_name__icontains=q) | queries.filter(Last_name__icontains=q)

        return queries


class ReceiptViewSet(viewsets.ViewSet, generics.CreateAPIView):
    queryset = Receipt.objects.all()
    serializer_class = serializers.ReceiptSerializer

    def create(self, request, *args, **kwargs):
        order_id = request.data.get('order_id')
        address = request.data.get('address')
        receipt = Receipt.objects.create(id=order_id, customer=request.user, address=address,
                                         status=Receipt.StatusChoices.UNPAID, method=request.data.get('method'))
        cart = Cart.objects.get(customer_account=request.user)
        book_cart = Book_Cart.objects.filter(cart=cart)
        total_quantity = 0
        total_amount = 0
        for book in book_cart:
            book_price = book.book.price
            quantity = book.quantity
            total_quantity += quantity
            promotions = Book_Promotion.objects.filter(book=book.book)
            for p in promotions:
                promotion = Promotion.objects.get(id=p.promotion.id)
                book_price = float(book_price) - float(book.book.price) * float(promotion.discount_percent) / 100
            total_price = book_price * quantity
            total_amount += total_price
            b = Book.objects.get(id=book.book.id)
            b.stock_quantity = b.stock_quantity - quantity
            b.save()
            receiptDetail = ReceiptDetail.objects.create(receipt=receipt, book=book.book, quantity=quantity,
                                                         book_price=book_price, total_price=total_price)
        receipt.quantity = total_quantity
        receipt.total_price = total_amount
        receipt.save()
        book_cart.delete()
        return Response(status=status.HTTP_201_CREATED)
    
    def list(self, request):
        user = request.user
        customer = Customer.objects.get(account_id=user.id)
        if user:
            receipts = Receipt.objects.filter(customer=customer.id)
        else:
            receipts = Receipt.objects.all()
        serializer = serializers.ReceiptSerializer(receipts, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ReceiptDetailViewSet(viewsets.ViewSet, generics.CreateAPIView):
    queryset = ReceiptDetail.objects.all()
    serializer_class = serializers.ReceiptDetailSerializer


class PaymentAPIViewSet(viewsets.ViewSet):
    def create(self, request):
        form = request.data
        if form:
            order_type = form.get('order_type')
            order_id = form.get('order_id')
            amount = form.get('amount')
            order_desc = form.get('order_desc')
            ipaddr = form.get('ipaddr')

            # Build URL Payment
            vnp = vnpay()
            vnp.requestData['vnp_Version'] = '2.1.0'
            vnp.requestData['vnp_Command'] = 'pay'
            vnp.requestData['vnp_TmnCode'] = 'OZE0N6YH'
            vnp.requestData['vnp_Amount'] = amount * 100
            vnp.requestData['vnp_CurrCode'] = 'VND'
            vnp.requestData['vnp_TxnRef'] = order_id
            vnp.requestData['vnp_OrderInfo'] = order_desc
            vnp.requestData['vnp_OrderType'] = order_type
            vnp.requestData['vnp_Locale'] = 'vn'

            vnp.requestData['vnp_CreateDate'] = datetime.now().strftime('%Y%m%d%H%M%S')
            vnp.requestData['vnp_IpAddr'] = ipaddr
            vnp.requestData['vnp_ReturnUrl'] = "http://localhost:3000/cart"
            vnpay_payment_url = vnp.get_payment_url("https://sandbox.vnpayment.vn/paymentv2/vpcpay.html",
                                                    "Y306ETVLWUW53592DB5Q94GY99SPFI1P")
            print(vnpay_payment_url)

            # Redirect to VNPAY
            return Response(data={'url': vnpay_payment_url}, status=status.HTTP_201_CREATED)
        else:
            # Handle invalid form data
            return Response({"error": "Invalid form data"}, status=status.HTTP_400_BAD_REQUEST)


class PaymentReturnAPIViewSet(viewsets.ViewSet):
    def create(self, request):
        form = request.data
        if form:
            vnp = vnpay()
            vnp.responseData["vnp_TxnRef"] = form.get('vnp_TxnRef')
            vnp.responseData["vnp_Amount"] = float(form.get('vnp_Amount')) / 100
            vnp.responseData["vnp_OrderInfo"] = form.get('vnp_OrderInfo')
            vnp.responseData["vnp_TransactionNo"] = form.get('vnp_TransactionNo')
            vnp.responseData["vnp_ResponseCode"] = form.get('vnp_ResponseCode')
            vnp.responseData["vnp_TmnCode"] = form.get('vnp_TmnCode')
            vnp.responseData["vnp_PayDate"] = form.get('vnp_PayDate')
            vnp.responseData["vnp_BankCode"] = form.get('vnp_BankCode')
            vnp.responseData["vnp_CardType"] = form.get('vnp_CardType')
            vnp.responseData["vnp_BankTranNo"] = form.get('vnp_BankTranNo')
            vnp.responseData["vnp_TransactionStatus"] = form.get('vnp_TransactionStatus')
            vnp.responseData["vnp_SecureHash"] = form.get('vnp_SecureHash')
            if form.get('vnp_ResponseCode') == '00':
                receipt = Receipt.objects.get(id=form.get('vnp_TxnRef'))
                receipt.status = Receipt.StatusChoices.PAID
                receipt.save()
                return Response(status=status.HTTP_200_OK)
            else:
                return Response(status=status.HTTP_400_BAD_REQUEST)


class CustomerViewSet(viewsets.ViewSet, generics.ListAPIView, generics.CreateAPIView):
    queryset = Customer.objects.all()
    serializer_class = serializers.CustomerSerializer

    @action(methods=['post'], url_path='is_valid', detail=False)
    def check_is_valid_customer(self, request):
        try:
            customer = Customer.objects.get(phone_numbers=request.data.get('phone'))
            return Response(status=status.HTTP_200_OK)
        except Customer.DoesNotExist:
            return Response(status=status.HTTP_204_NO_CONTENT)


class UserViewSet(viewsets.ViewSet, generics.CreateAPIView):
    queryset = User.objects.filter(is_active=True).all()
    serializer_class = serializers.UserSerializer
    parser_classes = [parsers.MultiPartParser, ]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # Tạo user mới
        self.perform_create(serializer)

        # Lấy user vừa tạo
        user_instance = serializer.instance

        # Tạo cart cho user với user_id là khóa ngoại
        cart = Cart.objects.create(customer_account=user_instance)

        # Tạo customer cho user
        phone = request.data.get('phone')
        fullname = request.data.get('first_name') + request.data.get('last_name')
        if phone:
            customer = Customer.objects.create(account=user_instance, fullname=fullname, phone_numbers=phone)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(methods=['get', 'patch'], url_path='current-user', detail=False)
    def get_current_user(self, request):
        user = request.user
        if request.method.__eq__("PATCH"):
            for k, v in request.data.items():
                setattr(user, k, v)  # user.k = v (user.name = v)
            user.save()

        return Response(serializers.UserSerializer(user).data)

    @action(methods=['post'], url_path='customer', detail=False, parser_classes=[parsers.JSONParser])
    def get_customer_by_user(self, request):
        try:
            customer = Customer.objects.get(account__id=request.data.get('user_id'))
            return Response(serializers.CustomerSerializer(customer).data, status=status.HTTP_200_OK)
        except Customer.DoesNotExist:
            return Response(status=status.HTTP_204_NO_CONTENT)

    @action(methods=['post'], url_path='is_valid', detail=False, parser_classes=[parsers.JSONParser])
    def check_is_valid_user(self, request):
        try:
            user_by_email = User.objects.get(email=request.data.get('email'))
            return Response(status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response(status=status.HTTP_204_NO_CONTENT)


class PromotionViewSet(viewsets.ViewSet, generics.ListAPIView, generics.RetrieveAPIView):
    queryset = Promotion.objects.all()
    serializer_class = serializers.PromotionSerializer


class Book_PromotionViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = Book_Promotion.objects.filter(active=True)
    serializer_class = serializers.Book_PromotionSerializer


class CategoryViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = serializers.CategorySerializer

    @action(methods=['get'], url_path='books', detail=True)
    def get_book_by_cate(self, request, pk):
        category = self.get_object()
        books = Book_Category.objects.filter(category=category)
        return Response(serializers.Book_CategorySerializer(books, many=True).data, status=status.HTTP_200_OK)


def create_tokens(user):
    # Xóa các access token và refresh token cũ của user (nếu có)
    AccessToken.objects.filter(user=user).delete()
    RefreshToken.objects.filter(user=user).delete()
    Application = get_application_model()
    application = Application.objects.get(id=1)
    expires = timezone.now() + timezone.timedelta(seconds=oauth2_settings.ACCESS_TOKEN_EXPIRE_SECONDS)
    access_token = AccessToken.objects.create(
        user=user,
        token=generate_token(),
        expires=expires,
        scope='read write',  # Phạm vi của token
        application=application  # Thay bằng application nếu có
    )

    refresh_token = RefreshToken.objects.create(
        user=user,
        token=generate_token(),
        access_token=access_token,
        application=application  # Thay bằng application nếu có
    )

    return access_token, refresh_token
