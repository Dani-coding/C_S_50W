from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    pass

class Post(models.Model):
    name = models.ForeignKey(User, on_delete=models.CASCADE, related_name="poster", blank=False)
    content = models.TextField(max_length=500, blank=False)
    time = models.DateField(auto_now_add=True)
    likes = models.IntegerField(default=0)

    def __str__(self):
        return f"Nº: {self.id}, poster is {self.name}, have {self.likes} likes"

class Follower(models.Model):
    name = models.ForeignKey(User, on_delete=models.CASCADE, related_name="follower", blank=False)
    of = models.ForeignKey(User, on_delete=models.CASCADE, related_name="of", blank=False)
    
    def __str__(self):
        return f"{self.name} is follower of {self.of}"

class Followed(models.Model):
    name = models.ForeignKey(User, on_delete=models.CASCADE, related_name="followed", blank=False)
    by = models.ForeignKey(User, on_delete=models.CASCADE, related_name="by", blank=False)

    def __str__(self):
        return f"{self.name} is followed by {self.of}"

class Like(models.Model):
    name = models.ForeignKey(User, on_delete=models.CASCADE, related_name="liker", blank=False)
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="liked", blank=False)

    def __str__(self):
        return f"{self.name} likes this post: {self.post}"





