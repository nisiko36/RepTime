// CalendarCell.jsx
import React from "react";

function CalendarCell({ day, count, color, onClick }) {
    return (
        <div
            className="border p-4 text-center cursor-pointer"
            style={{ backgroundColor: color }}
            onClick={onClick}
        >
            {day.getDate()}
            <div className="text-sm">{count}件</div>
        </div>
    );
}

export default CalendarCell;
