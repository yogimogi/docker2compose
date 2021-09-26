from django.urls import include, path

urlpatterns = [
    path('mathematicians/', include('maths.urls')),
    path('cache/', include('cache.urls')),
]
