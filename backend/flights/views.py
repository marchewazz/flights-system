from django.http import JsonResponse


def index(request):
    return JsonResponse({'message': 'Hello its main page of flights system!'})
