import math

from PIL import ImageDraw

from .common import (
    BLUE, GOLD, GREEN, INK, LINE, ORANGE, PALE, PAPER, PINK,
    arrow, cubic, dashed, dot, file_card, guide_box, node, scene, text, thumbnail,
)


def chart(variant):
    image,draw=scene()
    box=(58,26,386,190)
    if variant in {"gamut","gamutProof"}:
        for shape,color in [([(72,175),(187,32),(368,166)],BLUE), ([(114,155),(192,64),(324,152)],GREEN)]:
            draw.polygon(shape,outline=color,width=3)
        text(draw,(274,57),"Gam đích",15,GREEN)
        text(draw,(63,202),"Phạm vi minh họa",14)
        if variant=="gamutProof":
            for point in [(177,52),(289,119),(105,149),(194,123)]:
                dot(draw,point,7,ORANGE if point!=(194,123) else GREEN)
        return image
    if variant=="hsl":
        for i,color in enumerate(("#b6544a","#d9a644","#92a85b","#4b8d76","#3e6f9e","#855d92")):
            draw.arc((130,30,309,209),i*60,i*60+58,fill=color,width=30)
        arrow(draw,(219,118),(157,176))
        return image
    if variant=="map":
        for x in range(62,380):
            p=(x-62)/317
            dark=(27,69,77); light=(248,198,135)
            color=tuple(round(a+(b-a)*p) for a,b in zip(dark,light))
            draw.line((x,52,x,101),fill=color)
            value=round(255*p)
            draw.line((x,143,x,182),fill=(value,value,value))
        arrow(draw,(221,136),(221,108))
        return image

    draw.rectangle(box,fill="white",outline=LINE,width=2)
    for i in range(1,4):
        y=box[1]+i*(box[3]-box[1])/4
        x=box[0]+i*(box[2]-box[0])/4
        draw.line((box[0],y,box[2],y),fill="#dce6dd")
        draw.line((x,box[1],x,box[3]),fill="#dce6dd")
    draw.line([(58,26),(58,190),(386,190)],fill=INK,width=2)
    if variant in {"histDark","histFlat","levels"}:
        for x in range(61,383,4):
            t=(x-61)/322
            value=math.exp(-((t-(.27 if variant=="histDark" else .51))/(.14 if variant=="histDark" else .22))**2)
            draw.rectangle((x,189-123*value*(.77+.17*math.sin(x*.53)),x+3,189),fill=GREEN)
        if variant=="levels":
            for x,color in [(111,INK),(220,LINE),(330,ORANGE)]:
                draw.polygon([(x-9,209),(x,194),(x+9,209)],fill=color)
        text(draw,(68,203),"Tối",13,anchor="lm")
        text(draw,(369,203),"Sáng",13,anchor="rm")
    elif variant in {"blend","blendSplit"}:
        points=[(60,45),(383,45)] if variant=="blend" else [(60,45),(253,45),(310,103),(378,181)]
        draw.line(points,fill=BLUE,width=4)
        for pt in points:
            node(draw,pt,True)
        text(draw,(220,210),"Sắc độ của lớp dưới",13,anchor="mm")
    elif variant in {"identity","s","rgb"}:
        dashed(draw,(61,187),(383,29),LINE)
        if variant=="identity":
            draw.line((61,187,383,29),fill=GREEN,width=4)
        elif variant=="s":
            draw.line(cubic((61,187),(161,198),(289,28),(383,29)),fill=GREEN,width=4)
            dot(draw,(153,158),6,ORANGE)
            dot(draw,(296,67),6,ORANGE)
        else:
            for color,controls in [("#af4d46",((146,177),(265,25))),(GREEN,((154,166),(291,85))),(BLUE,((153,98),(293,85)))]:
                draw.line(cubic((61,187),*controls,(383,29)),fill=color,width=4)
        text(draw,(222,210),"Giá trị đầu vào",13,anchor="mm")
    else:
        raise ValueError(variant)
    return image


