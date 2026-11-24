import math
import random

from PIL import Image, ImageChops, ImageDraw

from .common import (
    BLUE, GOLD, GREEN, INK, LINE, ORANGE, PALE, PAPER, PINK, SIZE,
    arrow, cubic, dashed, dot, guide_box, node, scene, text,
)


def poster(variant):
    image, draw = scene()
    if variant == "source":
        from .common import file_card
        file_card(draw, (45,47), "SVG", "tra-mat.svg")
        arrow(draw,(151,99),(218,99))
        draw_poster(draw,(220,39,420,190))
    else:
        draw_poster(draw,(65,13,354,224), variant)
        if variant in {"leaf","hide","wire"}:
            label = {"leaf":"Đường cong lá","hide":"Lớp 50 G đã ẩn","wire":"Đường bao hình"}[variant]
            target = (306,196) if variant=="hide" else (184,115)
            arrow(draw,(380,140),target)
            text(draw,(205,208) if variant=="leaf" else (325,167),label,11)
        elif variant != "full":
            raise ValueError(variant)
    return image


def draw_poster(draw, box, variant="full"):
    x1,y1,x2,y2 = box
    wire = variant == "wire"
    sx,sy = (x2-x1)/840,(y2-y1)/620
    def point(x,y):
        return (x1+x*sx,y1+y*sy)
    draw.rectangle(box,fill=PAPER if wire else "#cedb90",outline=LINE,width=1)
    draw.rectangle((*point(58,46),*point(782,574)),fill=PAPER if wire else "#eeefd8",outline=INK)
    draw.rectangle((*point(548,155),*point(782,502)),fill=PAPER if wire else "#eb7e52",outline=INK)
    draw.line((*point(58,154),*point(782,154)),fill=INK)
    draw.line((*point(58,502),*point(782,502)),fill=INK)
    text(draw,point(86,61),"Trà Mát",max(8,int(62*sx)),INK,650)
    leaves = [
        [(303,448),(312,321),(347,237),(456,204),(463,299),(405,381)],
        [(291,449),(165,431),(128,346),(132,259),(237,272),(286,354)],
        [(302,391),(250,327),(244,235),(293,185),(344,227),(348,313)],
    ]
    for index,coords in enumerate(leaves):
        a,b,c,d,e,f = (point(*value) for value in coords)
        active = variant=="leaf" and index==0
        draw.polygon(cubic(a,b,c,d)+cubic(d,e,f,a),fill=None if wire else "#1f664a",outline=ORANGE if active else GREEN,width=2 if active else 1)
        if active:
            draw.line((a,b),fill=BLUE,width=1)
            draw.line((d,e),fill=BLUE,width=1)
            node(draw,a,True)
            node(draw,d,True)
    draw.ellipse((*point(604,220),*point(736,352)),fill=PAPER if wire else GREEN,outline=GREEN)
    draw.arc((*point(638,258),*point(703,313)),12,166,fill=GREEN if wire else PAPER,width=1)
    if variant != "hide":
        text(draw,point(725,541),"50 G",max(7,int(21*sx)),INK,650,"mm")
    if wire:
        guide_box(draw,(*point(76,51),*point(330,137)),BLUE)


