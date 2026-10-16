from django.urls import include, path, re_path
from potential.views import frontend

urlpatterns = [path('api/', include('potential.urls')), re_path(r'^(?!api/).*$', frontend)]
