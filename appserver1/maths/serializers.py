from rest_framework import serializers
from maths.models import Mathematician


class MathematicianSerializer(serializers.ModelSerializer):
    class Meta:
        model = Mathematician
        fields = '__all__'
