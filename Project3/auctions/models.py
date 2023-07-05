from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    email = models.EmailField(blank=False)
    
    #photo = image = models.URLField()

class Cat(models.Model):
    name = models.CharField(max_length=30, blank=False)

    def __str__(self):
        return f"{self.name}"

class Ad(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="ader",blank=False)
    title = models.CharField(max_length=50, blank=False)
    description = models.TextField(max_length=500, blank=False)
    start_bid = models.DecimalField(max_digits=7, decimal_places=2, blank=False)
    actual_price = models.DecimalField(max_digits=7, decimal_places=2, blank=False, default=0)
    image = models.URLField(blank=True)
    cat = models.ForeignKey(Cat, on_delete=models.SET_NULL, verbose_name="category", null=True, blank=True)

    def __str__(self):
        return f"{self.id}: {self.title} by {self.user} at {self.start_bid}€"

class Bid(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="bidder",blank=False)
    ad = models.ForeignKey(Ad, on_delete=models.CASCADE, blank=False, related_name="bidded")
    price = models.DecimalField(max_digits=7, decimal_places=2, blank=False)

    def __str__(self):
        return f"{self.user} bid for {self.ad.title} ({self.id}) with {self.price}€"

class Comment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="bidder",blank=False)
    ad = models.ForeignKey(Ad, on_delete=models.CASCADE, blank=False)
    content = models.TextField(max_length=200, blank=False)

    def __str__(self):
        return f"{self.user} coment in ad: {self.ad}"

class Watchlist(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="watcher",blank=False)
    ad = models.ForeignKey(Ad, on_delete=models.CASCADE, blank=False, related_name="watched")

    def __str__(self):
        return f"{self.user} is watching {self.ad}"
