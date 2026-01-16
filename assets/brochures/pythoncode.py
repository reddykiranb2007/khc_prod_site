from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import mm, inch
from reportlab.lib.enums import TA_CENTER, TA_LEFT

# --- SETUP ---
filename = "respiassist_advance_brochure.pdf"
doc = SimpleDocTemplate(filename, pagesize=A4, 
                        rightMargin=10*mm, leftMargin=10*mm, 
                        topMargin=10*mm, bottomMargin=10*mm)

# Colors
KYRON_BLUE = colors.HexColor("#007BFF")
KYRON_LIGHT_BLUE = colors.HexColor("#E3F2FD")
KYRON_GREEN = colors.HexColor("#28A745")
GRAY_BG = colors.HexColor("#F8F9FA")
TEXT_DARK = colors.HexColor("#343a40")

# Styles
styles = getSampleStyleSheet()
style_title = ParagraphStyle('Title', parent=styles['Heading1'], fontName='Helvetica-Bold', fontSize=24, textColor=KYRON_BLUE, alignment=TA_CENTER, spaceAfter=10)
style_tagline = ParagraphStyle('Tagline', parent=styles['Heading2'], fontName='Helvetica', fontSize=14, textColor=TEXT_DARK, alignment=TA_CENTER, spaceAfter=20)
style_h2 = ParagraphStyle('H2', parent=styles['Heading2'], fontName='Helvetica-Bold', fontSize=16, textColor=KYRON_BLUE, spaceBefore=10, spaceAfter=5)
style_body = ParagraphStyle('Body', parent=styles['Normal'], fontName='Helvetica', fontSize=10, leading=14, textColor=TEXT_DARK)
style_feature_title = ParagraphStyle('FeatTitle', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=11, textColor=KYRON_BLUE)
style_center = ParagraphStyle('Center', parent=styles['Normal'], alignment=TA_CENTER)

story = []

# --- PAGE 1: FRONT COVER ---
story.append(Spacer(1, 40*mm))
story.append(Paragraph("RESPIASSIST ADVANCE", style_title))
story.append(Paragraph("Smart Ventilation, Safe Breath", style_tagline))
story.append(Spacer(1, 20*mm))

# Placeholder for Device Image
story.append(Table([["[PLACEHOLDER: 3D DEVICE RENDER]"]], colWidths=[160*mm], rowHeights=[100*mm], style=[
    ('ALIGN', (0,0), (-1,-1), 'CENTER'),
    ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ('BOX', (0,0), (-1,-1), 1, colors.gray),
    ('BACKGROUND', (0,0), (-1,-1), colors.lightgrey),
]))
story.append(Spacer(1, 30*mm))

# Footer Badges
badges = [["ISO 9001:2015 Certified", "CDSCO Class B", "Kyron Healthcare"]]
t_badges = Table(badges, colWidths=[60*mm, 60*mm, 60*mm])
t_badges.setStyle(TableStyle([
    ('ALIGN', (0,0), (-1,-1), 'CENTER'),
    ('FONTNAME', (0,0), (-1,-1), 'Helvetica-Bold'),
    ('TEXTCOLOR', (0,0), (-1,-1), KYRON_BLUE),
]))
story.append(t_badges)
story.append(PageBreak())

# --- PAGE 2: INSIDE LEFT (Features) ---
story.append(Paragraph("Advanced Neonatal & Pediatric Care", style_h2))
story.append(Paragraph("The RespiAssist Series is a complete Non-Invasive Ventilation (NIV) solution designed for NICU and PICU environments. It combines precise electronic blending technology with a compact, energy-efficient design.", style_body))
story.append(Spacer(1, 10*mm))

# Feature Grid Data
features_data = [
    [Paragraph("<b>Intuitive Interface</b>", style_body), Paragraph("5 inch Touch Display with rotating knob for easy control.", style_body)],
    [Paragraph("<b>Uninterrupted Care</b>", style_body), Paragraph("Up to 4 hours battery backup ensures safety during outages.", style_body)],
    [Paragraph("<b>Real-Time Monitoring</b>", style_body), Paragraph("Continuous measurement of FiO2, Flow, and Pressure.", style_body)],
    [Paragraph("<b>Smart Blending</b>", style_body), Paragraph("Advanced electronic air-oxygen blending (21-100%).", style_body)],
    [Paragraph("<b>Safety First</b>", style_body), Paragraph("Smart alarm system with color-coded audio/visual alerts.", style_body)],
    [Paragraph("<b>Consistent Flow</b>", style_body), Paragraph("Built-in medical-grade turbine (no wall air needed).", style_body)],
]

