# Generated by Django 4.2.2 on 2023-07-05 09:32

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('auctions', '0005_remove_watchlist_value'),
    ]

    operations = [
        migrations.RenameField(
            model_name='ad',
            old_name='username',
            new_name='user',
        ),
        migrations.RenameField(
            model_name='bid',
            old_name='username',
            new_name='user',
        ),
        migrations.RenameField(
            model_name='watchlist',
            old_name='username',
            new_name='user',
        ),
    ]