def page(draw, rect, *, margins=False, bleed=False, ink=False, tint=None):
    x1,y1,x2,y2 = rect
    if bleed:
        draw.rectangle((x1-9,y1-9,x2+9,y2+9),fill=PALE,outline=ORANGE,width=2)
    draw.rectangle(rect,fill=tint or "white",outline=INK,width=2)
    if ink:
        draw.rectangle((x1+11,y1+13,x2-11,y1+26),fill=GREEN)
        draw.rectangle((x1+11,y1+40,x2-11,y1+(y2-y1)*.61),fill=PALE)
        for offset in range(4):
            y=y1+(y2-y1)*.68+offset*8
            draw.line((x1+11,y,x2-12-(offset%3)*9,y),fill=LINE,width=2)
    if margins:
        guide_box(draw,(x1+13,y1+12,x2-13,y2-14),BLUE)


def layout(variant):
    image, draw = scene()
    if variant=="new":
        draw.rounded_rectangle((55,33,385,205),radius=9,fill="white",outline=LINE)
        for i,(label,value) in enumerate([("Khổ mở","A4"),("Hướng trang","Dọc"),("Số trang","4")]):
            y=51+i*49
            text(draw,(75,y+8),label,16)
            draw.rectangle((247,y,359,y+34),fill=PALE,outline=LINE)
            text(draw,(302,y+17),value,17,anchor="mm")
        return image
    if variant=="bleedSpread":
        for x1,x2 in [(61,219),(220,378)]:
            draw.rectangle((x1-8,21,x2+8,221),fill=PALE,outline=ORANGE,width=2)
            page(draw,(x1,29,x2,213),margins=True,ink=True)
        draw.rectangle((53,91,386,131),fill="#a6bf9e")
        for x in (61,219,378):
            dashed(draw,(x,91),(x,131),BLUE)
        arrow(draw,(426,111),(389,111))
        return image
    if variant in {"single","trim","masterA","masterB","bleed","press","goodBad"}:
        if variant in {"single","trim","bleed","press"}:
            rect=(142,30,297,205)
            page(draw,rect,margins=variant=="single",bleed=variant in {"bleed","press"},ink=True)
            if variant in {"bleed","press"}:
                draw.rectangle((135,98,304,130),fill=PALE)
                dashed(draw,(142,98),(142,130),BLUE)
                dashed(draw,(297,98),(297,130),BLUE)
                if variant=="bleed":
                    arrow(draw,(361,114),(308,114))
                else:
                    for x in (142,297):
                        draw.line((x,12,x,20),fill=INK,width=2)
                        draw.line((x,215,x,224),fill=INK,width=2)
                    for y in (30,205):
                        draw.line((118,y,130,y),fill=INK,width=2)
                        draw.line((309,y,321,y),fill=INK,width=2)
        else:
            for i,x in enumerate((53,251)):
                rect=(x,39,x+135,189)
                page(draw,rect,bleed=variant=="goodBad" and i==1,ink=True)
                if variant=="goodBad":
                    draw.rectangle((x-4 if i else x+4,104,x+139 if i else x+130,136),fill=GOLD)
                    text(draw,(x+67,214),"Đủ Bleed" if i else "Hở mép",14,anchor="mm")
                else:
                    draw.rectangle((x+11,158,x+124,171),fill=ORANGE if variant=="masterB" and i else PALE)
                    text(draw,(x+67,213),"Mẫu B" if variant=="masterB" and i else "Mẫu A",15,anchor="mm")
        return image
    if variant in {"masters","applied","numbered","detached"}:
        for i,x in enumerate((43,137,231,325)):
            page(draw,(x,58,x+72,170),ink=True)
            if variant in {"numbered","detached"}:
                text(draw,(x+(10 if i%2==0 else 61),156),str(i+1),13,GREEN,650,"mm")
            if variant=="detached" and i==2:
                draw.rectangle((x+5,70,x+66,85),fill=ORANGE)
            text(draw,(x+35,194),("Mẫu A" if i<2 else "Mẫu B") if variant=="masters" else f"Trang {i+1}",12,anchor="mm")
            if variant in {"masters","applied"}:
                draw.rectangle((x+50,52,x+76,70),fill=GOLD)
                text(draw,(x+62,61),"A" if i<2 else "B",11,anchor="mm")
        return image
    x1,x2,y1,y2=61,378,29,213
    for a,b in [(x1,218),(220,x2)]:
        page(draw,(a,y1,b,y2),ink=variant=="spread")
    if variant=="margins":
        guide_box(draw,(75,43,193,198),BLUE)
        guide_box(draw,(245,43,364,198),BLUE)
        arrow(draw,(214,188),(193,188))
        arrow(draw,(224,188),(245,188))
    if variant in {"baseline","baselineFit","uneven"}:
        for y in range(47,205,15):
            draw.line((73,y,367,y),fill="#d2e3d5")
        if variant!="baseline":
            for x,shift in [(84,0),(238,6 if variant=="uneven" else 0)]:
                for j in range(8):
                    y=62+shift+j*15
                    draw.line((x,y,x+110-(18 if j%4==3 else 0),y),fill=GREEN,width=3)
    if variant in {"frame","columns","thread","overset"}:
        left=(75,43,204,196)
        guide_box(draw,left,BLUE)
        count=3 if variant=="columns" else 1
        width=121/count
        for col in range(count):
            x=79+col*width
            if col:
                dashed(draw,(x-3,49),(x-3,191),LINE)
            for j in range(8):
                draw.line((x,57+j*16,x+width-10-(9 if j%3==2 else 0),57+j*16),fill=GREEN,width=2)
        if variant in {"thread","overset"}:
            dot(draw,(204,193),5,ORANGE)
            if variant=="thread":
                guide_box(draw,(237,43,361,196),BLUE)
                arrow(draw,(209,190),(241,47))
                for j in range(5):
                    draw.line((245,57+j*16,347-(22 if j==4 else 0),57+j*16),fill=GREEN,width=2)
            else:
                text(draw,(236,187),"Chữ còn tràn",13,ORANGE,650)
    return image


