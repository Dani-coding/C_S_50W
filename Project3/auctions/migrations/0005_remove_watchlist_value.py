# Generated by Django 4.2.2 on 2023-07-05 09:13

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('auctions', '0004_watchlist_value'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='watchlist',
            name='value',
        ),
    ]