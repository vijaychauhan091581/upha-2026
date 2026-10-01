import sys

with open(r'd:\UPHA\backend\users\views.py', 'r', encoding='utf-8') as f:
    content = f.read()

target = """@api_view(['GET'])
@permission_classes([IsAuthenticated])
def download_id_card(request):
    user = request.user"""

replacement = """@require_http_methods(['GET'])
def download_id_card(request):
    user = getattr(request, 'user', None)
    if not user or not user.is_authenticated:
        from django.http import JsonResponse
        return JsonResponse({'success': False, 'message': 'Authentication required.'}, status=401)"""

if target in content:
    content = content.replace(target, replacement)
    with open(r'd:\UPHA\backend\users\views.py', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Successfully replaced.")
else:
    print("Target not found.")
