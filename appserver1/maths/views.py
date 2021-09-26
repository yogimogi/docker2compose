import logging

from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.core.exceptions import ObjectDoesNotExist


from maths.models import Mathematician
from maths.serializers import MathematicianSerializer


@api_view(['GET'])
def api_mathematicians(request):
    all_mathematicians = Mathematician.objects.order_by('birth_year')
    m_serializer = MathematicianSerializer(all_mathematicians, many=True)

    logging.debug("Returning Mathematicians from database")
    return Response(m_serializer.data)


@api_view(['GET'])
def api_mathematician_by_id(request, id):
    logging.debug(f"Returning Mathematician from database with id {id}")
    try:
        mathematician = Mathematician.objects.get(pk=id)
        m_serializer = MathematicianSerializer(mathematician)
        return Response(m_serializer.data)
    except ObjectDoesNotExist:
        error = f"Mathematician with id {id} does not exist."
        logging.debug(f"Mathematician with id {id}  does not exist.")
        return Response({"error": error})
