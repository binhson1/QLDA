from rest_framework import pagination

class BookPagination(pagination.PageNumberPagination):
    page_size = 1  # Số lượng phần tử trên mỗi trang
    page_size_query_param = 'page_size'  # Tham số truy vấn để thiết lập số lượng phần tử trên mỗi trang
    max_page_size = 24
