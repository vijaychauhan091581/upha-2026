import sys

with open(r'd:\UPHA\backend\users\views.py', 'r', encoding='utf-8') as f:
    content = f.read()

target = """	p.setFillColorRGB(0.83, 0.68, 0.21)
	p.setFont("Times-BoldItalic", 36)
	p.drawCentredString(width/2.0, height - 2.5*inch, certificate.title.upper())"""

replacement = """	# Ribbon in Top Right
	p.saveState()
	p.translate(width - 1.5*inch, height - 1.5*inch)
	p.rotate(-45)
	p.setFillColorRGB(0.83, 0.68, 0.21)
	p.rect(-1.5*inch, -0.2*inch, 3*inch, 0.4*inch, fill=1, stroke=0)
	p.setFillColorRGB(1, 1, 1)
	p.setFont("Helvetica-Bold", 8)
	p.drawCentredString(0, -0.05*inch, "OFFICIAL")
	p.restoreState()

	# Trophy Icon Top Left
	p.setFillColorRGB(0.83, 0.68, 0.21)
	p.circle(1.5*inch, height - 1.5*inch, 0.5*inch, fill=1, stroke=0)
	p.setFillColorRGB(0.06, 0.09, 0.16)
	p.circle(1.5*inch, height - 1.5*inch, 0.45*inch, fill=1, stroke=0)
	p.setFillColorRGB(1, 1, 1)
	p.setFont("Helvetica-Bold", 24)
	p.drawCentredString(1.5*inch, height - 1.6*inch, "U")

	# Small "CERTIFICATE OF"
	p.setFillColorRGB(0.6, 0.6, 0.6)
	p.setFont("Helvetica-Bold", 10)
	p.drawCentredString(width/2.0, height - 2.1*inch, "CERTIFICATE OF")

	p.setFillColorRGB(0.83, 0.68, 0.21)
	p.setFont("Times-BoldItalic", 36)
	p.drawCentredString(width/2.0, height - 2.6*inch, certificate.title)"""

if target in content:
    content = content.replace(target, replacement)
    with open(r'd:\UPHA\backend\users\views.py', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Successfully replaced.")
else:
    print("Target not found.")
