import json
from django.http import HttpResponse, JsonResponse
import json
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
def ticketSystem(request):
    ticket = json.loads(request.body)
    return JsonResponse(ticket)
