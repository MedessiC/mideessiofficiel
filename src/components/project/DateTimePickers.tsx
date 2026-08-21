import React, { useState } from 'react';

interface DatePickerModalProps {
  selectedDate: string;
  onSelectDate: (dateStr: string) => void;
  onClose: () => void;
}

export const DatePickerModal: React.FC<DatePickerModalProps> = ({
  selectedDate,
  onSelectDate,
  onClose,
}) => {
  const [currentDate, setCurrentDate] = useState(() => new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const startingOffset = (firstDayOfWeek + 6) % 7;

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleDayClick = (dayNumber: number) => {
    const formattedMonth = String(month + 1).padStart(2, '0');
    const formattedDay = String(dayNumber).padStart(2, '0');
    const dateStr = `${year}-${formattedMonth}-${formattedDay}`;
    onSelectDate(dateStr);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in font-sans">
      <div className="w-full max-w-sm bg-white rounded-3xl p-6 border border-[#E5E7EB] shadow-2xl space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
          <div>
            <span className="text-[9px] font-mono font-bold uppercase text-[#111827] block">CALENDRIER</span>
            <h4 className="font-black text-base text-[#111827]">Choisir la date</h4>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-mono font-bold text-[#6B7280] hover:text-[#111827]"
          >
            [ FERMER ]
          </button>
        </div>

        {/* Month Navigation */}
        <div className="flex items-center justify-between bg-[#F8FAFC] px-4 py-2.5 rounded-2xl border border-[#E5E7EB]">
          <button
            type="button"
            onClick={prevMonth}
            className="text-xs font-mono font-bold px-2 py-1 text-[#111827] hover:bg-white rounded"
          >
            &lt;
          </button>
          <span className="font-extrabold text-xs text-[#111827]">
            {monthNames[month]} {year}
          </span>
          <button
            type="button"
            onClick={nextMonth}
            className="text-xs font-mono font-bold px-2 py-1 text-[#111827] hover:bg-white rounded"
          >
            &gt;
          </button>
        </div>

        {/* Days Header */}
        <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-mono font-bold text-[#6B7280]">
          <span>LUN</span><span>MAR</span><span>MER</span><span>JEU</span><span>VEN</span><span>SAM</span><span>DIM</span>
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-1.5">
          {Array.from({ length: startingOffset }).map((_, i) => (
            <div key={`blank-${i}`} className="h-9" />
          ))}

          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNum = i + 1;
            const formattedMonth = String(month + 1).padStart(2, '0');
            const formattedDay = String(dayNum).padStart(2, '0');
            const dateStr = `${year}-${formattedMonth}-${formattedDay}`;

            const isSelected = selectedDate === dateStr;

            return (
              <button
                key={dayNum}
                type="button"
                onClick={() => handleDayClick(dayNum)}
                className={`h-9 w-full rounded-xl text-xs font-bold transition-all flex items-center justify-center ${
                  isSelected
                    ? 'bg-[#191970] text-white shadow-sm font-mono'
                    : 'bg-[#F9FAFB] text-[#111827] hover:bg-black/10 hover:text-black'
                }`}
              >
                {dayNum}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

interface TimePickerModalProps {
  selectedTime: string;
  onSelectTime: (timeStr: string) => void;
  onClose: () => void;
}

export const TIME_SLOTS = [
  '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'
];

export const TimePickerModal: React.FC<TimePickerModalProps> = ({
  selectedTime,
  onSelectTime,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in font-sans">
      <div className="w-full max-w-xs bg-white rounded-3xl p-6 border border-[#E5E7EB] shadow-2xl space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
          <div>
            <span className="text-[9px] font-mono font-bold uppercase text-[#111827] block">HORAIRE</span>
            <h4 className="font-black text-base text-[#111827]">Choisir l'heure</h4>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-mono font-bold text-[#6B7280] hover:text-[#111827]"
          >
            [ FERMER ]
          </button>
        </div>

        {/* Time Slots Grid */}
        <div className="grid grid-cols-2 gap-2.5">
          {TIME_SLOTS.map((slot) => {
            const isSel = selectedTime === slot;
            return (
              <button
                key={slot}
                type="button"
                onClick={() => {
                  onSelectTime(slot);
                  onClose();
                }}
                className={`py-3 px-4 rounded-2xl text-xs font-bold font-mono transition-all flex items-center justify-between ${
                  isSel
                    ? 'bg-[#191970] text-white shadow-sm'
                    : 'bg-[#F9FAFB] text-[#111827] border border-[#E5E7EB] hover:border-black'
                }`}
              >
                <span>{slot}</span>
                {isSel && <span className="text-[10px] text-white/90">[ OK ]</span>}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
