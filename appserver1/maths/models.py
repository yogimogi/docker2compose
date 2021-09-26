from django.db import models


class Mathematician(models.Model):
    name = models.CharField(max_length=255)
    details = models.CharField(max_length=255)
    known_for = models.CharField(max_length=255)
    birth_year = models.IntegerField()

    class Meta:
        db_table = "mathematicians"

    def __str__(self):
        return self.name

