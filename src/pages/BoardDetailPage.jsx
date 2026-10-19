import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Plus,
  ArrowLeft,
  Columns,
  Layers,
  AlertTriangle,
  FolderOpen,
} from 'lucide-react';
import boardService from '../api/boardService';
import Navbar from '../components/Navbar';
import KanbanColumn from '../components/KanbanColumn';
import Button from '../components/Button';
import Input from '../components/Input';
import Textarea from '../components/Textarea';
import Modal from '../components/Modal';
import { useToast } from '../components/Toast';

// Validaciones Zod
const columnSchema = z.object({
  title: z.string().min(1, 'El título de la columna es obligatorio').max(50),
});

const ticketSchema = z.object({
  title: z.string().min(1, 'El título del ticket es obligatorio').max(100),
  description: z.string().max(500).optional(),
  status: z.enum(['pending', 'in_progress', 'completed', 'urgent']).default('pending'),
});

export const BoardDetailPage = () => {
  const { boardId } = useParams();
  const navigate = useNavigate();
  const { success, error, warning } = useToast();

  const [board, setBoard] = useState(null);
  const [columns, setColumns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modales
  const [isColumnModalOpen, setIsColumnModalOpen] = useState(false);
  const [targetColumnForTicket, setTargetColumnForTicket] = useState(null);
  const [editingTicket, setEditingTicket] = useState(null);
  const [ticketToDelete, setTicketToDelete] = useState(null);
  const [columnToDelete, setColumnToDelete] = useState(null);
  const [isSubmittingAction, setIsSubmittingAction] = useState(false);

  // Formularios
  const {
    register: registerCol,
    handleSubmit: handleSubmitCol,
    reset: resetCol,
    formState: { errors: errorsCol, isSubmitting: isSubmittingCol },
  } = useForm({
    resolver: zodResolver(columnSchema),
  });

  const {
    register: registerTicket,
    handleSubmit: handleSubmitTicket,
    reset: resetTicket,
    setValue: setTicketValue,
    formState: { errors: errorsTicket, isSubmitting: isSubmittingTicket },
  } = useForm({
    resolver: zodResolver(ticketSchema),
  });

  // Carga inicial del tablero completo
  const loadBoardData = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await boardService.getFullBoardKanbanData(boardId);
      setBoard(data);
      setColumns(data.columns || []);
    } catch (err) {
      error(err.message || 'Error al cargar el tablero');
      if (err.status === 404) {
        navigate('/boards');
      }
    } finally {
      setIsLoading(false);
    }
  }, [boardId, error, navigate]);

  useEffect(() => {
    loadBoardData();
  }, [loadBoardData]);

  // ========================================================
  // CONTROL DE CONCURRENCIA VISUAL: OPTIMISTIC UI + ROLLBACK
  // ========================================================
  const handleMoveTicket = async (ticket, targetColumnId) => {
    if (!ticket || !targetColumnId || ticket.columnId === targetColumnId) return;

    const sourceColumnId = ticket.columnId;

    // 1. Guardar copia previa para posibilitar ROLLBACK
    const previousColumns = JSON.parse(JSON.stringify(columns));

    // 2. APLICAR ACTUALIZACIÓN OPTIMISTA INMEDIATA EN REACT
    setColumns((prevCols) =>
      prevCols.map((col) => {
        // Quitar ticket de columna origen
        if (col._id === sourceColumnId) {
          return {
            ...col,
            tickets: col.tickets.filter((t) => t._id !== ticket._id),
          };
        }
        // Agregar ticket con nuevo columnId en columna destino
        if (col._id === targetColumnId) {
          const updatedTicket = { ...ticket, columnId: targetColumnId };
          return {
            ...col,
            tickets: [...col.tickets, updatedTicket],
          };
        }
        return col;
      })
    );

    // 3. ENVIAR PETICIÓN PATCH AL SERVIDOR
    try {
      await boardService.patchTicket(boardId, sourceColumnId, ticket._id, {
        targetColumnId,
      });
      // Sincronización exitosa
    } catch (err) {
      // 4. ROLLBACK ANTE FALLO: Revertir al estado original y notificar
      console.error('[Optimistic UI Error] Fallo al mover ticket. Revirtiendo...', err);
      setColumns(previousColumns);
      error(
        `Fallo al mover "${ticket.title}": ${err.message || 'Error del servidor'}. Se revirtió el cambio.`
      );
    }
  };

  // Crear Columna
  const handleCreateColumn = async (data) => {
    try {
      const newCol = await boardService.createColumn(boardId, {
        title: data.title,
        order: columns.length,
      });
      setColumns((prev) => [...prev, { ...newCol, tickets: [] }]);
      success('Columna agregada');
      setIsColumnModalOpen(false);
      resetCol();
    } catch (err) {
      error(err.message || 'Error al crear la columna');
    }
  };

  // Eliminar Columna
  const handleDeleteColumn = async () => {
    if (!columnToDelete) return;
    try {
      setIsSubmittingAction(true);
      await boardService.deleteColumn(boardId, columnToDelete._id);
      setColumns((prev) => prev.filter((c) => c._id !== columnToDelete._id));
      success('Columna y sus tickets eliminados');
      setColumnToDelete(null);
    } catch (err) {
      error(err.message || 'Error al eliminar la columna');
    } finally {
      setIsSubmittingAction(false);
    }
  };

  // Guardar Ticket (Creación o Edición)
  const handleSaveTicket = async (data) => {
    try {
      if (editingTicket) {
        // PATCH /api/boards/:boardId/columns/:columnId/tickets/:ticketId
        const updated = await boardService.patchTicket(
          boardId,
          editingTicket.columnId,
          editingTicket._id,
          {
            title: data.title,
            description: data.description,
            status: data.status,
          }
        );

        setColumns((prevCols) =>
          prevCols.map((col) => {
            if (col._id === editingTicket.columnId) {
              return {
                ...col,
                tickets: col.tickets.map((t) => (t._id === updated._id ? updated : t)),
              };
            }
            return col;
          })
        );
        success('Ticket actualizado');
        setEditingTicket(null);
      } else if (targetColumnForTicket) {
        // POST /api/boards/:boardId/columns/:columnId/tickets
        const newTicket = await boardService.createTicket(
          boardId,
          targetColumnForTicket._id,
          {
            title: data.title,
            description: data.description,
            status: data.status,
            order: (targetColumnForTicket.tickets || []).length,
          }
        );

        setColumns((prevCols) =>
          prevCols.map((col) => {
            if (col._id === targetColumnForTicket._id) {
              return {
                ...col,
                tickets: [...col.tickets, newTicket],
              };
            }
            return col;
          })
        );
        success('Ticket creado con éxito');
        setTargetColumnForTicket(null);
      }
      resetTicket();
    } catch (err) {
      error(err.message || 'Error al guardar el ticket');
    }
  };

  // Eliminar Ticket
  const handleDeleteTicket = async () => {
    if (!ticketToDelete) return;
    try {
      setIsSubmittingAction(true);
      await boardService.deleteTicket(
        boardId,
        ticketToDelete.columnId,
        ticketToDelete._id
      );
      setColumns((prevCols) =>
        prevCols.map((col) => {
          if (col._id === ticketToDelete.columnId) {
            return {
              ...col,
              tickets: col.tickets.filter((t) => t._id !== ticketToDelete._id),
            };
          }
          return col;
        })
      );
      success('Ticket eliminado');
      setTicketToDelete(null);
    } catch (err) {
      error(err.message || 'Error al eliminar el ticket');
    } finally {
      setIsSubmittingAction(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary text-text-main flex flex-col">
      <Navbar currentBoardTitle={board?.title} />

      {/* Barra de Sub-Cabecera del Tablero */}
      <div className="bg-bg-card border-b border-border-subtle py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/boards')}
              className="p-1.5 rounded-lg bg-bg-surface hover:bg-surface-hover text-text-muted hover:text-text-main border border-border-subtle transition-colors"
              title="Volver a lista de tableros"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h1 className="font-headline font-bold text-xl sm:text-2xl text-text-main tracking-tight">
                {board?.title || 'Cargando tablero...'}
              </h1>
              {board?.description && (
                <p className="text-xs text-text-muted mt-0.5">{board.description}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="gradient"
              onClick={() => setIsColumnModalOpen(true)}
              icon={Plus}
              size="sm"
            >
              Nueva Columna
            </Button>
          </div>
        </div>
      </div>

      {/* Contenedor Principal Kanban (Scroll horizontal) */}
      <main className="flex-1 p-4 sm:p-6 overflow-x-auto flex gap-5 items-start">
        {isLoading && (
          <div className="flex gap-5 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-80 h-[500px] bg-bg-surface rounded-xl border border-border-subtle"
              />
            ))}
          </div>
        )}

        {!isLoading &&
          columns.map((col) => (
            <KanbanColumn
              key={col._id}
              column={col}
              tickets={col.tickets || []}
              allColumns={columns}
              onAddTicket={() => {
                setTargetColumnForTicket(col);
                resetTicket({ title: '', description: '', status: 'pending' });
              }}
              onEditTicket={(ticket) => {
                setEditingTicket(ticket);
                setTicketValue('title', ticket.title);
                setTicketValue('description', ticket.description || '');
                setTicketValue('status', ticket.status || 'pending');
              }}
              onDeleteTicket={(ticket) => setTicketToDelete(ticket)}
              onMoveTicket={handleMoveTicket}
              onDeleteColumn={() => setColumnToDelete(col)}
              onDropTicket={handleMoveTicket}
            />
          ))}

        {!isLoading && columns.length === 0 && (
          <div className="w-full max-w-md mx-auto my-16 bg-bg-card rounded-2xl border border-dashed border-border-subtle p-8 text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-xl bg-bg-surface flex items-center justify-center text-accent-cyan mb-3">
              <Columns className="w-6 h-6" />
            </div>
            <h3 className="font-headline font-bold text-base text-text-main mb-1">
              Este tablero no tiene columnas
            </h3>
            <p className="text-xs text-text-muted mb-5">
              Crea tu primera columna (ej. "Por Hacer", "En Progreso", "Hecho") para empezar a agregar tickets.
            </p>
            <Button
              variant="gradient"
              icon={Plus}
              onClick={() => setIsColumnModalOpen(true)}
            >
              Crear Primera Columna
            </Button>
          </div>
        )}
      </main>

      {/* Modal: Crear Columna */}
      <Modal
        isOpen={isColumnModalOpen}
        onClose={() => {
          setIsColumnModalOpen(false);
          resetCol();
        }}
        title="Crear Nueva Columna"
        showFooter={false}
      >
        <form onSubmit={handleSubmitCol(handleCreateColumn)} className="flex flex-col gap-4">
          <Input
            label="Título de la Columna"
            placeholder="ej. En Revisión"
            badge="Obligatorio"
            error={errorsCol.title?.message}
            {...registerCol('title')}
          />
          <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-border-subtle">
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setIsColumnModalOpen(false);
                resetCol();
              }}
              disabled={isSubmittingCol}
            >
              Cancelar
            </Button>
            <Button type="submit" variant="gradient" isLoading={isSubmittingCol}>
              Crear Columna
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal: Crear o Editar Ticket */}
      <Modal
        isOpen={!!targetColumnForTicket || !!editingTicket}
        onClose={() => {
          setTargetColumnForTicket(null);
          setEditingTicket(null);
          resetTicket();
        }}
        title={editingTicket ? 'Editar Ticket' : `Nuevo Ticket en "${targetColumnForTicket?.title}"`}
        showFooter={false}
      >
        <form onSubmit={handleSubmitTicket(handleSaveTicket)} className="flex flex-col gap-4">
          <Input
            label="Título del Ticket"
            placeholder="ej. Diseñar componente Modal"
            badge="Obligatorio"
            error={errorsTicket.title?.message}
            {...registerTicket('title')}
          />

          <Textarea
            label="Descripción detallada"
            placeholder="Notas, criterios de aceptación o enlaces..."
            rows={3}
            error={errorsTicket.description?.message}
            {...registerTicket('description')}
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-text-main">Prioridad / Estado</label>
            <select
              className="w-full py-2 px-3 bg-bg-surface text-text-main text-sm rounded-lg border border-border-subtle focus:outline-none focus:border-accent-cyan"
              {...registerTicket('status')}
            >
              <option value="pending">Pendiente (Normal)</option>
              <option value="in_progress">En Curso</option>
              <option value="urgent">Urgente</option>
              <option value="completed">Finalizado</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-border-subtle">
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setTargetColumnForTicket(null);
                setEditingTicket(null);
                resetTicket();
              }}
              disabled={isSubmittingTicket}
            >
              Cancelar
            </Button>
            <Button type="submit" variant="gradient" isLoading={isSubmittingTicket}>
              {editingTicket ? 'Guardar Cambios' : 'Crear Ticket'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal: Confirmar Borrado de Ticket */}
      <Modal
        isOpen={!!ticketToDelete}
        onClose={() => setTicketToDelete(null)}
        title="¿Eliminar ticket?"
        confirmText="Eliminar"
        confirmVariant="danger"
        confirmLoading={isSubmittingAction}
        onConfirm={handleDeleteTicket}
      >
        <p className="text-sm text-text-muted">
          ¿Estás seguro de que deseas eliminar permanentemente el ticket{' '}
          <strong className="text-text-main">"{ticketToDelete?.title}"</strong>?
        </p>
      </Modal>

      {/* Modal: Confirmar Borrado de Columna (Cascada a Tickets) */}
      <Modal
        isOpen={!!columnToDelete}
        onClose={() => setColumnToDelete(null)}
        title="¿Eliminar columna?"
        confirmText="Eliminar Columna"
        confirmVariant="danger"
        confirmLoading={isSubmittingAction}
        onConfirm={handleDeleteColumn}
      >
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-full bg-status-danger/15 text-status-danger flex-shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="flex flex-col gap-1.5 text-xs text-text-muted">
            <p className="text-text-main font-semibold text-sm">
              Estás a punto de eliminar la columna "{columnToDelete?.title}"
            </p>
            <p>
              Esta acción aplicará un <strong>borrado en cascada</strong>: se eliminarán
              permanentemente todos los tickets contenidos en esta columna.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default BoardDetailPage;
