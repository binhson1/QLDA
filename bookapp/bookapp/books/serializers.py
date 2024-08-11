from django.db.models import Sum

from books.models import *
from rest_framework import serializers


class ItemSerializer(serializers.ModelSerializer):  # For tables have image
    def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep['image'] = instance.image.url

        return rep


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = '__all__'


class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Author
        fields = '__all__'


class CategorySerializer(ItemSerializer):
    class Meta:
        model = Category
        fields = '__all__'


class PublisherSerializer(serializers.ModelSerializer):
    class Meta:
        model = Publisher
        fields = '__all__'


class BookSerializer(ItemSerializer):
    promotion = serializers.SerializerMethodField()
    categories = serializers.SerializerMethodField()
    author = AuthorSerializer()
    publisher = PublisherSerializer()
    tags = serializers.SerializerMethodField()
    sold_quantity = serializers.SerializerMethodField()
    comment_count = serializers.SerializerMethodField()

    class Meta:
        model = Book
        fields = '__all__'

    def get_promotion(self, obj):
        book_promotions = Book_Promotion.objects.filter(book=obj)
        promotions = Promotion.objects.filter(id__in=book_promotions.values_list('promotion__id', flat=True))
        return PromotionSerializer(promotions, many=True).data

    def get_categories(self, obj):
        book_category = Book_Category.objects.filter(book=obj)
        categories = Category.objects.filter(id__in=book_category.values_list('category__id', flat=True), active=True)
        categories_data = categories.values('id', 'name')
        return categories_data

    def get_tags(self, obj):
        book_tag = Book_Tag.objects.filter(book=obj)
        tags = Tag.objects.filter(id__in=book_tag.values_list('tag__id', flat=True), active=True)
        tags_data = tags.values("id", "name")
        return tags_data

    def get_sold_quantity(self, obj):
        receipts = ReceiptDetail.objects.filter(book=obj)
        sold_quantity = receipts.aggregate(total_sold=Sum('quantity'))['total_sold']
        return sold_quantity if sold_quantity is not None else 0

    def get_comment_count(self, obj):
        comment_count = Comment.objects.filter(book=obj).count()
        return comment_count


class Book_TagSerializer(ItemSerializer):
    tag = TagSerializer(many=True)

    class Meta:
        model = BookSerializer.Meta.model
        fields = BookSerializer.Meta.fields + 'tag'


class CartSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cart
        fields = '__all__'


class ReceiptDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReceiptDetail
        fields = '__all__'


class PromotionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Promotion
        fields = '__all__'


class Book_PromotionSerializer(serializers.ModelSerializer):
    book = BookSerializer()

    class Meta:
        model = Book_Promotion
        fields = '__all__'


class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = '__all__'


class Book_CartSerializer(serializers.ModelSerializer):
    book = BookSerializer()
    count = serializers.SerializerMethodField()
    class Meta:
        model = Book_Cart
        fields = '__all__'

    def get_count(self, obj):
        books = Book_Cart.objects.filter(cart=obj.cart)
        book_count = 0
        for book in books:
            book_count += book.quantity
        return book_count


class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = '__all__'


class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = '__all__'


class UserSerializer(serializers.ModelSerializer):
    def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep['avatar'] = instance.avatar.url
        return rep

    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'password', 'role', 'avatar', 'first_name', 'last_name']
        extra_kwargs = {
            'password': {
                'write_only': True
            }
        }

    def create(self, validated_data):
        data = validated_data.copy()

        user = User(**data)
        user.set_password(data['password'])
        user.save()

        return user


class ReceiptSerializer(serializers.ModelSerializer):
    customer = CustomerSerializer()
    employee = EmployeeSerializer()

    class Meta:
        model = Receipt
        fields = '__all__'