# Generated by Django 3.0.3 on 2020-02-09 23:56

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Subscription',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('hub', models.URLField()),
                ('topic', models.URLField()),
                ('callback_name', models.CharField(max_length=100)),
                ('lease_expiration', models.DateTimeField(blank=True, null=True)),
            ],
        ),
    ]
