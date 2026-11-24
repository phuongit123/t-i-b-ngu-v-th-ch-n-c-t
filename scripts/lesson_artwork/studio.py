import math
import random

from PIL import Image, ImageDraw

from .common import (
    BLUE, GOLD, GREEN, INK, LINE, ORANGE, PALE, PAPER, PINK, SIZE,
    arrow, cubic, dashed, dot, file_card, font, guide_box, node, scene, text,
)
from .vector import draw_poster


LAYER_STACKS = {
    "compound": ("▾ Compound","  Hình tròn  −","  Hình chữ nhật"),
    "stack": ("Tiêu đề","Lá","Nền"),
    "reorder": ("Lá","Tiêu đề","Nền"),
    "group": ("▾ Nội dung","  Tiêu đề","  Lá","Nền"),
    "untitled": ("Artistic Text","Curve","Rectangle"),
    "tags": ("Tiêu đề","Lá","Nền"),
    "locked": ("Tiêu đề","Lá","Nền · Khóa"),
    "clip": ("▾ Hình cha","  Họa tiết con","Nền"),
    "mask": ("▾ Ảnh","  Mặt nạ","Nền"),
    "single": ("Hình cha",),
    "isolate": ("Lá · Đang cô lập",),
    "raw": ("Ảnh nguồn",),
    "adj": ("Curves","Ảnh nguồn"),
    "workspace": ("Cọ · Công cụ","Lớp tô · Đang chọn","Ảnh gốc"),
    "rawEmbedded": ("RAW · Embedded",),
    "developed": ("Chỉnh cục bộ","RAW · Embedded"),
    "saved": ("Kênh đã lưu","Chai · Vùng chọn"),
    "types": ("Tiêu đề · Chữ","Curves · Điều chỉnh","Ảnh · Pixel"),
    "pixelTag": ("Lớp tô · Pixel","Ảnh nguồn"),
    "photoGroup": ("▾ Chủ thể","  Mặt nạ","  Ảnh","Nền"),
    "isolatePhoto": ("Ảnh chủ thể · Cô lập",),
    "adjGroup": ("▾ Nhóm","  Curves","Ảnh bên dưới"),
    "pass": ("▾ Nhóm · Pass Through","  Curves","Ảnh nhận hiệu chỉnh"),
    "retouch": ("Lớp dặm · Pixel","Ảnh nguồn"),
    "sign": ("Biển · Đã chọn","Ảnh tường"),
    "fx": ("▾ Huy hiệu","  Layer Effects","Nền"),
}


def layers(variant):
    image, draw = scene()
    rows = LAYER_STACKS[variant]
    draw.rounded_rectangle((23,29,165,210),radius=8,fill="#e1e7db",outline=LINE)
    if variant in {"stack","reorder","group","untitled","tags","locked"}:
        draw_poster(draw,(34,39,154,201),"full" if variant!="reorder" else "hide")
        if variant=="reorder":
            draw.rectangle((54,71,134,82),fill="#a4c77d")
    elif variant in {"isolate","isolatePhoto","single","clip","mask","compound","fx"}:
        shape_color = GREEN if variant not in {"clip","mask"} else BLUE
        draw.ellipse((48,74,140,161),fill=shape_color)
        if variant in {"mask","clip","compound"}:
            draw.ellipse((102,74,140,161),fill=PALE)
    else:
        draw.rectangle((36,49,152,188),fill="#a8bfbb")
        draw.polygon([(36,184),(67,107),(89,132),(116,83),(152,184)],fill=BLUE)
        if variant in {"adj","pass","developed"}:
            draw.polygon([(38,184),(66,111),(91,132),(114,96),(151,184)],fill=GREEN)
    header="Kênh" if variant=="saved" else "Layers"
    draw.rounded_rectangle((182,29,418,210),radius=8,fill="white",outline=LINE)
    text(draw,(194,40),header,16,INK,700)
    for i,label in enumerate(rows):
        y=68+32*i
        selected=i==0 or (i==1 and variant in {"mask","clip","fx","group","compound"})
        draw.rounded_rectangle((190,y,410,y+28),radius=4,fill=PALE if selected else PAPER)
        indent=17 if label.startswith("  ") else 0
        shade=[PINK,BLUE,GOLD][i%3] if variant in {"tags","pixelTag"} else ["#639077","#8a9fa7","#c2ab79"][i%3]
        draw.rounded_rectangle((196+indent,y+6,211+indent,y+21),radius=2,fill=shade)
        text(draw,(220+indent,y+5),label.replace("▾","").strip(),13,INK,650 if selected else 500)
    return image


