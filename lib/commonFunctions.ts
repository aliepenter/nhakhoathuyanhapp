export const formatDate = (isoDateString: any, type: any) => {
    const date = new Date(isoDateString);
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    if (type === 'full') {
        return `Ngày ${day} tháng ${month} năm ${year}`;
    } else {
        return `${day}/${month}/${year}`;
    }
}

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