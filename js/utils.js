const safeParse = (data, fallback) => {
    if (!data) return fallback;
    try {
        const parsed = JSON.parse(data);
        if (Array.isArray(fallback) && !Array.isArray(parsed)) return fallback;
        return parsed;
    } catch (e) { return fallback; }
};

const generateId = (prefix) => `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 5)}`;

const formatThaiDateForFile = (dateStr) => {
    if(!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '';
    const months = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
    return `${String(d.getDate()).padStart(2,'0')}_${months[d.getMonth()]}_${d.getFullYear()+543}`;
};

const formatDateObj = (dateStr) => {
    if(!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return 'วันที่ไม่ระบุ';
    const months = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
    return `${String(d.getDate()).padStart(2,'0')} ${months[d.getMonth()]} ${d.getFullYear()+543}`;
};

const formatMonthYearShort = (dateStr) => {
    if(!dateStr) return '';
    const parts = dateStr.split('-');
    if(parts.length !== 2) return dateStr;
    const [year, month] = parts;
    const monthsShort = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
    return `${monthsShort[parseInt(month)-1] || month} ${parseInt(year)+543}`;
};

const formatMonthYearThai = (dateStr) => {
    if(!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '';
    const thaiMonths = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];
    return `${thaiMonths[d.getMonth()]} ${d.getFullYear() + 543}`;
};

const getPodiumFontSize = (name, isFirst = false) => {
    const len = (name || '').length;
    if (len > 7) return isFirst ? 'text-xs md:text-sm' : 'text-[10px] md:text-xs';
    if (len > 5) return isFirst ? 'text-sm md:text-base' : 'text-xs md:text-sm';
    return isFirst ? 'text-base md:text-xl' : 'text-sm md:text-lg';
};

const compareRoomNames = (a, b) => {
    const nameA = String(a?.name || a || '').trim();
    const nameB = String(b?.name || b || '').trim();
    const parseRoom = (str) => {
        const m = str.match(/(\d+)\s*\/\s*([0-9]+|[A-Za-zก-ฮ]+)/);
        if (!m) return { grade: 999, subNum: 999, subOrder: 999, subText: str };
        const grade = parseInt(m[1], 10);
        const rawSub = m[2];
        const isNum = /^\d+$/.test(rawSub);
        const subText = isNum ? '' : rawSub.toLowerCase();
        let subOrder = 500;
        if (!isNum) {
            if (grade >= 1 && grade <= 3) {
                if (subText === 'sp') subOrder = 1;
                else if (subText === 'sm') subOrder = 2;
            } else {
                if (subText === 'sm') subOrder = 1;
                else if (subText === 'sp') subOrder = 2;
            }
        }
        return { grade, subNum: isNum ? parseInt(rawSub, 10) : 999, subOrder, subText };
    };
    const pa = parseRoom(nameA);
    const pb = parseRoom(nameB);
    if (pa.grade !== pb.grade) return pa.grade - pb.grade;
    if (pa.subNum !== pb.subNum) return pa.subNum - pb.subNum;
    if (pa.subOrder !== pb.subOrder) return pa.subOrder - pb.subOrder;
    return pa.subText.localeCompare(pb.subText, 'th');
};

const sortRoomsNaturally = (roomList) => {
    if (!Array.isArray(roomList)) return [];
    return [...roomList].sort(compareRoomNames);
};
