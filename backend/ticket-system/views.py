import json
from django.http import HttpResponse, JsonResponse
import json
from django.views.decorators.csrf import csrf_exempt
from django.core.mail import EmailMessage

@csrf_exempt
def ticketSystem(request):
    ticket = json.loads(request.body)
    email = EmailMessage(
        'ticket',
        'body',
        to=['hasdkop@gmail.com']
    )
    email.send()
    return JsonResponse(ticket)
