from django.urls import path
from . import views

urlpatterns = [
    path('session/', views.session), path('login/', views.login), path('logout/', views.logout),
    path('state/', views.state), path('calculate/', views.calculate_view),
    path('import/', views.import_bundle), path('export/', views.export_bundle),
    path('history/', views.history), path('history/<int:revision>/', views.historical_state),
]