def boards(variant):
    image, draw = scene()
    if variant in {"vector","pixel","half","aligned"}:
        step, left, top = 23, 125, 26
        draw.rectangle((left,top,left+8*step,top+8*step),fill="#ebece3",outline=LINE)
        if variant == "vector":
            draw.ellipse((left+17,top+16,left+158,top+166),fill=PALE,outline=GREEN,width=3)
        else:
            for y in range(8):
                for x in range(8):
                    if variant == "pixel":
                        radius = math.hypot(x-3.5,y-3.5)
                        value = GREEN if radius < 2.7 else "#a4bdb0" if radius < 3.5 else None
                    else:
                        value = (GREEN if x >= 4 else "#94b1a3" if x == 3 and variant=="half" else None) if 1 <= y <= 6 else None
                    if value:
                        draw.rectangle((left+x*step,top+y*step,left+(x+1)*step,top+(y+1)*step),fill=value)
        for i in range(9):
            draw.line((left+i*step,top,left+i*step,top+8*step),fill=LINE,width=1)
            draw.line((left,top+i*step,left+8*step,top+i*step),fill=LINE,width=1)
        if variant in {"half","aligned"}:
            x = left + (3.5 if variant=="half" else 4)*step
            dashed(draw,(x,top),(x,top+8*step))
        return image

    widths = {
        "canvas": [(60,164,235,"Vùng vẽ")],
        "desktop": [(45,172,250,"Desktop")],
        "tablet": [(22,164,216,"Desktop"),(257,192,155,"Tablet")],
        "copies": [(34,184,162,"Tablet"),(244,184,162,"Tablet 2")],
        "resize": [(78,174,295,"Desktop")],
    }
    for x,height,width,label in widths[variant]:
        y = (SIZE[1]-height)//2+10
        text(draw,(x,y-25),label,15)
        draw.rounded_rectangle((x,y,x+width,y+height),radius=3,fill="white",outline=GREEN,width=2)
        draw.rectangle((x+13,y+17,x+width*.68,y+36),fill=GREEN)
        draw.rectangle((x+13,y+49,x+width-13,y+height*.64),fill=PALE)
        for offset in (0,11,22):
            draw.rectangle((x+13,y+height*.72+offset,x+width*.76-offset,y+height*.72+offset+4),fill="#6f8877")
        if variant!="canvas":
            for pt in ((x,y),(x+width,y),(x,y+height),(x+width,y+height)):
                node(draw,pt,variant in {"copies","resize"})
    if variant=="resize":
        arrow(draw,(338,120),(402,120))
    return image


def path(variant):
    image, draw = scene()
    p0,p1,p2 = (54,164),(208,78),(378,154)
    if variant == "anchors":
        draw.line((p0,p2),fill=GREEN,width=4)
        node(draw,p0); node(draw,p2,True)
        return image
    if variant in {"cap","miter"}:
        for index,x in enumerate((118,322)):
            if variant=="cap":
                draw.line((x-70,120,x+70,120),fill=GREEN,width=35)
                if index:
                    for end in (x-70,x+70):
                        dot(draw,(end,120),17,GREEN)
                text(draw,(x,185),["Đầu phẳng","Đầu tròn"][index],17,anchor="mm")
            else:
                points = [(x-64,177),(x,62),(x+64,177)]
                draw.line(points,fill=GREEN,width=30,joint="curve")
                draw.polygon([(x-16,71),(x,30 if not index else 56),(x+16,71)],fill=GREEN)
                text(draw,(x,207),["Đỉnh nhọn","Đỉnh vát"][index],16,anchor="mm")
        return image
    if variant in {"separate","joined","broken"}:
        a,b,c,d = (48,165),(188,92),(240,104),(390,166)
        if variant == "joined":
            b,c = (211,96),(211,96)
        elif variant == "broken":
            b,c = (211,96),(239,58)
        draw.line(cubic(a,(104,187),(121,82),b),fill=GREEN,width=4)
        draw.line(cubic(c,(303,78),(334,172),d),fill=BLUE,width=4)
        for point in (a,b,c,d):
            node(draw,point,point in (b,c))
        if variant!="joined":
            dashed(draw,b,c)
        return image

    if variant == "aligned":
        p0,p1 = (54,116),(208,116)
        dashed(draw,(29,116),(401,116))
    handles = ((p1[0]-81,p1[1]+12),(p1[0]+81,p1[1]-12))
    if variant == "handleMove":
        old_handle = handles[1]
        handles = ((p1[0]-79,p1[1]+53),(p1[0]+79,p1[1]-53))
        dot(draw,old_handle,4,LINE)
        arrow(draw,old_handle,handles[1],ORANGE)
    if variant in {"smooth","smart","aligned"}:
        handles = ((p1[0]-85,p1[1]),(p1[0]+85,p1[1]))
    if variant == "sharp":
        draw.line((p0,p1,p2),fill=GREEN,width=4)
    else:
        draw.line(cubic(p0,(105,188),handles[0],p1)+cubic(p1,handles[1],(324,99),p2),fill=GREEN,width=4)
    if variant in {"handles","handleMove","smooth","multi","smart"}:
        draw.line((handles[0],handles[1]),fill=BLUE,width=2)
        for point in handles:
            dot(draw,point,5,BLUE)
    if variant == "multi":
        guide_box(draw,(30,59,229,183),BLUE)
    if variant == "plain":
        guide_box(draw,(32,59,397,185),BLUE)
    elif variant in {"handles","handleMove","sharp","smart","smooth","multi","aligned"}:
        for i,point in enumerate((p0,p1,p2)):
            node(draw,point,i==1 or (i==0 and variant in {"multi","aligned"}))
    else:
        raise ValueError(variant)
    return image