def typography(variant):
    image,draw=scene()
    if variant in {"empty","headline","frame","trackingTight","trackingWide"}:
        guide_box(draw,(46,33,394,204),LINE)
        if variant == "empty":
            draw.line((67,69,67,125),fill=ORANGE,width=2)
        else:
            text(draw,(65,48),"Đổi sách",43,GREEN,700)
            if variant=="frame":
                guide_box(draw,(63,118,262,190),BLUE)
                for j,line in enumerate(("Mang một cuốn sách","và chọn một cuốn khác.","9 giờ tại thư viện.")):
                    text(draw,(73,125+19*j),line,13)
            elif variant.startswith("tracking"):
                track=13 if variant=="trackingWide" else 4
                x=70
                for character in "THỨ BẢY":
                    text(draw,(x,126),character,18,INK,650)
                    x+=track+int(draw.textlength(character,font=font(18,650)))
        return image
    if variant in {"badgeEmpty","circle","arc","arcOff","arcMarks","badge","badgeOffset"}:
        center=(220,118)
        if variant=="badgeEmpty":
            guide_box(draw,(120,20,320,216),LINE)
            return image
        draw.ellipse((145,43,295,193),outline=LINE,width=2)
        if variant != "circle":
            def arc_word(content,start,finish,distance):
                for i,char in enumerate(content):
                    angle=math.radians(start+(finish-start)*i/max(1,len(content)-1))
                    x,y=center[0]+math.cos(angle)*distance,center[1]+math.sin(angle)*distance
                    text(draw,(x,y),char,17,GREEN,700,"mm")
            arc_word("TRÀ MÁT",224 if variant=="arcOff" else 216,322 if variant=="arcOff" else 324,89 if variant=="badgeOffset" else 74)
            if variant in {"arcMarks","badge","badgeOffset"}:
                dot(draw,(156,79),5,GREEN)
                dot(draw,(284,79),5,ORANGE)
            if variant in {"badge","badgeOffset"}:
                arc_word("THƯ VIỆN",139,41,88 if variant=="badgeOffset" else 73)
                draw.ellipse((202,102,238,132),fill=PALE,outline=GREEN,width=2)
        return image
    if variant in {"avWide","avKern","fi","ligature","glyphUsed"}:
        pair = {"avWide":"A  V","avKern":"AV","fi":"f i","ligature":"ﬁ","glyphUsed":"Mùa hè ★"}[variant]
        text(draw,(220,112),pair,72 if variant!="glyphUsed" else 43,GREEN,650,"mm")
        dashed(draw,(44,159),(396,159),LINE)
        if variant.startswith("av"):
            start,end=(181,259) if variant=="avWide" else (207,231)
            arrow(draw,(225,177),(start,177),ORANGE,2)
            arrow(draw,(222,177),(end,177),ORANGE,2)
    elif variant in {"stylesBefore","stylesAfter","features","glyphs"}:
        rows={
            "stylesBefore":("Lịch sự kiện","Giới thiệu","Địa điểm"),
            "stylesAfter":("Lịch sự kiện","Giới thiệu","Địa điểm"),
            "features":("Standard Ligatures","Stylistic Sets","Small Caps"),
            "glyphs":("a    á    ă    â","A    À    Å    Æ","•    §    ¶    ★"),
        }[variant]
        for j,row in enumerate(rows):
            y=35+j*59
            draw.rounded_rectangle((58,y,382,y+48),radius=6,fill=PALE if variant=="stylesAfter" or j==2 else "white",outline=LINE)
            text(draw,(75,y+10),row,22+j*3 if variant=="stylesBefore" else 20,INK,700 if variant=="stylesAfter" else 500)
    else:
        raise ValueError(variant)
    return image


def tile(draw, x, y, width=142, color=GREEN, label="Đăng ký", symbol=True):
    draw.rounded_rectangle((x,y,x+width,y+46),radius=10,fill=color)
    if symbol:
        draw.line((x+15,y+23,x+28,y+23),fill="white",width=3)
        draw.line((x+22,y+17,x+22,y+29),fill="white",width=3)
    text(draw,(x+width*.55,y+23),label,14,PAPER,700,"mm")


