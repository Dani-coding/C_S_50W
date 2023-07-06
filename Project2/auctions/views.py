from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render, redirect
from django.urls import reverse
from .models import Ad, User, Bid, Watchlist, Cat, Comment
from django import forms

from .models import User
from django.db.models import Max

from django.forms import ModelForm

from decimal import Decimal

# Create the form class.

class NewAd(ModelForm):
     class Meta:
         model = Ad
         exclude = ["actual_price", "user"]


""" 
class NewComment(ModelForm):
    class Meta:
        model = Comment
        filter = "__all__"



fields = ["title", "description", "start_bid", "image", "cat"]   

widgets = {
"title": forms.TextInput(attrs={'class': 'new_title'}),
"description": forms.TextInput(attrs={'class': 'new_description'}),
"star_bid": forms.TextInput(attrs={'class': 'new_star_bid'}),
"image": forms.TextInput(attrs={'class': 'new_image'}),
"cat": forms.TextInput(attrs={'class': 'new_cat'}),
} """

"""
cats=Cat.objects.all()
class NewAd(forms.Form):
    title = forms.CharField(max_length=50, required=True)
    description = forms.CharField(widget=forms.Textarea, max_length=500, required=True)
    start_bid = forms.DecimalField(max_digits=7, decimal_places=2, required=True)
    image = forms.URLField(required=False)
    cat = forms.ChoiceField(cats, required=False, label="category")
"""

class NewBid(forms.Form):   
    actual_price = forms.DecimalField(max_digits=7, decimal_places=2, label="")

class NewComment(forms.Form):
    content = forms.CharField(widget=forms.Textarea, max_length=200, required=True)

"""
        #return HttpResponse(f"The actual price is {actual_price} and the starting bid is {start_bid}")
"""

def index(request):
    return render(request, "auctions/index.html", {
        "ads" : Ad.objects.all(),
    })

def categories(request):
    return render(request, "auctions/categories.html", {
        "categories" :Cat.objects.all(),
    })

def category(request, name):
    cat = Cat.objects.get(name=name)
    return render(request, "auctions/category.html", {
        "name" : name,
        "ads" : Ad.objects.filter(cat=cat),
    })

def ad(request, ad_pk):
    ad = Ad.objects.get(pk=ad_pk)
    if not request.user.is_authenticated:
        return render(request, "auctions/ad_notlog.html", {
            "ad_pk" : ad.pk,
            "ad" : ad,
        })
    username = request.user.username
    user = User.objects.get(username=username)
    wl = Watchlist.objects.filter(user=user.pk, ad=ad_pk).first()
    if wl:
        watched = True
    else:
        watched = False
    msg = "You can make a bid here."
    if  (request.method == "POST"):
        submit = request.POST.get("click")
        if "Change it" in submit:
            if wl:
                wl.delete()
                watched = False 
            else:
                new = Watchlist(user=user, ad=ad)
                new.save()
                watched = True
        elif "Send" in submit:
            content = request.POST["newcomment"]
            new = Comment(user=user , ad=ad, content=content)
            new.save()
        else:
            form = NewBid()
            form = NewBid(request.POST)
            if form.is_valid():
                form.clean()
                actual_price = Decimal(form["actual_price"].value())
                if ( (ad.actual_price == 0) and (actual_price < ad.start_bid) ):
                    msg = "You must bid higher than the starting price."
                elif (actual_price<=ad.actual_price):
                    msg = "You must bid higher than the acutal price."
                else:
                    b = Bid(user=ad.user, ad=ad, price=actual_price)
                    b.save()
                    msg = "Your bid was submited succesfully!"
                    Ad.objects.filter(pk=ad.pk).update(actual_price=actual_price)
                    ad = Ad.objects.get(pk=ad_pk)
                    try:
                        comments = Comment.objects.filter(ad=ad_pk)
                    except:
                        comments = None
                    return render(request, "auctions/ad.html", {
                        "ad_pk" : ad.pk,
                        "ad" : ad,
                        "form" : NewBid(),
                        "comments" : comments,
                        "watched" : watched,
                        "msg" : msg,
                    })
                try:
                    comments = Comment.objects.filter(ad=ad_pk)
                except:
                    comments = None
                return render(request, "auctions/ad.html", {
                    "ad_pk" : ad.pk,
                    "ad" : ad,
                    "form" : form,
                    "comments" : comments,
                    "watched" : watched,
                    "msg" : msg,
                })
            else:
                msg = "The input wasn't valid, try agian."
    try:
      comments = Comment.objects.filter(ad=ad_pk)
    except:
        comments = None
    return render(request, "auctions/ad.html", {
        "ad_pk" : ad.pk,
        "ad" : ad,
        "form" : NewBid(),
        "comments" : comments,
        "watched" : watched,
        "msg" : msg,
    })

def newad(request):
    username = request.user.username
    user = User.objects.get(username=username)
    form = NewAd()
    if (request.method == "POST"):
        form = NewAd(request.POST)
        if form.is_valid():
            form.clean()
            cat = Cat.objects.get(id=form["cat"].value())
            ad = Ad(user=user, title=form["title"].value(), description=form["description"].value(), start_bid=form["start_bid"].value(), image=form["image"].value(), cat=cat)
            ad.save()
            return render(request, "auctions/index.html", {
                "ads" : Ad.objects.all(),
            })
            
        else:
            return render(request, "auctions/newad.html", {
                "form" : form
            })

    return render(request, "auctions/newad.html", {
        "form" : NewAd()
    })

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
            return render(request, "auctions/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "auctions/login.html")


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
            return render(request, "auctions/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "auctions/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "auctions/register.html")
