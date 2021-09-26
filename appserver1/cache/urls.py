from django.urls import path

from . import views

urlpatterns = [
    path('', views.api_cache, name='api_cache'),
    path('limit', views.api_limit, name='api_limit'),
]