def export(variant):
    image,draw=scene()
    if variant in {"area","boardSlices","layerSlice","resizedSlice","manual","photoSlice","campaign"}:
        if variant in {"photoSlice","campaign"}:
            image.paste(thumbnail("simulator/coldbrew-product-plate.png" if variant=="photoSlice" else "simulator/portrait-subject-studio.png",(354,199)),(43,18))
            guide_box(draw,(169,33,287,201),GOLD)
            if variant=="campaign":
                guide_box(draw,(99,24,346,211),PAPER)
        else:
            draw.rectangle((49,32,391,203),fill=PALE,outline=LINE)
            blocks=[(146,55,294,182)] if variant not in {"boardSlices","manual"} else [(66,57,213,185),(227,76,376,185)]
            if variant=="resizedSlice":
                blocks=[(109,55,331,181)]
            for index,box in enumerate(blocks):
                a,b,c,d=box
                draw.rounded_rectangle((a+10,b+11,c-10,d-11),radius=10,fill=GREEN)
                guide_box(draw,box,ORANGE)
                text(draw,(a,b-20),f"Lát {index+1}",13)
            if variant=="manual":
                guide_box(draw,(164,79,311,171),BLUE)
        return image
    if variant in {"scale1","scale2","scaleAll","formats","afassets","svg","raw","compressed","delivery","batch","pixels","dpi"}:
        rows={
            "scale1":[("PNG","32 × 32 px")],
            "scale2":[("PNG","32 × 32 px"),("PNG","64 × 64 px")],
            "scaleAll":[("1×","32 px"),("2×","64 px"),("3×","96 px")],
            "formats":[("PNG","2×"),("WEBP","3×"),("SVG","Vector")],
            "afassets":[("ASSETS",".afassets")],
            "svg":[("SVG","Hình vector")],
            "raw":[("RAW","Ảnh nguồn")],
            "compressed":[("WEBP","Ảnh web"),("JXL","JPEG XL")],
            "delivery":[("SVG","Màn hình"),("PDF/X","Nhà in")],
            "batch":[("RAW","Ảnh 1"),("RAW","Ảnh 2"),("TIFF","Thư mục đích")],
            "pixels":[("PNG","1200 × 900 px")],
            "dpi":[("300 DPI","4 × 3 inch"),("150 DPI","8 × 6 inch")],
        }[variant]
        for i,(ext,label) in enumerate(rows):
            x=int(220-46+(i-(len(rows)-1)/2)*135)
            file_card(draw,(x,56),ext,label,[GREEN,BLUE,ORANGE][i])
        return image
    rows={
        "presets":[("Vùng cắt","Biểu tượng"),("Hệ số","1× · 2×"),("Định dạng","PNG")],
        "destination":[("Đích xuất","/ban-giao"),("Tự xuất","Đã bật"),("Đầu ra","icon.png")],
        "updated":[("Lớp nguồn","Biểu tượng mới"),("Đầu ra","icon.png"),("Trạng thái","Đã cập nhật")],
        "profile":[("Profile","sRGB"),("Không gian","RGB"),("Đầu ra","Ảnh web")],
    }[variant]
    for i,(label,value) in enumerate(rows):
        y=29+i*62
        draw.rounded_rectangle((45,y,395,y+51),radius=6,fill="white",outline=LINE)
        text(draw,(60,y+14),label,16)
        text(draw,(379,y+25),value,15,GREEN,650,"rm")
    return image


