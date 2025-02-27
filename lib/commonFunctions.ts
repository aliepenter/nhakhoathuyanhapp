export const formatDate = (isoDateString: any, type: DateFormatType, timeZone: string = 'Asia/Ho_Chi_Minh'): string => {
    const date = new Date(isoDateString);

    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
        timeZone: timeZone
    };

    const formattedDate = new Intl.DateTimeFormat('en-GB', options).format(date);
    const [day, month, year, hour, minute, second] = formattedDate.split(/[\s:/,]/).map(part => part.trim());
    switch (type) {
        case 'full':
            return `Ngày ${day} tháng ${month} năm ${year}`;
        case 'minimize':
            return `${day}/${month}/${year}`;
        case 'day':
            return `${day}`;
        case 'month':
            return `${month}`;
        case 'year':
            return `${year}`;
        case 'isoDate':
            return `${year}-${month}-${day}`;
        case 'path':
            return `${day}${month}${year}`;
        default:
            throw new Error(`Unknown format type: ${type}`);
    }
};


export const formatDateTime = (isoDateString: any) => {
    const date = new Date(isoDateString);

    const hours = date.getHours();
    const minutes = date.getMinutes();

    const dayOfWeek = date.getDay();
    const days = ['Chủ Nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
    const dayOfWeekText = days[dayOfWeek];

    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');

    const year = date.getFullYear();

    const formattedTime = `${hours}:${minutes < 10 ? '0' + minutes : minutes} ${dayOfWeekText}, ${day}/${month}/${year}`;

    return formattedTime;
}

export const formatISODateToAMPM = (isoDate: string | number | Date) => {
    const date = new Date(isoDate);
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const period = hours >= 12 ? 'CH' : 'SA';

    hours = hours % 12;
    hours = hours ? hours : 12;

    const formattedTime = `${hours}:${minutes < 10 ? '0' + minutes : minutes} ${period}`;

    return formattedTime;
}
export const formatMoney = (amount: any) => {
    amount = parseFloat(amount.toString().replace(/,/g, '')).toFixed(0);

    if (amount === '') {
        return '';
    }

    let formatted = '';
    let count = 0;

    for (let i = amount.length - 1; i >= 0; i--) {
        formatted = amount[i] + formatted;
        count++;

        if (count % 3 === 0 && i > 0) {
            formatted = '.' + formatted;
        }
    }

    formatted += 'đ';
    return formatted;
}

export const calculateDaysDifference = (dateString: any) => {
    const currentDate = new Date();
    const providedDate = new Date(dateString);
    const timeDifference = currentDate.getTime() - providedDate.getTime();
    const daysDifference = Math.floor(timeDifference / (1000 * 3600 * 24));

    return daysDifference;
}

export const getToday = (type: string) => {
    const date = new Date();

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    let currentDate = ``;
    if (type === 'path') {
        currentDate = `${day}${month}${year}_${hours}${minutes}${seconds}`;
    } else if (type === 'path_minimize') {
        currentDate = `${day}${month}${year}`;
    } else {
        currentDate = `${day}/${month}/${year}`;
    }
    return currentDate;
}


export const formatInformation = (id: number | undefined, date: string | undefined, phoneNumber: string | undefined) => {
    if (!id || !date || !phoneNumber) return false;
    const year = new Date(date).getFullYear();

    return `${id}${year}${phoneNumber}`;
}


export const calculatePaymentDetails = (tong_so_tien: string, so_tien_can_tra_ki_toi: string, data: any) => {
    const tongSoTienDaThanhToan = data.reduce((total: any, item: { so_tien: any; }) => total + parseInt(item.so_tien), 0);

    const nearestPaymentDate = data
        .map((item: { ngay_thanh_toan: string | number | Date; }) => new Date(item.ngay_thanh_toan))
        .reduce((latest: number, current: number) => (current > latest ? current : latest), new Date(0));

    const soTienConLai = parseInt(tong_so_tien) - tongSoTienDaThanhToan;

    const soTienCanTraKiToi = soTienConLai >= parseInt(so_tien_can_tra_ki_toi) ? parseInt(so_tien_can_tra_ki_toi) : soTienConLai;

    const currentDate = new Date();
    const nextPaymentDate = new Date(nearestPaymentDate.setMonth(nearestPaymentDate.getMonth() + 1));
    const ngayDenHanThanhToan = nextPaymentDate.toISOString().split('T')[0];

    const status = nextPaymentDate <= currentDate;

    return {
        so_tien_da_thanh_toan: tongSoTienDaThanhToan,
        so_tien_con_lai: soTienConLai,
        so_tien_can_tra_ki_toi: soTienCanTraKiToi,
        ngay_den_han_thanh_toan: ngayDenHanThanhToan,
        status: status
    };
};


export const checkDay = (schedule: string | number | Date | null) => {
    if (!schedule) return false;
    const targetDate = new Date(schedule);
    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const threeDaysLater = new Date(today);
    // số kia là số ngày trước khi đến lịch hẹn thì sẽ thông báo, hiện tại sẽ để là 1 ngày 
    threeDaysLater.setDate(today.getDate() + 3);

    const isGreaterThanTodayAndWithinThreeDays = targetDate > today && targetDate <= threeDaysLater;

    return isGreaterThanTodayAndWithinThreeDays;
}

export const checkTodayIsShoot = (data: any[] | undefined) => {
    return data?.find(image => formatDate(image.ngay_chup, 'path') === getToday('path_minimize'));
}

export const timeAgo = (isoDate: string) => {
    const now = new Date();
    const targetDate = new Date(isoDate);
    const diffInSeconds = Math.floor((now.getTime() - targetDate.getTime()) / 1000);

    // Nếu nhỏ hơn 60 giây
    if (diffInSeconds < 60) {
        return `${diffInSeconds} giây trước`;
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);

    // Nếu nhỏ hơn 60 phút
    if (diffInMinutes < 60) {
        return `${diffInMinutes} phút trước`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);

    // Nếu nhỏ hơn 24 giờ
    if (diffInHours < 24) {
        return `${diffInHours} giờ trước`;
    }

    const diffInDays = Math.floor(diffInHours / 24);

    // Nếu nhỏ hơn 30 ngày (khoảng 1 tháng)
    if (diffInDays < 30) {
        return `${diffInDays} ngày trước`;
    }

    const diffInMonths = Math.floor(diffInDays / 30);

    // Nếu nhỏ hơn 12 tháng (khoảng 1 năm)
    if (diffInMonths < 12) {
        return `${diffInMonths} tháng trước`;
    }

    const diffInYears = Math.floor(diffInMonths / 12);
    return `${diffInYears} năm trước`;
}