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
                // ม.ต้น (ม.1 - ม.3): Sp ขึ้นก่อน Sm
                if (subText === 'sp') subOrder = 1;
                else if (subText === 'sm') subOrder = 2;
            } else {
                // ม.ปลาย (ม.4 - ม.6): Sm ขึ้นก่อน Sp
                if (subText === 'sm') subOrder = 1;
                else if (subText === 'sp') subOrder = 2;
            }
        }
        return {
            grade,
            subNum: isNum ? parseInt(rawSub, 10) : 999,
            subOrder,
            subText
        };
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