def starter(variant):
    image,draw=scene()

    def poster(x,y,side,show_priority=True,guide=False):
        base="#234638" if show_priority else "#52624c"
        draw.rectangle((x,y,x+side,y+side),fill=base)
        if show_priority:
            size=round(side*.155)
            text(draw,(x+side*.10,y+side*.18),"Đổi sách",size,PAPER,700)
            text(draw,(x+side*.10,y+side*.34),"cuối tuần",size,PAPER,700)
            text(draw,(x+side*.10,y+side*.61),"9 giờ · Thứ Bảy",max(7,round(side*.086)),PAPER,650)
            text(draw,(x+side*.10,y+side*.75),"Thư viện phường",max(7,round(side*.078)),PAPER)
        else:
            for j,line in enumerate(("Đổi sách cuối tuần","9 giờ · Thứ Bảy","Thư viện phường")):
                text(draw,(x+side*.10,y+side*(.24+j*.18)),line,max(7,round(side*.087)),"#c9cba9",600)
        if guide:
            dashed(draw,(x+side*.09,y+side*.08),(x+side*.09,y+side*.92),GOLD)
            guide_box(draw,(x+side*.09,y+side*.18,x+side*.83,y+side*.83),LINE)

    if variant=="new":
        draw.rounded_rectangle((65,46,375,191),radius=8,fill="white",outline=LINE)
        for y,label in [(72,"Chiều rộng"),(130,"Chiều cao")]:
            text(draw,(86,y+7),label,16)
            draw.rounded_rectangle((233,y,351,y+37),radius=4,fill=PALE)
            text(draw,(290,y+18),"1080 px",16,GREEN,700,"mm")
    elif variant=="canvas":
        draw.rectangle((135,27,304,196),fill="white",outline=GREEN,width=2)
        dashed(draw,(135,211),(304,211),BLUE)
        dashed(draw,(319,27),(319,196),BLUE)
        text(draw,(220,222),"1080 px",14,BLUE,650,"mm")
        text(draw,(337,104),"1080 px",14,BLUE,650)
    elif variant in {"equal","priority","guides","tinyDraft","tinyFinal"}:
        if variant in {"tinyDraft","tinyFinal"}:
            draw.rounded_rectangle((163,17,278,220),radius=13,fill="white",outline=GREEN,width=3)
            poster(172,74,98,variant=="tinyFinal")
        else:
            poster(128,26,182,variant!="equal",variant=="guides")
    elif variant=="layers":
        poster(18,56,124)
        draw.rounded_rectangle((155,34,423,202),radius=8,fill="white",outline=LINE)
        text(draw,(169,46),"Layers",15,INK,700)
        for index,label in enumerate(("Tiêu đề","Giờ","Địa điểm","Nền")):
            y=74+28*index
            draw.rounded_rectangle((164,y,415,y+24),radius=3,fill=PALE if index==0 else PAPER)
            dot(draw,(178,y+11),5,[ORANGE,BLUE,GOLD,GREEN][index])
            text(draw,(195,y+4),label,13)
    elif variant in {"saved","export"}:
        file_card(draw,(70,49),"AF" if variant=="saved" else "PNG","Tệp Affinity" if variant=="saved" else "1080 × 1080 px")
        arrow(draw,(177,106),(217,106))
        poster(232,49,140)
    else:
        raise ValueError(variant)
    return image