def shape_masks(offset=0, size=SIZE):
    a, b = Image.new("L", size), Image.new("L", size)
    ImageDraw.Draw(a).rounded_rectangle((78,60,254,183),radius=8,fill=255)
    ImageDraw.Draw(b).ellipse((194+offset,40,335+offset,181),fill=255)
    return a,b


def boolean(variant):
    image, draw = scene()
    a,b = shape_masks(22 if variant=="compoundMove" else 0)
    intersect = ImageChops.multiply(a,b)
    subtract = ImageChops.subtract(a,b)
    if variant == "two":
        draw.rounded_rectangle((54,58,199,181),radius=8,fill=GREEN)
        draw.ellipse((248,48,383,183),fill=GOLD)
    elif variant == "overlap":
        image.paste(GREEN,(0,0),a)
        image.paste(GOLD,(0,0),b)
        image.paste(ORANGE,(0,0),intersect)
    elif variant in {"subtract","compoundMove"}:
        image.paste(GREEN,(0,0),subtract)
        guide_box(draw,b.getbbox())
        if variant=="compoundMove":
            arrow(draw,(251,193),(284,193))
    elif variant == "divide":
        image.paste(GREEN,(-24,0),subtract)
        image.paste(ORANGE,(0,-20),intersect)
        image.paste(GOLD,(24,8),ImageChops.subtract(b,a))
    elif variant == "add":
        image.paste(GREEN,(0,0),ImageChops.lighter(a,b))
    elif variant == "results":
        for x,name,mask in [(5,"Add",ImageChops.lighter(a,b)),(150,"Intersect",intersect),(295,"Xor",ImageChops.difference(a,b))]:
            reduced = mask.crop((66,30,353,195)).resize((139,80))
            image.paste(GREEN,(x,70),reduced)
            text(draw,(x+70,176),name,17,anchor="mm")
    else:
        raise ValueError(variant)
    return image


def gear(variant):
    image,draw = scene()
    cx,cy = 213,117
    radius = 83
    deep = variant == "cogDeep"
    outline = []
    for index in range(40):
        angle = 2*math.pi*index/40
        r = radius if index%4 in (1,2) else (53 if deep else 64)
        outline.append((cx+r*math.cos(angle),cy+r*math.sin(angle)))
    if variant == "cogRound":
        draw.line(outline+[outline[0]],fill=GREEN,width=15,joint="curve")
    draw.polygon(outline,fill=GREEN)
    hole = 37 if deep else 23
    dot(draw,(cx,cy),hole,PAPER)
    if variant in {"cogSelect","cogDeep"}:
        guide_box(draw,(cx-radius,cy-radius,cx+radius,cy+radius),BLUE)
        dot(draw,(cx+hole,cy),6,ORANGE)
        dot(draw,outline[3],6,ORANGE)
        arrow(draw,(363,132),(cx+hole+8,cy+3))
    if variant == "cogNodes":
        for point in outline[::2]:
            node(draw,point)
    return image


