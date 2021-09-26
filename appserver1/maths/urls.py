from django.urls import path

from . import views

urlpatterns = [
    path('', views.api_mathematicians, name='api_mathematicians'),
    path('<int:id>', views.api_mathematician_by_id, name='api_mathematician_by_id'),
]
