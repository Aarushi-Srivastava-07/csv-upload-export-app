from django.urls import path
from .views import test_summary, upload_csv, get_summaries

urlpatterns = [
    path('summary/test/', test_summary),
    path('upload/', upload_csv),
    path('summaries/', get_summaries)
]