from django.contrib import admin
from .models import User, Ad, Bid, Comment, Cat, Watchlist

# Register your models here

admin.site.register(User)
admin.site.register(Ad)
admin.site.register(Bid)
admin.site.register(Comment)
admin.site.register(Cat)
admin.site.register(Watchlist)