def shape(variant):
    if variant.startswith("cog"):
        return gear(variant)
    if variant in {"two","overlap","subtract","divide","results","compoundMove","add"}:
        return boolean(variant)

    image,draw = scene()
    if variant == "base":
        draw.rounded_rectangle((143,43,296,191),radius=25,fill=GREEN)
    elif variant in {"ellipse","overflow","clipped","clipped2"}:
        box = (141,31,307,197)
        draw.ellipse(box,fill=PALE,outline=GREEN,width=2)
        if variant != "ellipse":
            stripes = Image.new("RGB",SIZE,PALE)
            paint = ImageDraw.Draw(stripes)
            for i,x in enumerate(range(63,348,32)):
                paint.line((x,176,x+62,58),fill=[GREEN,GOLD,BLUE][(i+(variant=="clipped2"))%3],width=13)
            if variant == "overflow":
                for i,x in enumerate(range(63,348,32)):
                    draw.line((x,176,x+62,58),fill=[GREEN,GOLD,BLUE][i%3],width=13)
                draw.ellipse(box,outline=ORANGE,width=2)
            else:
                mask = Image.new("L",SIZE)
                ImageDraw.Draw(mask).ellipse(box,fill=255)
                image.paste(stripes,(0,0),mask)
                draw.ellipse(box,outline=GREEN,width=2)
    elif variant in {"shadowNormal","multiply","lightNormal","screen"}:
        draw.rounded_rectangle((55,32,385,204),radius=8,fill="#aabc92" if variant in {"shadowNormal","multiply"} else "#24435c")
        if variant in {"shadowNormal","multiply"}:
            draw.ellipse((123,129,337,175),fill="#666965" if variant=="shadowNormal" else "#586b48")
            draw.rounded_rectangle((160,64,281,147),radius=17,fill="#bc733e")
        else:
            if variant=="lightNormal":
                draw.rectangle((137,55,329,184),fill="#101717")
            for size,color in [(53,"#3d6473"),(34,"#5d929b"),(18,"#f1d488")]:
                dot(draw,(233,120),size,color)
    elif variant in {"badge","badgeShadow","badgeBevel"}:
        box=(126,61,314,172)
        if variant != "badge":
            draw.rounded_rectangle((137,72,325,185),radius=29,fill="#a0aa98")
        draw.rounded_rectangle(box,radius=28,fill=GREEN,outline=GOLD if variant=="badgeBevel" else GREEN,width=4)
        if variant == "badgeBevel":
            draw.arc((131,66,309,167),182,356,fill="#a6c398",width=3)
        text(draw,(219,116),"TRÀ MÁT",24,PAPER,700,"mm")
    else:
        raise ValueError(variant)
    return image


def mix(left,right,p):
    return tuple(round(a+(b-a)*p) for a,b in zip(left,right))


def fill(variant):
    image, draw = scene()
    x1,y1,x2,y2 = 73,37,367,198
    a,b,c=(36,79,63),(239,205,127),(178,92,65)
    rng = random.Random(73)
    points = {"horizontal":((95,118),(345,118)), "conical":((223,118),(326,118))}
    start,end=points.get(variant,((99,155),(340,67)))
    vx,vy = end[0]-start[0],end[1]-start[1]
    colors = image.load()
    for y in range(y1,y2):
        for x in range(x1,x2):
            t=max(0,min(1,((x-start[0])*vx+(y-start[1])*vy)/(vx*vx+vy*vy)))
            if variant == "conical":
                t=math.atan2(y-118,x-223)/(2*math.pi)%1
            if variant in {"stops","midpoint","noiseStops","conical"}:
                split=0.25 if variant=="midpoint" else 0.5
                value=mix(a,c,t/split) if t<split else mix(c,b,(t-split)/(1-split))
            else:
                value=mix(a,b,t) if variant not in {"flat","noiseLow","noiseHigh"} else a
            if variant.startswith("noise"):
                amount={"noiseLow":9,"noiseHigh":38,"noiseStops":36*(1-abs(2*t-1))}[variant]
                n=rng.randrange(-int(amount),int(amount)+1)
                value=tuple(max(0,min(255,v+n)) for v in value)
            colors[x,y]=value
    if variant not in {"flat","noiseLow","noiseHigh"}:
        draw.line((start,end),fill=PAPER,width=2)
        for xy,color in [(start,BLUE),(end,ORANGE)]:
            dot(draw,xy,7,color,PAPER)
        if variant in {"stops","midpoint","noiseStops"}:
            position = 0.25 if variant=="midpoint" else 0.5
            dot(draw,(start[0]+vx*position,start[1]+vy*position),8,ORANGE,PAPER)
    return image