def component(variant):
    image,draw=scene()
    if variant in {"flat","flatGroup","master","nested","anchors","swatch","icon","iconMaster"}:
        if variant.startswith("icon"):
            tile(draw,193,88,56,label="",symbol=True)
            if variant=="iconMaster":
                guide_box(draw,(179,73,263,150),ORANGE)
                text(draw,(220,172),"Sub-Symbol",14,anchor="mm")
            return image
        if variant == "anchors":
            tile(draw,79,79,282)
            for pt in [(79,101),(361,101),(95,101)]:
                node(draw,pt,True)
            arrow(draw,(151,154),(93,154))
            arrow(draw,(291,154),(354,154))
        elif variant == "swatch":
            tile(draw,54,85,163)
            draw.rectangle((279,82,352,146),fill=GREEN)
            node(draw,(352,146),True)
            arrow(draw,(273,113),(219,113))
        else:
            tile(draw,137,86,166)
            if variant in {"flatGroup","master","nested"}:
                guide_box(draw,(125,73,316,145),ORANGE if variant=="master" else BLUE)
            if variant=="nested":
                guide_box(draw,(147,92,173,124),ORANGE)
            elif variant=="master":
                text(draw,(220,167),"Symbol",16,anchor="mm")
        return image
    if variant in {"plane","planeShift"}:
        for i in range(-153,278,28):
            draw.line((22,i,417,i+126),fill=LINE)
            draw.line((22,i+134,417,i),fill=LINE)
        x=65 if variant=="plane" else 108
        poly=[(x,84),(x+203,122),(x+252,171),(x+49,133)]
        draw.polygon(poly,fill=GREEN,outline=INK,width=2)
        draw.line((x+31,101,x+149,123),fill=GOLD,width=6)
        if variant=="planeShift":
            arrow(draw,(75,64),(128,74))
        return image
    if variant in {"instances","local","global"}:
        for i in range(3):
            tile(draw,123,29+i*62,197,ORANGE if variant=="global" else GREEN,"Tìm hiểu" if variant=="local" and i==1 else "Đăng ký")
        return image
    tabs={
        "library":("Assets","Biểu tượng","Nút"),
        "category":("Dự án Trà Mát","Tài nguyên","Đã chọn"),
        "subcategories":("Dự án Trà Mát","Biểu tượng","Nút"),
        "assetAdded":("Dự án Trà Mát","Biểu tượng","Nút · Mới"),
    }
    header,first,second=tabs[variant]
    draw.rounded_rectangle((70,22,370,216),radius=9,fill="white",outline=LINE)
    text(draw,(91,39),header,18,INK,700)
    text(draw,(91,81),first,15)
    for j in range(3):
        x=220+j*41
        draw.rectangle((x,76,x+27,100),fill=PALE,outline=LINE)
        dot(draw,(x+13,88),6,[GREEN,BLUE,ORANGE][j])
    text(draw,(91,132),second,15)
    tile(draw,219,122,121,ORANGE if variant=="assetAdded" else GREEN)
    return image


def brush(variant):
    image,draw=scene()
    rng=random.Random(714)
    if variant=="blackWhite":
        for x,color in [(118,INK),(248,"white")]:
            draw.rounded_rectangle((x,71,x+76,148),radius=8,fill=color,outline=LINE,width=3)
        arrow(draw,(197,113),(242,113))
        return image
    if variant=="solid":
        draw.line(cubic((52,149),(148,69),(279,175),(385,82)),fill=GREEN,width=23)
        return image
    circle=variant in {"alpha","inCircle"}
    center=(220,118)
    if circle:
        dot(draw,center,96,PALE,GREEN)
    for _ in range(1650):
        x=rng.randrange(37,404)
        t=x/440
        y0=105+25*math.sin(t*6)
        width={"dry":19,"flow":24,"pressure":5+33*t,"gradient":31,"inCircle":51,"alpha":51}[variant]
        y=rng.gauss(y0,width*.48)
        if circle and math.dist((x,y),center)>95:
            continue
        if variant=="gradient" and rng.random()>t:
            continue
        shade=ORANGE if variant=="alpha" else BLUE if variant=="pressure" else GREEN
        dot(draw,(x,y),rng.choice((1,1,2)),shade)
    if variant=="flow":
        for i in range(3):
            dashed(draw,(72+i*80,168),(120+i*80,168),ORANGE,2)
    return image
