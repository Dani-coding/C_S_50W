from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("newad", views.newad, name="newad"),
    path("categories", views.categories, name="categories"),
    path("watchinglist", views.watchinglist, name="watchinglist"),
    #path("non_active", views.non_active, name="non_active"),
    path("category/<str:name>", views.category, name="category"),
    path("ad/<int:ad_pk>", views.ad, name="ad"),
]
