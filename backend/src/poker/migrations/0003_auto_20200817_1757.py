# Generated by Django 3.0.4 on 2020-08-17 17:57

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('poker', '0002_auto_20200817_1756'),
    ]

    operations = [
        migrations.AlterField(
            model_name='contact',
            name='avatar',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, to='poker.Avatar'),
        ),
    ]