SYSTEM_STATES = {
    "svgCode": ("Tệp SVG", ("viewBox → kích thước khung", "path → hình vector", "fill → màu tô")),
    "recordReady": ("Macro", ("Chọn một ảnh thử","Chuẩn bị chuỗi chỉnh ảnh")),
    "recording": ("Macro · Đang ghi", ("Ảnh thử đang mở","Đợi thao tác tiếp theo")),
    "macroSteps": ("Macro · Chuỗi thao tác", ("01  Đổi kích thước","02  Thêm lớp Curves","03  Kiểm tra độ tương phản")),
    "macroLibrary": ("Library", ("Chỉnh ảnh web","Dùng lại trên ảnh thử")),
    "script": ("Kịch bản", ("Chuẩn bị điểm vào API","Chờ thực thi")),
    "appImport": ("JavaScript → Affinity", ("Nạp module Application","Đọc thuộc tính ứng dụng")),
    "version": ("Console", ("Ứng dụng đang mở","Phiên bản: 3.3.3")),
    "sandbox": ("Phạm vi truy cập", ("Đường dẫn được cấp quyền → đọc","Ngoài phạm vi → xử lý lỗi")),
    "run": ("Console · Kết quả", ("Module đã nạp","Đã ghi thông tin ứng dụng")),
    "disconnected": ("Affinity", ("Tiến trình chưa phản hồi","Chưa có trạng thái kết nối")),
    "running": ("Affinity", ("Ứng dụng đã mở","Kiểm cấu hình listener")),
    "request": ("Kiểm kết nối", ("Máy khách → Affinity cục bộ","Yêu cầu đọc trạng thái")),
    "stream": ("Phản hồi kết nối", ("HTTP 200","Content-Type: text/event-stream")),
    "status": ("affinity_status", ("Cầu nối có phản hồi","Đọc trạng thái ứng dụng")),
    "docImport": ("JavaScript → Affinity", ("Nạp module Document","Tìm tài liệu đang mở")),
    "guard": ("Tài liệu đích", ("Có tài liệu đang mở?","Chưa có → dừng trước khi đọc")),
    "document": ("Tài liệu đích", ("Đã xác định tài liệu đang mở","Có thể đọc thuộc tính")),
    "attributes": ("Thuộc tính tài liệu", ("Session UUID → phiên tài liệu","Width × Height → kích thước")),
    "render": ("render_spread", ("Trang đang chọn → bản xem trước","So kích thước và nội dung ảnh")),
}

SYSTEM_FLOWS = {
    "script": ("JavaScript","API cần nạp","File đang mở"),
    "appImport": ("Kịch bản","Application","Affinity"),
    "docImport": ("Kịch bản","Document","Tài liệu"),
    "sandbox": ("Yêu cầu đọc","Quyền truy cập","Vị trí hợp lệ"),
    "run": ("Kịch bản","Affinity","Console"),
    "running": ("Tiến trình","Affinity","Listener"),
    "request": ("Máy khách","Yêu cầu","Cầu nối"),
    "stream": ("Máy khách","Luồng SSE","Cầu nối"),
    "status": ("Máy khách","Trạng thái","Affinity"),
    "document": ("Kịch bản","Document","Trang mở"),
    "render": ("Trang mở","render_spread","Ảnh xem trước"),
}


def system(variant):
    image,draw=scene()
    title,rows=SYSTEM_STATES[variant]
    draw.rounded_rectangle((33,28,407,207),radius=9,fill="white",outline=LINE)
    draw.rounded_rectangle((33,28,407,71),radius=9,fill=GREEN,outline=GREEN)
    text(draw,(49,44),title,16,"white",700)
    if variant in {"recording","disconnected","running"}:
        dot(draw,(381,50),6,ORANGE if variant in {"recording","disconnected"} else "#c3edb4")
    if variant in SYSTEM_FLOWS:
        for i,name in enumerate(SYSTEM_FLOWS[variant]):
            x=47+i*121
            draw.rounded_rectangle((x,91,x+99,128),radius=5,fill=PALE if i==1 else PAPER,outline=LINE)
            text(draw,(x+49,110),name,11,INK,650,"mm")
            if i<2:
                start,end=(x+101,110),(x+119,110)
                arrow(draw,end,start) if variant in {"stream","status"} else arrow(draw,start,end)
    for i,label in enumerate(rows):
        y=(138+i*30) if variant in SYSTEM_FLOWS else (88+i*35)
        draw.rounded_rectangle((47,y,392,y+28),radius=5,fill=PALE if i==len(rows)-1 else PAPER)
        text(draw,(57,y+5),label,14)
    return image
