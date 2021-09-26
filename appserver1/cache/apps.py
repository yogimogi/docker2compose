from django.apps import AppConfig
from django.conf import settings
import redis


class CacheConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'cache'

    # API Throttling Settings
    RATE_LIMTIT = 10
    WINDOW_IN_SECONDS = 60

    # Nice numbers
    REDIS = redis.Redis(settings.REDIS['host'], settings.REDIS['port'])
    REDIS.hmset("numbers", {
        "1729": "Ramanujan Number",
        "1.059": "Twelfth root of 2, multiplication factor for musical notes",
        "1.6180": "Golden Ratio",
        "42": "The answer to life, the universe, and everything",
        "31337": "elite port"
    })
