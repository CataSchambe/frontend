import React, { useState } from 'react';
import { Plus, Trash2, MoreHorizontal } from 'lucide-react';
import TicketCard from './TicketCard';

export const KanbanColumn = ({
  column,
  tickets = [],
  allColumns = [],
  onAddTicket,
  onEditTicket,
  onDeleteTicket,
  onMoveTicket,
  onDeleteColumn,
  onDropTicket,
}) => {
  const [isOver, setIsOver] = useState(false);
  const [showColMenu, setShowColMenu] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (!isOver) setIsOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsOver(false);
    try {
      const dataStr = e.dataTransfer.getData('application/json');
      if (dataStr) {
        const ticket = JSON.parse(dataStr);
        if (ticket && ticket.columnId !== column._id) {
          onDropTicket && onDropTicket(ticket, column._id);
        }
      }
    } catch (err) {
      console.error('Error procesando ticket arrastrado:', err);
    }
  };

  const handleDragStart = (e, ticket) => {
    e.dataTransfer.setData('application/json', JSON.stringify(ticket));
    e.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`flex-shrink-0 w-80 bg-bg-surface rounded-xl border p-3 flex flex-col max-h-[calc(100vh-140px)] transition-colors duration-150 ${
        isOver
          ? 'border-2 border-dashed border-accent-cyan bg-accent-cyan/5'
          : 'border-border-subtle'
      }`}
    >
      {/* Header de la columna */}
      <div className="flex items-center justify-between pb-3 px-1">
        <div className="flex items-center gap-2">
          <h3 className="font-headline font-bold text-sm text-text-main">
            {column.title}
          </h3>
          <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-bg-card text-text-muted border border-border-subtle shadow-sm">
            {tickets.length}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onAddTicket && onAddTicket(column._id)}
            title="Añadir ticket a esta columna"
            className="p-1 rounded-md hover:bg-surface-hover text-text-muted hover:text-accent-cyan transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>

          <div className="relative">
            <button
              type="button"
              onClick={() => setShowColMenu(!showColMenu)}
              className="p-1 rounded-md hover:bg-surface-hover text-text-muted hover:text-text-main transition-colors"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>

            {showColMenu && (
              <>
                <div
                  className="fixed inset-0 z-20"
                  onClick={() => setShowColMenu(false)}
                />
                <div className="absolute right-0 top-7 z-30 w-44 bg-bg-card border border-border-subtle rounded-lg shadow-xl py-1 text-xs animate-in fade-in zoom-in-95 duration-100">
                  <button
                    type="button"
                    onClick={() => {
                      setShowColMenu(false);
                      onDeleteColumn && onDeleteColumn(column._id);
                    }}
                    className="w-full px-3 py-1.5 flex items-center gap-2 hover:bg-status-danger/10 text-status-danger text-left font-medium"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Eliminar columna</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Lista vertical de tickets */}
      <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-2.5 min-h-[120px]">
        {tickets.map((ticket) => (
          <TicketCard
            key={ticket._id}
            ticket={ticket}
            columns={allColumns}
            onDragStart={handleDragStart}
            onEdit={onEditTicket}
            onDelete={onDeleteTicket}
            onMove={onMoveTicket}
          />
        ))}

        {tickets.length === 0 && (
          <div
            onClick={() => onAddTicket && onAddTicket(column._id)}
            className="flex-1 border-2 border-dashed border-border-subtle/70 rounded-lg flex flex-col items-center justify-center p-6 text-center text-text-muted hover:border-accent-cyan/50 hover:text-accent-cyan cursor-pointer transition-all"
          >
            <Plus className="w-5 h-5 mb-1 opacity-70" />
            <span className="text-xs font-medium">Añadir ticket</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default KanbanColumn;
