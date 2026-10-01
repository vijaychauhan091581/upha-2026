import sys
import os

with open(r'd:\UPHA\backend\users\views.py', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update Certificate - Add Logo and Remove Signatures & Seal
cert_target = """	# Trophy Icon Top Left
	p.setFillColorRGB(0.83, 0.68, 0.21)
	p.circle(1.5*inch, height - 1.5*inch, 0.5*inch, fill=1, stroke=0)
	p.setFillColorRGB(0.06, 0.09, 0.16)
	p.circle(1.5*inch, height - 1.5*inch, 0.45*inch, fill=1, stroke=0)
	p.setFillColorRGB(1, 1, 1)
	p.setFont("Helvetica-Bold", 24)
	p.drawCentredString(1.5*inch, height - 1.6*inch, "U")"""

cert_replacement = """	# Logo Top Left
	logo_path = os.path.join(settings.BASE_DIR, '..', 'frontend', 'public', 'upha.png')
	if os.path.exists(logo_path):
		try:
			p.drawImage(logo_path, 1*inch, height - 2*inch, width=1*inch, height=1*inch, mask='auto')
		except Exception:
			pass"""

if cert_target in content:
    content = content.replace(cert_target, cert_replacement)

# Remove Signatures and Seal from Certificate
# We'll just replace the specific text blocks with empty strings
sig_seal_target = """	# Signatures (mock)
	p.setStrokeColorRGB(0.3, 0.3, 0.3)
	p.line(1.5*inch, 2*inch, 3.5*inch, 2*inch)
	p.setFillColorRGB(0.3, 0.3, 0.3)
	p.setFont("Helvetica", 10)
	p.drawCentredString(2.5*inch, 1.8*inch, "Secretary General")

	p.line(width - 3.5*inch, 2*inch, width - 1.5*inch, 2*inch)
	p.drawCentredString(width - 2.5*inch, 1.8*inch, "President")

	# Seal placeholder
	p.setFillColorRGB(0.83, 0.68, 0.21)
	p.circle(width/2.0, 2*inch, 0.8*inch, fill=1)
	p.setFillColorRGB(0.99, 0.98, 0.96)
	p.circle(width/2.0, 2*inch, 0.7*inch, fill=0, stroke=1)
	p.setFont("Helvetica-Bold", 10)
	p.drawCentredString(width/2.0, 2*inch, "OFFICIAL")
	p.drawCentredString(width/2.0, 1.8*inch, "SEAL")"""

if sig_seal_target in content:
    content = content.replace(sig_seal_target, "")


# 2. Update ID Card - Keep colors, add logo, improve styling
id_card_target = """    # Header
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
    p.drawCentredString(width/2.0, photo_y - 0.45*inch, f"UPHA-{role_prefix}-{str(user.id).zfill(5)}")"""

id_card_replacement = """    # Logo Header
    logo_path = os.path.join(settings.BASE_DIR, '..', 'frontend', 'public', 'upha.png')
    if os.path.exists(logo_path):
        try:
            p.drawImage(logo_path, width/2.0 - 0.3*inch, height - 0.7*inch, width=0.6*inch, height=0.6*inch, mask='auto')
        except Exception:
            pass

    p.setFillColorRGB(0.85, 0.48, 0.33) # d97c55
    p.setFont("Helvetica-Bold", 9)
    p.drawCentredString(width/2.0, height - 0.85*inch, "UTTAR PRADESH")
    p.drawCentredString(width/2.0, height - 0.97*inch, "HANDBALL ASSN.")

    # Role badge
    role_str = str(user.role).upper()
    if role_str == 'PLAYER':
        role_str = 'PLAYER MEMBERSHIP'
    
    # Premium Gold/Orange Accent Box
    p.setFillColorRGB(0.85, 0.48, 0.33)
    p.rect(0, height - 1.25*inch, width, 0.2*inch, fill=1, stroke=0)
    p.setFillColorRGB(1, 1, 1)
    p.setFont("Helvetica-Bold", 7)
    p.drawCentredString(width/2.0, height - 1.2*inch, role_str)

    # Photo (with accent border)
    photo_y = height - 2.2*inch
    p.setStrokeColorRGB(0.85, 0.48, 0.33)
    p.setLineWidth(1.5)
    p.rect(width/2.0 - 0.4*inch, photo_y, 0.8*inch, 0.8*inch, stroke=1, fill=0)
    
    has_photo = False
    if user.passport_image and hasattr(user.passport_image, 'path') and os.path.exists(user.passport_image.path):
        try:
            p.drawImage(user.passport_image.path, width/2.0 - 0.4*inch, photo_y, width=0.8*inch, height=0.8*inch)
            has_photo = True
        except Exception as e:
            pass
            
    if not has_photo:
        p.setFillColorRGB(0.2, 0.2, 0.2)
        p.rect(width/2.0 - 0.4*inch, photo_y, 0.8*inch, 0.8*inch, fill=1, stroke=0)
        p.setFillColorRGB(1, 1, 1)
        p.setFont("Helvetica-Bold", 16)
        initials = "".join([n[0] for n in user.name.split() if n])[:2].upper() if user.name else "??"
        p.drawCentredString(width/2.0, photo_y + 0.3*inch, initials)

    # Details
    p.setFillColorRGB(1, 1, 1)
    p.setFont("Times-Bold", 11)
    p.drawCentredString(width/2.0, photo_y - 0.2*inch, user.name.upper() if user.name else "")
    
    p.setFont("Helvetica-Bold", 5)
    p.setFillColorRGB(0.85, 0.48, 0.33)
    p.drawCentredString(width/2.0, photo_y - 0.35*inch, "ID NUMBER")
    p.setFillColorRGB(0.9, 0.9, 0.9)
    p.setFont("Helvetica", 8)
    role_prefix = user.role[:3].upper() if user.role else "MEM"
    p.drawCentredString(width/2.0, photo_y - 0.48*inch, f"UPHA-{role_prefix}-{str(user.id).zfill(5)}")"""

if id_card_target in content:
    content = content.replace(id_card_target, id_card_replacement)

with open(r'd:\UPHA\backend\users\views.py', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updates applied to views.py successfully.")
