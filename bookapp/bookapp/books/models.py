from cloudinary.models import CloudinaryField
from django.db import models
from ckeditor.fields import RichTextField
from django.contrib.auth.models import AbstractUser
from django.utils import timezone


# Create your models here.


class BaseModel(models.Model):
    created_date = models.DateField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)
    active = models.BooleanField(default=True)

    class Meta:
        abstract = True


class User(AbstractUser):
    avatar = CloudinaryField('avatar', null=True)

    class RoleChoices(models.IntegerChoices):
        EMPLOYEE = 1
        CUSTOMER = 2
        ADMIN = 3

    role = models.IntegerField(choices=RoleChoices.choices, null=True)

    def __str__(self):
        return self.username

    def save(self, *args, **kwargs):
        if self.pk is None:
            super().save(*args, **kwargs)
        else:
            try:
                old_user = self.__class__.objects.get(pk=self.pk)
                if self.password != old_user.password:
                    self.set_password(self.password)
            except self.__class__.DoesNotExist:
                pass
            super().save(*args, **kwargs)


class Gender(models.IntegerChoices):
    MALE = 1
    FEMALE = 2


class Cart(BaseModel):
    customer_account = models.OneToOneField('User', on_delete=models.CASCADE, limit_choices_to={
        'role__in': [User.RoleChoices.CUSTOMER, User.RoleChoices.EMPLOYEE]})


class Customer(BaseModel):
    account = models.ForeignKey('User', null=True, blank=True, on_delete=models.SET_NULL,
                                limit_choices_to={'role': User.RoleChoices.CUSTOMER})
    fullname = models.CharField(max_length=100, null=False)
    phone_numbers = models.CharField(max_length=15, null=False, unique=True)


class Employee(BaseModel):
    account = models.ForeignKey('User', null=True, blank=True, on_delete=models.SET_NULL,
                                limit_choices_to={'role': User.RoleChoices.EMPLOYEE})
    CCCD = models.CharField(max_length=20, null=False, unique=True)
    first_name = models.CharField(max_length=100, null=False)
    last_name = models.CharField(max_length=100, null=False)
    fullname = models.CharField(max_length=100, null=False)
    gender = models.IntegerField(choices=Gender.choices)


class Tag(BaseModel):
    name = models.CharField(max_length=100, null=False, unique=True)

    def __str__(self):
        return self.name


class Author(BaseModel):
    first_name = models.CharField(max_length=100, null=False)
    last_name = models.CharField(max_length=100, null=False)
    full_name = models.CharField(max_length=100, null=False)
    email = models.EmailField(null=False, unique=True)

    def __str__(self):
        return self.full_name


class Publisher(BaseModel):
    name = models.CharField(max_length=100, null=False, unique=True)

    def __str__(self):
        return self.name


class Category(BaseModel):
    name = models.CharField(max_length=100, null=False, unique=True)
    image = CloudinaryField()


class Book(BaseModel):
    title = models.CharField(max_length=100, null=False, unique=True)
    author = models.ForeignKey('Author', on_delete=models.CASCADE)
    publisher = models.ForeignKey('Publisher', on_delete=models.CASCADE)
    price = models.FloatField(default=0)
    image = CloudinaryField()
    stock_quantity = models.IntegerField(null=False)
    release_date = models.DateTimeField(null=False)
    description = RichTextField(null=False, default="Sách không có mô tả")

    def __str__(self):
        return self.title


class Comment(BaseModel):
    book = models.ForeignKey('Book', on_delete=models.CASCADE)
    customer = models.ForeignKey('User', on_delete=models.CASCADE,
                                 limit_choices_to={'role': User.RoleChoices.CUSTOMER})
    content = RichTextField(null=False)


class Book_Category(BaseModel):
    book = models.ForeignKey('Book', on_delete=models.CASCADE)
    category = models.ForeignKey('Category', on_delete=models.CASCADE)


class Book_Cart(BaseModel):
    book = models.ForeignKey('Book', on_delete=models.CASCADE)
    cart = models.ForeignKey('Cart', on_delete=models.CASCADE)
    quantity = models.IntegerField(null=False, default=0)


class Book_Tag(BaseModel):
    book = models.ForeignKey('Book', on_delete=models.CASCADE)
    tag = models.ForeignKey('Tag', on_delete=models.CASCADE)


class Receipt(BaseModel):
    id = models.CharField(primary_key=True, max_length=100)
    customer = models.ForeignKey('User', on_delete=models.CASCADE, null=True, blank=True,
                                 related_name='customer_account',
                                 limit_choices_to={'role': User.RoleChoices.CUSTOMER})
    employee = models.ForeignKey('User', on_delete=models.CASCADE, null=True, blank=True,
                                 related_name='employee_account',
                                 limit_choices_to={'role': User.RoleChoices.EMPLOYEE})
    address = models.TextField(null=True)
    quantity = models.IntegerField(default=0)
    total_price = models.FloatField(default=0)

    class StatusChoices(models.IntegerChoices):
        PAID = 1,
        UNPAID = 2

    status = models.IntegerField(choices=StatusChoices.choices, null=True)

    class MethodChoices(models.IntegerChoices):
        CASH = 1,
        BANK_TRANSFER = 2

    method = models.IntegerField(choices=MethodChoices.choices, null=True)
    # class Meta:
    #     constraints = [
    #         models.CheckConstraint(
    #             check=models.Q(customer__isnull=False) | models.Q(employee__isnull=False),
    #             name='customer_or_employee_not_null_check')
    #     ]


class ReceiptDetail(BaseModel):
    receipt = models.ForeignKey('Receipt', on_delete=models.CASCADE)
    book = models.ForeignKey('Book', on_delete=models.CASCADE)
    quantity = models.IntegerField(null=False)
    book_price = models.FloatField(null=False)
    total_price = models.FloatField(null=False)


class Book_Promotion(BaseModel):
    book = models.ForeignKey('Book', on_delete=models.CASCADE)
    promotion = models.ForeignKey('Promotion', on_delete=models.CASCADE)


class Promotion(models.Model):
    name = models.TextField()
    description = RichTextField()
    start_date = models.DateTimeField(default=timezone.now)
    end_date = models.DateTimeField()
    discount_percent = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    discount_amount = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)

    def __str__(self):
        return self.name

    def is_active(self):
        now = timezone.now()
        return self.start_date <= now <= self.end_date

    class Meta:
        verbose_name = "Promotion"
        verbose_name_plural = "Promotions"
