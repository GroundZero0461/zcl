# Generated by Django 3.0.6 on 2020-05-20 04:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0052_auto_20200516_0641'),
    ]

    operations = [
        migrations.AddField(
            model_name='match',
            name='observers',
            field=models.ManyToManyField(blank=True, null=True, related_name='observers', to='api.SC2Profile'),
        ),
    ]