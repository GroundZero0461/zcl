# Generated by Django 3.0.1 on 2019-12-23 01:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0014_auto_20191223_0024'),
    ]

    operations = [
        migrations.AlterField(
            model_name='match',
            name='match_date',
            field=models.DateTimeField(auto_now_add=True),
        ),
    ]
