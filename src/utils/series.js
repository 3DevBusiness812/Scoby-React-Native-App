export const getCurrentWeekDay=(date)=>{
    return [
      'Su',
      'Mo',
      'Tu',
      'We',
      'Th',
      'Fr',
      'Sa',
    ][new Date(date).getDay()];
}

export const getCurrentWeekNumber=(date)=>{
  return[
    'Su',
    'Mo',
    'Tu',
    'We',
    'Th',
    'Fr',
    'Sa',
  ].indexOf(date)
} 