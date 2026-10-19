import React, { useState } from 'react';
import { MoreVertical, Trash2, Edit3, ArrowRightLeft, Clock, GripVertical } from 'lucide-react';

export const TicketCard = ({
  ticket,
  onEdit,
  onDelete,
  onMove,
  columns = [],
  isDragging = false,
  onDragStart,
  onDragEnd,
}) => {
  const [showMenu, setShowMenu] = useState(false);

  // Mapeo semántico de prioridades según DESIGN.md
  const statusStyles = {
    pending: 'bg-status-warning/15 text-status-warning border-status-warning/30',
    in_progress: 'bg-accent-purple/15 text-accent-purple border-accent-purple/30',
    completed: 'bg-status-success/15 text-status-success border-status-success/30',
    urgent: 'bg-status-danger/15 text-status-danger border-status-danger/30',
  };

  const statusLabel = {
    pending: 'Pendiente',
    in_progress: 'En Curso',
    completed: 'Finalizado',
    urgent: 'Urgente',
  };

  const currentStatus = ticket.status || 'pending';

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart && onDragStart(e, ticket)}
      onDragEnd={onDragEnd}
      className={`group relative bg-bg-card rounded-lg border border-border-subtle p-3.5 shadow-card hover:border-accent-cyan/60 transition-all duration-200 cursor-grab active:cursor-grabbing select-none flex flex-col gap-2.5 ${
        isDragging ? 'opacity-40 scale-95 border-dashed border-accent-cyan' : ''
      }`}
    >
      {/* Header: ID/Grip + Acciones rápidas */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-text-muted">
          <GripVertical className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 transition-opacity" />
          <span className="font-mono text-[11px] font-medium tracking-wider uppercase opacity-70">
            #{ticket._id ? ticket._id.slice(-5) : 'TCK'}
          </span>
        </div>

        {/* Menú de opciones */}
        <div className="relative">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="p-1 rounded hover:bg-surface-hover text-text-muted hover:text-text-main transition-colors"
            aria-label="Opciones del ticket"
          >
            <MoreVertical className="w-3.5 h-3.5" />
          </button>

          {showMenu && (
            <>
              <div
                className="fixed inset-0 z-20"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(false);
                }}
              />
              <div className="absolute right-0 top-6 z-30 w-44 bg-bg-card border border-border-subtle rounded-lg shadow-xl py-1 text-xs animate-in fade-in zoom-in-95 duration-100">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMenu(false);
                    onEdit && onEdit(ticket);
                  }}
                  className="w-full px-3 py-1.5 flex items-center gap-2 hover:bg-surface-hover text-left text-text-main"
                >
                  <Edit3 className="w-3.5 h-3.5 text-accent-cyan" />
                  <span>Editar contenido</span>
                </button>

                {columns && columns.length > 1 && (
                  <div className="border-t border-border-subtle my-1 pt-1">
                    <span className="px-3 py-0.5 text-[10px] text-text-muted uppercase font-semibold block">
                      Mover a:
                    </span>
                    {columns
                      .filter((c) => c._id !== ticket.columnId)
                      .map((col) => (
                        <button
                          key={col._id}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowMenu(false);
                            onMove && onMove(ticket, col._id);
                          }}
                          className="w-full px-3 py-1 flex items-center gap-1.5 hover:bg-surface-hover text-left text-text-main"
                        >
                          <ArrowRightLeft className="w-3 h-3 text-accent-purple" />
                          <span className="truncate">{col.title}</span>
                        </button>
                      ))}
                  </div>
                )}

                <div className="border-t border-border-subtle mt-1 pt-1">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowMenu(false);
                      onDelete && onDelete(ticket);
                    }}
                    className="w-full px-3 py-1.5 flex items-center gap-2 hover:bg-status-danger/10 text-status-danger text-left font-medium"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Eliminar ticket</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Body: Título y descripción */}
      <div className="flex flex-col gap-1">
        <h4 className="font-headline font-semibold text-sm text-text-main leading-snug line-clamp-2">
          {ticket.title}
        </h4>
        {ticket.description && (
          <p className="text-xs text-text-muted leading-relaxed line-clamp-2">
            {ticket.description}
          </p>
        )}
      </div>

      {/* Footer: Badge de estado / fecha */}
      <div className="flex items-center justify-between pt-1 mt-1 border-t border-border-subtle/50">
        <span
          className={`px-2 py-0.5 text-[11px] font-semibold rounded-full border ${
            statusStyles[currentStatus] || statusStyles.pending
          }`}
        >
          {statusLabel[currentStatus] || currentStatus}
        </span>

        {ticket.updatedAt && (
          <span className="flex items-center gap-1 text-[10px] text-text-muted">
            <Clock className="w-2.5 h-2.5" />
            {new Date(ticket.updatedAt).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
            })}
          </span>
        )}
      </div>
    </div>
  );
};

export default TicketCard;