def stroke(variant):
    image,draw=scene()
    if variant in {"contourHandle","contourOut","contourIn","baked"}:
        base=(141,55,297,180)
        box=(110,27,328,208) if variant != "contourIn" else (163,76,275,159)
        if variant == "baked":
            draw.rounded_rectangle(box,radius=32,fill=GREEN)
            for pt in [(144,27),(293,27),(110,116),(328,116),(145,208),(293,208)]:
                node(draw,pt)
        else:
            draw.rounded_rectangle(base,radius=21,fill=PALE,outline=GREEN,width=3)
            draw.rounded_rectangle(box,radius=32 if variant!="contourIn" else 7,outline=BLUE,width=3)
            arrow(draw,(298,115),(323 if variant!="contourIn" else 275,115))
            if variant=="contourHandle":
                dot(draw,(329,115),7,ORANGE)
        return image
    if variant == "graph":
        draw.rectangle((61,47,370,176),fill="white",outline=LINE)
        draw.line([(69,157),(139,125),(208,63),(273,88),(360,162)],fill=GREEN,width=4)
        for pt in [(69,157),(208,63),(360,162)]:
            node(draw,pt,True)
        text(draw,(215,199),"Vị trí dọc theo nét",15,anchor="mm")
        return image
    points = cubic((55,157),(167,-11),(258,266),(384,67),segments=120)
    if variant == "dashes":
        for i in range(0,120,20):
            draw.line(points[i:i+10],fill=GREEN,width=10)
            draw.line(points[i+14:i+16],fill=GREEN,width=10)
    elif variant in {"pressure","expanded"}:
        upper,lower=[],[]
        for i,(x,y) in enumerate(points[1:-1],1):
            dx,dy=points[i+1][0]-points[i-1][0],points[i+1][1]-points[i-1][1]
            length=max(1,math.hypot(dx,dy))
            radius=2+21*math.sin(math.pi*i/120) if variant=="pressure" else 15
            upper.append((x-dy*radius/length,y+dx*radius/length))
            lower.append((x+dy*radius/length,y-dx*radius/length))
        draw.polygon(upper+lower[::-1],fill=GREEN if variant=="pressure" else PALE,outline=GREEN,width=2)
        if variant=="expanded":
            for pt in upper[::25]+lower[::25]:
                node(draw,pt)
    elif variant in {"thin","wide"}:
        draw.line(points,fill=GREEN,width=3 if variant=="thin" else 24,joint="curve")
    else:
        raise ValueError(variant)
    return image


def grid(variant):
    image,draw=scene()
    iso = variant not in {"square","blank"}
    if variant != "blank":
        if iso:
            minor=21 if variant=="coarseFine" else 36
            for i in range(-300,660,minor):
                shade="#e3e9df" if i%(2*minor) else "#c4d2c6"
                draw.line((0,i,440,i+254),fill=shade)
                draw.line((0,i,440,i-254),fill=shade)
        else:
            for i in range(10,440,25):
                draw.line((i,11,i,224),fill="#c5d2c8")
            for i in range(11,225,25):
                draw.line((10,i,430,i),fill="#c5d2c8")
    else:
        draw.rectangle((38,22,401,214),outline=LINE,width=2)
    def block(cx,cy,scale=1, outline=False):
        def pt(x,y):
            return (cx+x*scale,cy+y*scale)
        top = [pt(0,-53),pt(90,-1),pt(0,51),pt(-90,-1)]
        left = [pt(-90,-1),pt(0,51),pt(0,109),pt(-90,57)]
        right=[pt(0,51),pt(90,-1),pt(90,57),pt(0,109)]
        for poly,color in [(top,GOLD),(left,GREEN),(right,BLUE)]:
            draw.polygon(poly,fill=None if outline else color,outline=GREEN,width=2)
    if variant in {"iso","planes","topDraw","candidate","offBlocks","stack","wire","outline"}:
        block(222,95,1 if variant!="iso" else .8,variant=="outline")
        if variant in {"planes","topDraw"}:
            for pt,name in [((221,90),"Top"),((264,154),"Front"),((180,153),"Side")]:
                text(draw,pt,name,14,INK if name=="Top" else PAPER,700,"mm")
        if variant == "topDraw":
            draw.polygon([(222,59),(272,88),(222,117),(172,88)],fill="#efb785",outline=ORANGE,width=2)
        if variant in {"offBlocks","stack","wire","outline"}:
            block(248 if variant=="offBlocks" else 222,57,.53,variant=="outline")
        if variant=="wire":
            draw.line([(132,95),(222,147),(312,95)],fill="#f8dc96",width=5)
            for pt in [(132,95),(222,147),(312,95)]:
                dot(draw,pt,5,ORANGE)
        if variant=="candidate":
            guide_box(draw,(126,41,316,207))
            dot(draw,(132,94),7,ORANGE)
    elif variant in {"axes","offSnap","onSnap","coarseFine"}:
        origin=(220,113)
        for point,color in [((363,196),GREEN),((363,30),BLUE),((220,20),ORANGE)]:
            arrow(draw,origin,point,color)
        if variant in {"offSnap","onSnap"}:
            point=(282,153) if variant=="offSnap" else (291,154)
            dot(draw,point,7,ORANGE)
            guide_box(draw,(283,146,299,162),BLUE)
    elif variant not in {"square","blank"}:
        raise ValueError(variant)
    return image
