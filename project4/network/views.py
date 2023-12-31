
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.paginator import Paginator
import json


from .models import User, Post, Followed, Follower, Like


def index(request):
    return render(request, "network/index.html")

#@login_required
@csrf_exempt
def new_post(request):

    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400)
    data = json.loads(request.body)
    content = data.get("content", "")
    post = Post(
        name = request.user,
        content = content,
    )
    post.save()
    return JsonResponse({"message": "Post was loaded successfully."}, status=201)


@csrf_exempt
def edit_post(request):
    
    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400)

    data = json.loads(request.body)

    try:
        post = Post.objects.get(name=request.user, pk=data.get("pk", ""))
    except Post.DoesNotExist:
        return JsonResponse({"error": "Post not found."}, status=404)
        
    post.content = data.get("content", "")
    post.save()
    return JsonResponse({"message": "Post was edited successfully."}, status=201)


@csrf_exempt
#@login_required
def all_likes(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400)
    if request.user.is_authenticated:
        likes = Like.objects.filter(name=request.user).all() #values_list('post', flat=True).distinct()
        #return JsonResponse(likes, safe=False)
        return JsonResponse([like.serialize() for like in likes], safe=False)
    else:
        return HttpResponse(0)


@csrf_exempt
def change_like(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400)
    data = json.loads(request.body)
    post_pk =data.get("post_pk","")
    post = Post.objects.get(pk = post_pk)
    try:
        like = Like.objects.get(name=request.user, post=post_pk)
    except Like.DoesNotExist:
        like = Like(name=request.user, post=post)
        like.save()
        post.likes += 1
        post.save()
        return JsonResponse(post.serialize(), safe=False)
    
    like.delete()
    post.likes -= 1
    post.save()
    return JsonResponse(post.serialize(), safe=False)


def all_posts(request):
    posts = Post.objects.all().order_by("-time").all()
   
    return JsonResponse([post.serialize() for post in posts], safe=False)


def posts_of(request, name):
    user = User.objects.get(username = name)
    posts = Post.objects.filter(name = user).order_by("-time").all()

    return JsonResponse([post.serialize() for post in posts], safe=False)

"""
 
        Return the people who es followed by name ¿usefull?


def follows(request, name):
    user = User.objects.get(username = name)
    follows = Follower.objects.filter(name = user).all()

    return JsonResponse([e.serialize() for e in follows], safe=False)
"""

def following_posts(request, name):
    user = User.objects.get(username = name)
    follows = Follower.objects.filter(name = user).values_list('of', flat=True).distinct()
    posts = Post.objects.filter(name__in = follows).order_by("-time").all()
    return JsonResponse([post.serialize() for post in posts], safe=False)


def n_followers(request, name):
    user = User.objects.get(username = name)
    num = Follower.objects.filter(of = user).count()
    return HttpResponse(num)


def n_follows(request, name):
    user = User.objects.get(username = name)
    num = Follower.objects.filter(name = user).count()
    return HttpResponse(num)


def is_following(request, names):
    users = names.split(" :: ")    
    follower = User.objects.get(username = users [0])
    followed = User.objects.get(username = users [1])
    f = Follower.objects.filter(name = follower, of = followed).first()
    if (f!=None):
        return HttpResponse(1)
    else:
        return HttpResponse(0)


def f_change(request, names):
    users = names.split(" :: ")
    follower = User.objects.get(username = users [0])
    followed = User.objects.get(username = users [1])
    f = Follower.objects.filter(name = follower, of = followed).first()
    if (f!=None):
        f.delete()
        return HttpResponse("Follow")
    else:
        f = Follower(name = follower, of = followed)
        f.save()
        return HttpResponse("Unfollow")


def last_post(request):
    posts = Post.objects.all().order_by("-time").all()
    return JsonResponse(posts[:1].serialize())


def user(request, name):
    return render(request, "network/user.html", {
        "username" : request.user.username,
        "name" : name,
    })

def following(request):
    return render(request, "network/following.html")


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")
