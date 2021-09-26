import logging

from django.apps import apps

from rest_framework.decorators import api_view
from rest_framework.response import Response


@api_view(['GET'])
def api_cache(request):
    redis = apps.get_app_config('cache').REDIS
    x = redis.hgetall('numbers')

    x1 = {}
    for k, v in x.items():
        k1 = k.decode("utf-8")
        v1 = v.decode("utf-8")
        x1[k1] = v1

    logging.debug("Returning data from cache")

    return Response(x1)


@api_view(['GET'])
def api_limit(request):
    source_ip = _get_client_ip(request)
    key = f"{source_ip}"
    limit = apps.get_app_config('cache').RATE_LIMTIT
    window = apps.get_app_config('cache').WINDOW_IN_SECONDS
    redis = apps.get_app_config('cache').REDIS

    val = redis.get(key)
    if val is None:
        val = redis.incrby(key, 1)
        redis.expire(key, window)
    else:
        val = redis.incrby(key, 1)

    if int(val) > limit:
        ttl = redis.ttl(key)
        logging.error(f"API Limit exceeded for ip: {source_ip}")
        return Response(status=429, data={'error': f'Too many requests - try after {ttl} seconds.'})
    else:
        logging.debug(f"Returing response to query received from ip: {source_ip}")
        return Response(data={'api_call_count': {key: val}})


def _get_client_ip(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip
