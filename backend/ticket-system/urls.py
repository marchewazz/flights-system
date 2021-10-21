from django.urls import path

from . import views

urlpatterns = [
    path('generate-ticket/', views.ticketSystem),
]