export const formatDateTime = (dateStr: string, timeStr: string): string => {
  try {
    const [day, month] = dateStr.split('-');
    const [hourStr, minStr] = timeStr.split(':');
    
    let hour = parseInt(hourStr, 10);
    const min = parseInt(minStr, 10);
    
    const ampm = hour >= 12 ? 'م' : 'ص';
    hour = hour % 12;
    if (hour === 0) hour = 12;
    
    const monthsArabic = [
      'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
      'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
    ];
    
    const monthName = monthsArabic[parseInt(month, 10) - 1] || month;
    
    const toArabicNumerals = (num: number | string) => {
      const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
      return String(num).split('').map(c => arabicNumbers[parseInt(c)] || c).join('');
    };

    const formattedHour = toArabicNumerals(hour);
    const formattedMin = toArabicNumerals(min.toString().padStart(2, '0'));
    const formattedDay = toArabicNumerals(parseInt(day, 10));

    return `(${formattedHour}:${formattedMin} ${ampm} ${formattedDay} ${monthName})`;
  } catch (e) {
    return `(${timeStr} ${dateStr})`;
  }
};
