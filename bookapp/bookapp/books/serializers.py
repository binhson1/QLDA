from django.db.models import Sum

from books.models import *
from rest_framework import serializers

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = '__all__'


class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Author
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

