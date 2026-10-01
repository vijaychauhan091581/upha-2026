import os

views_path = r'd:\UPHA\backend\users\views.py'
with open(views_path, 'r', encoding='utf-8') as f:
    content = f.read()

new_view = """
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def download_id_card(request):
    user = request.user
    
    import io
    from django.http import HttpResponse
    from reportlab.pdfgen import canvas
    from reportlab.lib.pagesizes import landscape
    from reportlab.lib.units import inch
    import os
    from django.conf import settings

    width = 2.125 * inch
    height = 3.375 * inch

    buffer = io.BytesIO()
    p = canvas.Canvas(buffer, pagesize=(width, height))

    # Background
    p.setFillColorRGB(0.07, 0.09, 0.15) # Dark #111827
    p.rect(0, 0, width, height, fill=1)
    
    # Header
    p.setFillColorRGB(0.85, 0.48, 0.33) # d97c55
    p.setFont("Helvetica-Bold", 14)
    p.drawCentredString(width/2.0, height - 0.35*inch, "UPHA")
    p.setFont("Helvetica-Bold", 6)
    p.setFillColorRGB(0.6, 0.6, 0.6)
    p.drawCentredString(width/2.0, height - 0.45*inch, "UTTAR PRADESH HANDBALL ASSN.")

    # Role badge
    role_str = str(user.role).upper()
    if role_str == 'PLAYER':
        role_str = 'PLAYER MEMBERSHIP'
    p.setFillColorRGB(0.85, 0.48, 0.33)
    p.rect(width/2.0 - 0.6*inch, height - 0.65*inch, 1.2*inch, 0.15*inch, stroke=1, fill=0)
    p.setFont("Helvetica-Bold", 6)
    p.drawCentredString(width/2.0, height - 0.6*inch, role_str)

    # Photo
    photo_y = height - 1.6*inch
    p.setFillColorRGB(0.06, 0.09, 0.16)
    p.rect(width/2.0 - 0.4*inch, photo_y, 0.8*inch, 0.8*inch, fill=1)
    
    has_photo = False
    if user.passport_image and hasattr(user.passport_image, 'path') and os.path.exists(user.passport_image.path):
        try:
            p.drawImage(user.passport_image.path, width/2.0 - 0.4*inch, photo_y, width=0.8*inch, height=0.8*inch)
            has_photo = True
        except Exception as e:
            pass
            
    if not has_photo:
        p.setFillColorRGB(1, 1, 1)
        p.setFont("Helvetica-Bold", 16)
        initials = "".join([n[0] for n in user.name.split() if n])[:2].upper() if user.name else "??"
        p.drawCentredString(width/2.0, photo_y + 0.3*inch, initials)

    # Details
    p.setFillColorRGB(1, 1, 1)
    p.setFont("Helvetica-Bold", 10)
    p.drawCentredString(width/2.0, photo_y - 0.2*inch, user.name.upper() if user.name else "")
    
    p.setFont("Helvetica-Bold", 6)
    p.setFillColorRGB(0.6, 0.6, 0.6)
    p.drawCentredString(width/2.0, photo_y - 0.35*inch, "ID NUMBER")
    p.setFillColorRGB(1, 1, 1)
    role_prefix = user.role[:3].upper() if user.role else "MEM"
    p.drawCentredString(width/2.0, photo_y - 0.45*inch, f"UPHA-{role_prefix}-{str(user.id).zfill(5)}")

    # Footer
    p.setFillColorRGB(0.6, 0.6, 0.6)
    p.setFont("Helvetica-Oblique", 5)
    p.drawCentredString(width/2.0, 0.15*inch, "Khelo India Toh Khilega India")

    p.showPage()
    p.save()

    buffer.seek(0)
    response = HttpResponse(buffer, content_type='application/pdf')
    response['Content-Disposition'] = f'attachment; filename="upha_{user.role}_id_{user.id}.pdf"'
    return response

"""

if 'def download_id_card' not in content:
    with open(views_path, 'a', encoding='utf-8') as f:
        f.write("\n\n" + new_view)

print("Done appending download_id_card view.")
