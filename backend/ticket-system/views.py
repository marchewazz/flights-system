from django.conf import settings
from django.http.response import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.mail import EmailMessage
from django.template.loader import get_template

from xhtml2pdf import pisa  
import json
from io import BytesIO
from random import randint
from datetime import datetime

@csrf_exempt
def ticketSystem(request):

    def render_to_pdf(template_src, context_dict={}):
        template = get_template(template_src+"\\index.html")
        print(context_dict)
        html  = template.render(context_dict)
        result = BytesIO()
 
        #This part will create the pdf.
        pdf = pisa.pisaDocument(BytesIO(html.encode("ISO-8859-1")), result)
        if not pdf.err:
            return result.getvalue()
        return None
    
    ticket = json.loads(request.body)
    ticket['orderKey'] = randint(100000000000,999999999999)
    ticket['generationTime'] = datetime.now().strftime("%d/%m/%Y %H:%M:%S")
    attachment = render_to_pdf(settings.TEMPLATES[0]['DIRS'][0], ticket)
    
    email = EmailMessage(
        'Your ticket is here',
        f"Here is your ticket. Order no.{ticket['orderKey']}",
        to=[ticket['person']['email']],
    )
    email.attach('ticket_'+ str(ticket['orderKey'])+'.pdf', attachment, 'application/pdf')
    email.send()
    
    return JsonResponse(ticket)