t_features = Table(features_data, colWidths=[50*mm, 120*mm], rowHeights=15*mm)
t_features.setStyle(TableStyle([
    ('GRID', (0,0), (-1,-1), 0.5, colors.lightgrey),
    ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ('BACKGROUND', (0,0), (0,-1), KYRON_LIGHT_BLUE),
    ('PADDING', (0,0), (-1,-1), 6),
]))
story.append(t_features)
story.append(Spacer(1, 10*mm))
story.append(Paragraph("[PLACEHOLDER: NICU NURSE LIFESTYLE IMAGE]", style_center))
story.append(PageBreak())

# --- PAGE 3: INSIDE RIGHT (Therapy) ---
story.append(Paragraph("Comprehensive Therapy Modes", style_h2))

modes_data = [
    ["Bubble CPAP", "Stable flow delivery for lung expansion."],
    ["nCPAP", "Constant pressure via nasal mask/prongs."],
    ["HFNC", "Warmed, humidified oxygen at high flows."],
    ["nIPPV / nSIPPV", "Synchronized pressure up to 40 cmH2O (Pro Only)."]
]
t_modes = Table(modes_data, colWidths=[40*mm, 130*mm])
t_modes.setStyle(TableStyle([
    ('BOX', (0,0), (-1,-1), 1, KYRON_BLUE),
    ('INNERGRID', (0,0), (-1,-1), 0.5, colors.grey),
    ('FONTNAME', (0,0), (0,-1), 'Helvetica-Bold'),
    ('TEXTCOLOR', (0,0), (0,-1), KYRON_BLUE),
    ('PADDING', (0,0), (-1,-1), 8),
]))
story.append(t_modes)
story.append(Spacer(1, 10*mm))

story.append(Paragraph("Clinical Benefits", style_h2))
benefits = [
    "• Reduces need for invasive ventilation (Intubation risk -40%)",
    "• Minimizes volutrauma and barotrauma risks",
    "• Enhanced patient-ventilator synchrony",
    "• Compatible with RAM cannula & standard circuits"
]
for b in benefits:
    story.append(Paragraph(b, style_body))
    story.append(Spacer(1, 2*mm))

story.append(PageBreak())

# --- PAGE 4: BACK COVER (Specs) ---
story.append(Paragraph("Technical Specifications", style_h2))

specs_data = [
    ["Parameter", "Specification"],
    ["Modes", "nCPAP, Bubble CPAP, HFNC/O2 Therapy"],
    ["Display", "5-inch Touch Display"],
    ["Flow Range", "4 - 60 LPM"],
    ["FiO2 Range", "21% - 100%"],
    ["Pressure (PIP)", "1 - 40 cmH2O"],
    ["Power Supply", "100-265V AC, 50/60Hz"],
    ["Dimensions", "271 x 164 x 216 mm"],
    ["Safety", "IEC 60601-1, Class 1 Type B, IP21"]
]

t_specs = Table(specs_data, colWidths=[60*mm, 100*mm])
t_specs.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,0), KYRON_BLUE),
    ('TEXTCOLOR', (0,0), (-1,0), colors.white),
    ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
    ('GRID', (0,0), (-1,-1), 0.5, colors.grey),
    ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, KYRON_LIGHT_BLUE]),
    ('PADDING', (0,0), (-1,-1), 6),
]))
story.append(t_specs)
story.append(Spacer(1, 20*mm))

story.append(Paragraph("Kyron Healthcare Private Limited", style_h2))
contact_info = """
358, 1st Floor, Patparganj Industrial Area, East Delhi, 110092<br/>
<b>Sales:</b> +91 9555324421  |  <b>Support:</b> +91 9311589338<br/>
<b>Email:</b> kyronhealthcare@gmail.com<br/>
<b>Web:</b> www.kyronhealthcare.com
"""
story.append(Paragraph(contact_info, style_body))

doc.build(story)