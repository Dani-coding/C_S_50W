
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),

    # New pages
    path("user/<str:name>", views.user, name="user"),
    path("following", views.following, name="following"),

    # API Routes
    path("new_post", views.new_post, name="new_post"),
    path("all_posts", views.all_posts, name="all_posts"),
    path("last_post", views.last_post, name="last_post"),

    # New API Routes
    path("posts_of/<str:name>", views.posts_of, name="posts_of"),
    path("n_followers/<str:name>", views.n_followers, name="n_followers"),
    path("n_follows/<str:name>", views.n_follows, name="n_follows"),
    path("is_following/<str:names>", views.is_following, name="is_following"),
    path("f_change/<str:names>", views.f_change, name="f_change"),
    path("following_posts/<str:name>", views.following_posts, name="following_posts"),
    path("edit_post", views.edit_post, name="edit_post"),  
    path("all_likes", views.all_likes, name="all_likes") ,
    path("change_like", views.change_like, name="change_like"),
]
